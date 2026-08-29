import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParticipantService } from './participant.service';

@Module({
    providers: [ParticipantService, PrismaService],
    exports: [ParticipantService],
})
export class ParticipantModule {}
