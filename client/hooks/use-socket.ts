import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const newSocket = io('http://localhost:3001', {
            auth: { token },
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
}
