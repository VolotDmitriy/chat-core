import api from '@/lib/api';
import { errorHandler } from '@/lib/error-handler';
import type { Chat } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useChats() {
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchChats();
    }, []);

    return { chats, loading, refetch: fetchChats };
}
