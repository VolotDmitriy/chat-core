import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParticipantService {
    constructor(private readonly prisma: PrismaService) {}

    async isParticipant(chatId: string, userId: string): Promise<boolean> {
        const existingParticipant = await this.prisma.participant.findUnique({
            where: {
                userId_chatId: {
                    chatId,
                    userId,
                },
            },
        });
        return !!existingParticipant;
    }
}
