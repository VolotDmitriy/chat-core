import api from '@/lib/api';
import { errorHandler } from '@/lib/error-handler';
import type { Chat, Message } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface useChatParams {
    socket: Socket | null;
}

export function useChats({ socket }: useChatParams) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const hasConnectedRef = useRef(false);

    const fetchChats = () => {
        setLoading(true);
        api.get<Chat[]>('/chat')
            .then((res) => setChats(Array.isArray(res.data) ? res.data : []))
            .catch((error) => {
                errorHandler(error);
                setChats([]);
            })
            .finally(() => setLoading(false));
    };

    const messageHandler = (message: Message) => {
        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.id === message.chatId
                    ? { ...chat, messages: [...chat.messages, message] }
                    : chat,
            ),
        );
    };

    useEffect(() => {
        if (!socket) return;
        socket.on('message:new', messageHandler);
        return () => {
            socket.off('message:new', messageHandler);
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;
        socket.on('chat:added', fetchChats);

        hasConnectedRef.current = socket.connected;
        const reconnection = () => {
            if (!hasConnectedRef.current) {
                hasConnectedRef.current = true;
                return;
            } else fetchChats();
        };
        socket.on('connect', reconnection);

        return () => {
            socket.off('chat:added', fetchChats);
            socket.off('connect', reconnection);
        };
    }, [socket]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchChats();
    }, []);

    return { chats, loading, refetch: fetchChats };
}
