import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';

@Module({
    imports: [UserModule, ChatModule, MessageModule, AuthModule],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
