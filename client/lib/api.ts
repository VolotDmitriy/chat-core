import {
    clearSession,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
} from '@/lib/session';
import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function clearAuthAndRedirect() {
    clearSession();
    window.location.href = '/login';
}

let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            const refToken = getRefreshToken();
            if (!refToken) return clearAuthAndRedirect();

            try {
                if (!refreshPromise) {
                    refreshPromise = api
                        .post('/auth/refresh', { refreshToken: refToken })
                        .then((res) => res.data.accessToken)
                        .finally(() => (refreshPromise = null));
                }

                const newAccToken = await refreshPromise;

                setAccessToken(newAccToken);
                error.config!.headers.Authorization = `Bearer ${newAccToken}`;

                return api(error.config!);
            } catch {
                clearAuthAndRedirect();
            }
        }
        return Promise.reject(error);
    },
);

export default api;
