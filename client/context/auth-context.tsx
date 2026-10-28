'use client';

import { getStoredUser } from '@/lib/session';
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
        const user = getStoredUser();
        if (!user) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentUser(user);
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
