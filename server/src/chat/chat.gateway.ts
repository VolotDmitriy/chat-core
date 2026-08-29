import { JwtService } from '@nestjs/jwt';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { MessageService } from '../message/message.service';
import { ParticipantService } from '../participant/participant.service';
import { ChatService } from './chat.service';

type AuthSocket = Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    { userId: string }
>;

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly jwtService: JwtService,
        private readonly chatService: ChatService,
        private readonly messageService: MessageService,
        private readonly participantService: ParticipantService,
    ) {}

    @WebSocketServer()
    server: Server;

    async handleConnection(client: AuthSocket) {
        const token = client.handshake.auth.token as string | undefined;

        if (!token) {
            client.disconnect();
            return;
        }

        try {
            const payload = this.jwtService.verify<{ sub: string }>(token);
            const userId = payload.sub;
            client.data.userId = userId;

            const chats = await this.chatService.getMyChats(userId);
            for (const chat of chats) {
                void client.join(chat.id);
            }
        } catch {
            client.disconnect();
            return;
        }

        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: AuthSocket) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('message:send')
    async handleMessage(
        client: AuthSocket,
        payload: { chatId: string; content: string },
    ) {
        const userId = client.data.userId;
        const message = await this.messageService.sendMessage(
            payload.chatId,
            userId,
            { content: payload.content },
        );
        this.server.to(payload.chatId).emit('message:new', message);
    }

    @SubscribeMessage('typing:start')
    async handleTypingStart(client: AuthSocket, payload: { chatId: string }) {
        const userId = client.data.userId;
        const isParticipant = await this.participantService.isParticipant(
            payload.chatId,
            userId,
        );
        if (!isParticipant) {
            return;
        }
        client.to(payload.chatId).emit('typing:start', { userId });
    }

    @SubscribeMessage('typing:stop')
    async handleTypingStop(client: AuthSocket, payload: { chatId: string }) {
        const userId = client.data.userId;
        const isParticipant = await this.participantService.isParticipant(
            payload.chatId,
            userId,
        );
        if (!isParticipant) {
            return;
        }
        client.to(payload.chatId).emit('typing:stop', { userId });
    }
}
