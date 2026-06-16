import { ConflictException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { Role } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {}

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

        const existingParticipant = await this.prisma.participant.findUnique({
            where: {
                userId_chatId: {
                    chatId,
                    userId: dto.userId,
                },
            },
        });
        if (existingParticipant) {
            throw new ConflictException('User is already a participant');
        }

        const isParticipant = await this.prisma.chat.findFirst({
            where: {
                id: chatId,
                participants: {
                    some: { userId },
                },
            },
        });

        if (!isParticipant) {
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
}
