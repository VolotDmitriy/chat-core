import api from '@/lib/api';
import { User } from '@/lib/types';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export async function login(email: string, password: string): Promise<User> {
    const { data } = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
    });
    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Strict`;
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
}

export async function register(
    username: string,
    email: string,
    password: string,
): Promise<User> {
    const { data } = await api.post<AuthResponse>('/auth/register', {
        username,
        email,
        password,
    });
    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Strict`;
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
}

export async function logout(): Promise<void> {
    document.cookie = `accessToken=; max-age=-1;`;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
}
