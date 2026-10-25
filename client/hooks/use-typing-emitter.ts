import { useRef } from 'react';
import { Socket } from 'socket.io-client';

interface useTypingEmitterParams {
    chatId: string | null;
    socket: Socket | null;
}

export function useTypingEmitter({ chatId, socket }: useTypingEmitterParams) {
    const isTyping = useRef(false);

    const startTyping = () => {
        if (!chatId || !socket) return;
        if (isTyping.current) return;
        isTyping.current = true;
        socket.emit('typing:start', { chatId });
    };

    const stopTyping = () => {
        if (!chatId || !socket) return;
        if (!isTyping.current) return;
        isTyping.current = false;
        socket.emit('typing:stop', { chatId });
    };

    return { startTyping, stopTyping };
}
