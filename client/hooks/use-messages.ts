import api from '@/lib/api';
import { errorHandler } from '@/lib/error-handler';
import type { Message, User } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface useMessagesParams {
    chatId: string | null;
    socket: Socket | null;
    currentUser: User | null;
}

function addMissingMessages(
    current: Message[],
    fetched: Message[],
    currentUserId: string | undefined,
) {
    const knownIds = new Set(current.map((message) => message.id));
    const missing = fetched.filter(
        (message) =>
            message.sender.id !== currentUserId && !knownIds.has(message.id),
    );
    if (missing.length === 0) return current;
    return [...current, ...missing].sort(
        (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    );
}

export function useMessages({
    chatId,
    socket,
    currentUser,
}: useMessagesParams) {
    const [messages, setMessages] = useState<Message[] | null>(null);
    const hasConnectedRef = useRef(false);

    const messageHandler = (message: Message) => {
        if (message.chatId !== chatId) return;
        if (message.sender.id === currentUser?.id) return;
        setMessages((prev) => (prev ? [...prev, message] : [message]));
    };

    useEffect(() => {
        if (!socket) return;
        socket.on('message:new', messageHandler);
        return () => {
            socket.off('message:new', messageHandler);
        };
    }, [socket, chatId]);

    useEffect(() => {
        if (!socket || !chatId) return;
        if (socket.connected) hasConnectedRef.current = true;
        let isActive = true;

        const syncAfterReconnect = () => {
            if (!hasConnectedRef.current) {
                hasConnectedRef.current = true;
                return;
            }
            api.get<Message[]>(`/message/${chatId}`)
                .then(({ data }) => {
                    if (!isActive) return;
                    setMessages((prev) =>
                        prev
                            ? addMissingMessages(prev, data, currentUser?.id)
                            : data,
                    );
                })
                .catch(errorHandler);
        };

        socket.on('connect', syncAfterReconnect);
        return () => {
            isActive = false;
            socket.off('connect', syncAfterReconnect);
        };
    }, [socket, chatId, currentUser?.id]);

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
            createdAt: new Date().toISOString(),
            sender: currentUser,
        };

        setMessages((prev) => (prev ? [...prev, fastMassage] : [fastMassage]));
        socket?.emit('message:send', { chatId, content });
    };

    const loading = messages === null && chatId !== null;

    return { messages: messages ?? [], loading, sendMessage };
}
