import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ParticipantModule } from '../participant/participant.module';
import { PrismaService } from '../prisma/prisma.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
    imports: [AuthModule, ParticipantModule],
    controllers: [MessageController],
    providers: [MessageService, PrismaService],
    exports: [MessageService],
})
export class MessageModule {}
