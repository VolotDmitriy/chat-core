import api from '@/lib/api';
import { getAccessToken } from '@/lib/session';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const RECONNECT_COOLDOWN_MS = 1000;

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3001', {
            auth: (callback) => {
                callback({ token: getAccessToken() });
            },
        });
        let lastReconnectTime = 0;

        newSocket.on('disconnect', (reason) => {
            if (reason !== 'io server disconnect') return;
            if (Date.now() - lastReconnectTime < RECONNECT_COOLDOWN_MS) return;
            lastReconnectTime = Date.now();

            api.get('/user/me')
                .then(() => {
                    newSocket.connect();
                })
                .catch(() => {
                    //if the session is invalid, redirect to login
                });
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
}
