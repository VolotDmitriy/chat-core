import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import type { AuthRequest } from '../types/request.types';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':chatId')
    async sendMessage(
        @Req() req: AuthRequest,
        @Param('chatId') chatId: string,
        @Body() dto: CreateMessageDto,
    ) {
        return this.messageService.sendMessage(chatId, req.user.id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':chatId')
    async getChatHistory(
        @Req() req: AuthRequest,
        @Param('chatId') chatId: string,
    ) {
        return this.messageService.getChatHistory(chatId, req.user.id);
    }
}
