import api from '@/lib/api';
import { errorHandler } from '@/lib/error-handler';
import type { Chat } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface useChatParams {
    socket: Socket | null;
}

export function useChats({ socket }: useChatParams) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (!socket) return;
        socket.on('chat:added', fetchChats);
        return () => {
            socket.off('chat:added', fetchChats);
        };
    }, [socket]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchChats();
    }, []);

    return { chats, loading, refetch: fetchChats };
}
