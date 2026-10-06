import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Role } from '../../generated/prisma/enums';
import { ParticipantService } from '../participant/participant.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from './chat.gateway';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly participantService: ParticipantService,
        private readonly chatGateway: ChatGateway,
    ) {}

    async createChat(userId: string, dto: CreateChatDto) {
        if (!dto.isGroup) {
            const existing = await this.prisma.chat.findFirst({
                where: {
                    isGroup: false,
                    AND: [
                        { participants: { some: { userId } } },
                        {
                            participants: {
                                some: { userId: dto.memberIds[0] },
                            },
                        },
                    ],
                },
            });
            if (existing)
                throw new ConflictException('Direct chat already exists');
        }

        const newChat = await this.prisma.chat.create({
            data: {
                name: dto.name,
                isGroup: dto.isGroup,
                participants: {
                    create: [
                        {
                            userId,
                            role: Role.OWNER,
                        },
                        ...dto.memberIds.map((memberId) => ({
                            userId: memberId,
                            role: Role.MEMBER,
                        })),
                    ],
                },
            },
        });

        const participantsIds = [...dto.memberIds, userId];
        for (const participantId of participantsIds) {
            await this.chatGateway.joinUsers(participantId, newChat.id);
        }

        return newChat;
    }

    async getMyChats(userId: string) {
        const chats = await this.prisma.chat.findMany({
            where: {
                participants: {
                    some: { userId },
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, email: true, username: true },
                        },
                    },
                },
                messages: true,
            },
        });

        return chats;
    }

    async addMember(chatId: string, userId: string, dto: AddMemberDto) {
        const checkUser = await this.prisma.user.findUnique({
            where: {
                id: dto.userId,
            },
        });
        if (!checkUser) {
            throw new NotFoundException('User not found');
        }

        const alreadyMember = await this.participantService.isParticipant(
            chatId,
            dto.userId,
        );
        if (alreadyMember) {
            throw new ConflictException('User is already a participant');
        }

        const requesterIsParticipant =
            await this.participantService.isParticipant(chatId, userId);
        if (!requesterIsParticipant) {
            throw new ForbiddenException(
                'User is not a participant of the chat',
            );
        }

        const newParticipant = await this.prisma.participant.create({
            data: {
                chatId,
                userId: dto.userId,
                role: Role.MEMBER,
            },
        });

        return newParticipant;
    }

    async syncOnlineMember(chatId: string, userId: string, dto: AddMemberDto) {
        const member = await this.addMember(chatId, userId, dto);
        await this.chatGateway.joinUsers(dto.userId, chatId);
        return member;
    }
}
