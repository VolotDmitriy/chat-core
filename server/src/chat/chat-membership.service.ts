import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatMembershipService {
    constructor(private readonly prismaService: PrismaService) {}

    async getUserChatsIDs(userId: string) {
        const chatIds = await this.prismaService.participant.findMany({
            where: {
                userId,
            },
            select: {
                chatId: true,
            },
        });
        return chatIds.map((chatId) => chatId.chatId);
    }
}
