import { TypingByChat } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface TypingEvent {
    chatId: string;
    userId: string;
}

export function useTypingByChat(socket: Socket | null) {
    const [typingByChat, setTypingByChat] = useState<TypingByChat>({});
    const timers = useRef<Map<string, NodeJS.Timeout>>(new Map());

    useEffect(() => {
        if (!socket) return;
        const currentTimers = timers.current;

        const removeTypingUser = (data: TypingEvent) => {
            const timerKey = `${data.chatId}_${data.userId}`;
            const deletedTimer = currentTimers.get(timerKey);
            if (deletedTimer) clearTimeout(deletedTimer);
            currentTimers.delete(timerKey);

            setTypingByChat((prev) => {
                const currentUsers = prev[data.chatId];
                if (!currentUsers) return prev;

                const updatedUsers = currentUsers.filter(
                    (id) => id !== data.userId,
                );
                if (updatedUsers.length === 0) {
                    const copy = { ...prev };
                    delete copy[data.chatId];
                    return copy;
                }

                return {
                    ...prev,
                    [data.chatId]: updatedUsers,
                };
            });
        };

        const addTypingUser = (data: TypingEvent) => {
            const timerKey = `${data.chatId}_${data.userId}`;

            //old timer
            const oldTimer = currentTimers.get(timerKey);
            if (oldTimer) clearTimeout(oldTimer);

            //new timer
            const timer = setTimeout(() => {
                removeTypingUser(data);
            }, 5000);
            currentTimers.set(timerKey, timer);

            //add user
            setTypingByChat((prev) => {
                const currentUsers = prev[data.chatId] || [];
                if (currentUsers.includes(data.userId)) return prev;
                return {
                    ...prev,
                    [data.chatId]: [...currentUsers, data.userId],
                };
            });
        };

        socket.on('typing:start', addTypingUser);
        socket.on('typing:stop', removeTypingUser);

        return () => {
            socket.off('typing:start', addTypingUser);
            socket.off('typing:stop', removeTypingUser);
            currentTimers.forEach((timer) => clearTimeout(timer));
            currentTimers.clear();
        };
    }, [socket]);

    return { typingByChat };
}
