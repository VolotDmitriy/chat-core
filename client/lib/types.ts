export interface User {
    id: string;
    username: string;
    email: string;
}

export interface Chat {
    id: string;
    name: string | null;
    isGroup: boolean;
    createdAt: Date;
    members: { user: User }[];
    messages: Message[];
}

export interface Message {
    id: string;
    content: string;
    createdAt: Date;
    sender: User;
}
