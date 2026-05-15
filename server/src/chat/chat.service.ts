import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {}

    async createChat(userId: string, dto: CreateChatDto) {
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
                participants: true,
                messages: true,
            },
        });

        return chats;
    }

    async addMember(chatId: string, userId: string, dto: AddMemberDto) {
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
