import api from '@/lib/api';
import { errorHandler } from '@/lib/error-handler';
import type { Message } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useMessages(chatId: string | null) {
    const [messages, setMessages] = useState<Message[] | null>(null);

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
        if (!chatId) return;
        const { data } = await api.post<Message>(`/message/${chatId}`, { content });
        setMessages((prev) => (prev ? [...prev, data] : [data]));
    };

    const loading = messages === null && chatId !== null;

    return { messages: messages ?? [], loading, sendMessage };
}
