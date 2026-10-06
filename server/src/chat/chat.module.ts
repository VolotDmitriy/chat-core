import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MessageModule } from '../message/message.module';
import { ParticipantModule } from '../participant/participant.module';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMembershipService } from './chat-membership.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
    imports: [AuthModule, MessageModule, ParticipantModule],
    controllers: [ChatController],
    providers: [ChatService, PrismaService, ChatGateway, ChatMembershipService],
})
export class ChatModule {}
