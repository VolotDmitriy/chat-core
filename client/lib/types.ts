export interface User {
    id: string;
    username: string;
    email: string;
}

export interface Chat {
    id: string;
    name: string | null;
    isGroup: boolean;
    createdAt: string;
    participants: { user: User }[];
    messages: Message[];
}

export interface Message {
    id: string;
    chatId: string;
    content: string;
    createdAt: string;
    sender: User;
}

export type TypingByChat = Record<string, string[]>;
