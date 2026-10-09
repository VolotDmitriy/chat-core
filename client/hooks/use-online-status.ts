import api from '@/lib/api';
import { errorHandler } from '@/lib/error-handler';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface useOnlineStatusParams {
    userIds: string[] | null;
    socket: Socket | null;
}

interface onlineStatus {
    userId: string;
    isOnline: boolean;
}
export function useOnlineStatus({ userIds, socket }: useOnlineStatusParams) {
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    const fetchOnlineUsers = () => {
        if (!userIds) return;
        api.post<onlineStatus[]>('/chat/online-status', { userIds })
            .then((res) =>
                setOnlineUsers(
                    new Set(
                        res.data.filter((u) => u.isOnline).map((u) => u.userId),
                    ),
                ),
            )
            .catch((error) => {
                errorHandler(error);
            });
    };

    useEffect(() => {
        if (!socket) return;

        const addOnlineUser = ({ userId }: { userId: string }) => {
            setOnlineUsers((prev) => new Set([...prev, userId]));
        };

        const removeOnlineUser = ({ userId }: { userId: string }) => {
            setOnlineUsers(
                (prev) => new Set([...prev].filter((x) => x !== userId)),
            );
        };

        socket.on('user:online', addOnlineUser);
        socket.on('user:offline', removeOnlineUser);
        return () => {
            socket.off('user:online', addOnlineUser);
            socket.off('user:offline', removeOnlineUser);
        };
    }, [socket]);

    useEffect(() => {
        fetchOnlineUsers();
    }, [userIds]);

    return { onlineUsers };
}
