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
import { ChatService } from './chat.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    createChat(@Req() req: AuthRequest, @Body() createChatDto: CreateChatDto) {
        return this.chatService.createChat(req.user.id, createChatDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getMyChats(@Req() req: AuthRequest) {
        return this.chatService.getMyChats(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/join')
    addMember(
        @Param('id') chatId: string,
        @Req() req: AuthRequest,
        @Body() addMemberDto: AddMemberDto,
    ) {
        return this.chatService.addMember(chatId, req.user.id, addMemberDto);
    }
}
