'use client';

import { User } from '@/lib/types';
import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react';

interface AuthContextType {
    currentUser: User | null;
    setCurrentUser: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    setCurrentUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) return;
        try {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentUser(JSON.parse(user));
        } catch {
            localStorage.removeItem('user');
        }
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
