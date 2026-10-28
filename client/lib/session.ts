import { User } from '@/lib/types';

const refreshTokenName = 'refreshToken';
const userStorageName = 'user';
const accessTokenName = 'accessToken';
const cookieName = 'accessToken';
const expiresTime = 7 * 24 * 60 * 60;
const path = '/';
const sameSite = 'Lax';

export interface SessionData {
    accessToken: string;
    refreshToken: string;
    user: User;
}

const writeCookie = (value: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${cookieName}=${value}; path=${path}; expires=${new Date(Date.now() + expiresTime * 1000).toUTCString()}; sameSite=${sameSite}`;
};
const removeCookie = () => {
    if (typeof document === 'undefined') return;
    document.cookie = `${cookieName}=; path=${path}; expires=${new Date(0).toUTCString()}; sameSite=${sameSite}`;
};

const getStorage = (): Storage | null => {
    if (typeof window !== 'undefined') return window.localStorage;
    return null;
};

const getAccessToken = (): string | null => {
    return getStorage()?.getItem(accessTokenName) ?? null;
};

const getRefreshToken = (): string | null => {
    return getStorage()?.getItem(refreshTokenName) ?? null;
};

const setAccessToken = (token: string) => {
    writeCookie(token);
    getStorage()?.setItem(accessTokenName, token);
};

const getStoredUser = (): User | null => {
    const user = getStorage()?.getItem(userStorageName);
    try {
        if (user) return JSON.parse(user);
    } catch {
        getStorage()?.removeItem(userStorageName);
    }
    return null;
};

const saveSession = ({ accessToken, refreshToken, user }: SessionData) => {
    setAccessToken(accessToken);
    getStorage()?.setItem(refreshTokenName, refreshToken);
    getStorage()?.setItem(userStorageName, JSON.stringify(user));
};

const clearSession = () => {
    removeCookie();
    getStorage()?.removeItem(accessTokenName);
    getStorage()?.removeItem(refreshTokenName);
    getStorage()?.removeItem(userStorageName);
};

export {
    clearSession,
    getAccessToken,
    getRefreshToken,
    getStoredUser,
    saveSession,
    setAccessToken,
};
