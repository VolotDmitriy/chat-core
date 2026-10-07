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
import { ChatMembershipService } from './chat-membership.service';

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
        private readonly chatMembershipService: ChatMembershipService,
        private readonly messageService: MessageService,
        private readonly participantService: ParticipantService,
    ) {}

    @WebSocketServer()
    server: Server;
    private userSockets: Map<string, Socket[]> = new Map();

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

            const existingSockets = this.userSockets.get(userId);
            if (existingSockets) {
                existingSockets.push(client);
            } else {
                this.userSockets.set(userId, [client]);
            }

            const chatIds =
                await this.chatMembershipService.getUserChatsIDs(userId);
            for (const chatId of chatIds) {
                void client.join(chatId);
            }
        } catch {
            client.disconnect();
            return;
        }

        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: AuthSocket) {
        const userId = client.data.userId;
        if (!userId) return;

        const existingSockets = this.userSockets.get(userId);
        if (existingSockets) {
            const index = existingSockets.indexOf(client);
            if (index > -1) {
                existingSockets.splice(index, 1);
            }
            if (existingSockets.length === 0) {
                this.userSockets.delete(userId);
            }
        }

        console.log('Client disconnected:', client.id);
    }

    public async joinUsers(userId: string, chatId: string) {
        const sockets = this.userSockets.get(userId);
        if (!sockets) return;
        for (const socket of sockets) {
            await socket.join(chatId);
            socket.emit('chat:added', { chatId });
        }
    }

    public isUserOnline(userId: string) {
        return this.userSockets.has(userId);
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
        client
            .to(payload.chatId)
            .emit('typing:start', { userId, chatId: payload.chatId });
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
        client
            .to(payload.chatId)
            .emit('typing:stop', { userId, chatId: payload.chatId });
    }
}
