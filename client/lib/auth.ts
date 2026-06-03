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
    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Strict`;
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
    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Strict`;
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
}

export async function logout(): Promise<void> {
    document.cookie = `accessToken=; max-age=-1;`;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
}
