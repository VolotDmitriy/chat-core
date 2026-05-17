import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
    constructor(private readonly prisma: PrismaService) {}

    private async checkParticipant(chatId: string, userId: string) {
        const isParticipant = await this.prisma.participant.findFirst({
            where: {
                chatId,
                userId,
            },
        });
        if (!isParticipant) {
            throw new ForbiddenException(
                'User is not a participant of the chat',
            );
        }
        return true;
    }

    async sendMessage(chatId: string, userId: string, dto: CreateMessageDto) {
        await this.checkParticipant(chatId, userId);

        const newMessage = await this.prisma.message.create({
            data: {
                chatId,
                senderId: userId,
                content: dto.content,
            },
        });

        return newMessage;
    }

    async getChatHistory(chatId: string, userId: string) {
        await this.checkParticipant(chatId, userId);

        const allMessage = await this.prisma.message.findMany({
            where: {
                chatId,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return allMessage;
    }
}
