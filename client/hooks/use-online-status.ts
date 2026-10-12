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
    const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
    const offlineUserIds = getOffline();

    function getOffline() {
        if (!userIds) return new Set<string>();
        return new Set(userIds.filter((id) => !onlineUserIds.has(id)));
    }

    const fetchOnlineUsers = () => {
        if (!userIds) return;
        api.post<onlineStatus[]>('/chat/online-status', { userIds })
            .then((res) =>
                setOnlineUserIds(
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
            setOnlineUserIds((prev) => new Set([...prev, userId]));
        };

        const removeOnlineUser = ({ userId }: { userId: string }) => {
            setOnlineUserIds(
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
        if (!socket) return;
        socket.on('connect', fetchOnlineUsers);
        return () => {
            socket.off('connect', fetchOnlineUsers);
        };
    }, [socket, userIds]);

    useEffect(() => {
        fetchOnlineUsers();
    }, [userIds]);

    return { onlineUserIds, offlineUserIds };
}
