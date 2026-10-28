import api from '@/lib/api';
import { clearSession, saveSession, SessionData } from '@/lib/session';
import { User } from '@/lib/types';

export async function login(email: string, password: string): Promise<User> {
    const { data } = await api.post<SessionData>('/auth/login', {
        email,
        password,
    });
    saveSession(data);
    return data.user;
}

export async function register(
    username: string,
    email: string,
    password: string,
): Promise<User> {
    const { data } = await api.post<SessionData>('/auth/register', {
        username,
        email,
        password,
    });
    saveSession(data);
    return data.user;
}

export async function logout(): Promise<void> {
    clearSession();
}
