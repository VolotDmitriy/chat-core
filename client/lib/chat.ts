import api from '@/lib/api';
import { User } from '@/lib/types';

interface Chat {
    name?: string;
    isGroup: boolean;
    memberIds: string[];
}

export async function createChat(data: Chat) {
    const res = await api.post<Chat>('/chat', data);
    return res.data;
}

export async function searchUsers(query: string) {
    const res = await api.get<User[]>('/user/search', { params: { q: query } });
    return res.data;
}

export async function addMember(chatId: string, userId: string) {
    const res = await api.post<void>(`/chat/${chatId}/join`, { userId });
    return res.data;
}
