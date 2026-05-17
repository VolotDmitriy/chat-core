import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
    imports: [AuthModule],
    controllers: [MessageController],
    providers: [MessageService, PrismaService],
})
export class MessageModule {}
