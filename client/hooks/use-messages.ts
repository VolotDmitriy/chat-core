import api from '@/lib/api';
import { errorHandler } from '@/lib/error-handler';
import type { Message, User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface useMessagesParams {
    chatId: string | null;
    socket: Socket | null;
    currentUser: User | null;
}

export function useMessages({
    chatId,
    socket,
    currentUser,
}: useMessagesParams) {
    const [messages, setMessages] = useState<Message[] | null>(null);

    useEffect(() => {
        if (!socket) return;
        socket.on('message:new', (message: Message) => {
            if (message.chatId !== chatId) return;
            if (message.sender.id === currentUser?.id) return;
            setMessages((prev) => (prev ? [...prev, message] : [message]));
        });
        return () => {
            socket.off('message:new');
        };
    }, [socket]);

    useEffect(() => {
        if (!chatId) return;

        api.get<Message[]>(`/message/${chatId}`)
            .then(({ data }) => setMessages(data))
            .catch((error) => {
                errorHandler(error);
                setMessages([]);
            });

        return () => setMessages(null);
    }, [chatId]);

    const sendMessage = async (content: string) => {
        if (!chatId || !socket || !currentUser) return;

        const fastMassage: Message = {
            id: crypto.randomUUID(),
            chatId: chatId,
            content,
            createdAt: new Date(),
            sender: currentUser,
        };

        setMessages((prev) => (prev ? [...prev, fastMassage] : [fastMassage]));
        socket?.emit('message:send', { chatId, content });
    };

    const loading = messages === null && chatId !== null;

    return { messages: messages ?? [], loading, sendMessage };
}
