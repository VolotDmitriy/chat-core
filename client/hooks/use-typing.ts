import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface useTypingParams {
    chatId: string | null;
    socket: Socket | null;
}

export function useTyping({ chatId, socket }: useTypingParams) {
    const [usersIds, setUserIds] = useState<string[]>([]);
    const timers = useRef<Map<string, NodeJS.Timeout>>(new Map());

    useEffect(() => {
        if (!socket || !chatId) return;
        const currentTimers = timers.current;

        socket.on('typing:start', (data) => {
            //delete old timer
            const oldtimer = currentTimers.get(data.userId);
            if (oldtimer) clearTimeout(oldtimer);

            //set new timer
            const timer = setTimeout(
                () =>
                    setUserIds((prev) =>
                        prev.filter((prevId) => prevId !== data.userId),
                    ),
                5000,
            );
            currentTimers.set(data.userId, timer);

            //add user id
            setUserIds((prev) =>
                prev?.includes(data.userId) ? prev : [...prev, data.userId],
            );
        });

        socket.on('typing:stop', (data) =>
            setUserIds((prev) =>
                prev.filter((prevId) => prevId !== data.userId),
            ),
        );
        return () => {
            socket.off('typing:start');
            socket.off('typing:stop');
            currentTimers.forEach((timer) => clearTimeout(timer));
            currentTimers.clear();
        };
    }, [chatId, socket]);

    const startTyping = () => {
        if (!chatId || !socket) return;
        socket.emit('typing:start', { chatId });
    };

    const stopTyping = () => {
        if (!chatId || !socket) return;
        socket.emit('typing:stop', { chatId });
    };

    return { startTyping, stopTyping, usersIds };
}
