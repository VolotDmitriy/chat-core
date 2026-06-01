import api from '@/lib/api';
import { errorHandler } from '@/lib/error-handler';
import type { Chat } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useChats() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Chat[]>('/chat')
            .then((res) => setChats(res.data))
            .catch((error) => {
                errorHandler(error);
                setChats([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return { chats, loading };
}
