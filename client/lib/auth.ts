import api from '@/lib/api';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; username: string };
}

export async function login(email: string, password: string): Promise<void> {
    const { data } = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
    });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
}

export async function register(
    username: string,
    email: string,
    password: string,
): Promise<void> {
    const { data } = await api.post<AuthResponse>('/auth/register', {
        username,
        email,
        password,
    });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
}

export async function logout(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
}
