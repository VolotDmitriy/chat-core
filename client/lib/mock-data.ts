export interface User {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
    lastSeen?: string;
}

export interface Channel {
    id: string;
    name: string;
    icon: string;
    lastMessage: string;
    time: string;
    unread: number;
}

export interface DirectMessage {
    id: string;
    user: User;
    lastMessage: string;
    time: string;
    unread: number;
}

export interface Message {
    id: string;
    user: User;
    content: string;
    timestamp: string;
    isOwn: boolean;
}

export const currentUser: User = {
    id: 'me',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    status: 'online',
};

export const users: User[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        status: 'online',
    },
    {
        id: '2',
        name: 'Mike Thompson',
        avatar: 'https://i.pravatar.cc/150?u=mike',
        status: 'online',
    },
    {
        id: '3',
        name: 'Emily Davis',
        avatar: 'https://i.pravatar.cc/150?u=emily',
        status: 'away',
    },
    {
        id: '4',
        name: 'James Wilson',
        avatar: 'https://i.pravatar.cc/150?u=james',
        status: 'offline',
        lastSeen: '2 hours ago',
    },
    {
        id: '5',
        name: 'Lisa Anderson',
        avatar: 'https://i.pravatar.cc/150?u=lisa',
        status: 'offline',
        lastSeen: '5 hours ago',
    },
    {
        id: '6',
        name: 'David Kim',
        avatar: 'https://i.pravatar.cc/150?u=david',
        status: 'online',
    },
    {
        id: '7',
        name: 'Anna Martinez',
        avatar: 'https://i.pravatar.cc/150?u=anna',
        status: 'offline',
        lastSeen: '1 day ago',
    },
];

export const channels: Channel[] = [
    {
        id: 'general',
        name: 'general',
        icon: '#',
        lastMessage: "Let's sync up tomorrow",
        time: '2m',
        unread: 3,
    },
    {
        id: 'engineering',
        name: 'engineering',
        icon: '#',
        lastMessage: 'PR merged successfully',
        time: '15m',
        unread: 0,
    },
    {
        id: 'design',
        name: 'design',
        icon: '#',
        lastMessage: 'New mockups are ready',
        time: '1h',
        unread: 5,
    },
    {
        id: 'random',
        name: 'random',
        icon: '#',
        lastMessage: 'Anyone up for lunch?',
        time: '3h',
        unread: 0,
    },
    {
        id: 'announcements',
        name: 'announcements',
        icon: '#',
        lastMessage: 'Company update posted',
        time: '1d',
        unread: 1,
    },
];

export const directMessages: DirectMessage[] = [
    {
        id: 'dm1',
        user: users[0],
        lastMessage: 'Thanks for the help!',
        time: '5m',
        unread: 2,
    },
    {
        id: 'dm2',
        user: users[1],
        lastMessage: 'Can we reschedule?',
        time: '30m',
        unread: 0,
    },
    {
        id: 'dm3',
        user: users[2],
        lastMessage: 'Sounds good to me',
        time: '2h',
        unread: 0,
    },
    {
        id: 'dm4',
        user: users[3],
        lastMessage: 'Let me know when free',
        time: '1d',
        unread: 0,
    },
];

export const messages: Message[] = [
    {
        id: '1',
        user: users[0],
        content:
            'Hey everyone! Just pushed the new feature to staging. Could someone take a look? 🚀',
        timestamp: '10:30 AM',
        isOwn: false,
    },
    {
        id: '2',
        user: users[1],
        content: "Nice work! I'll review it after lunch.",
        timestamp: '10:32 AM',
        isOwn: false,
    },
    {
        id: '3',
        user: currentUser,
        content: 'I can take a look now. Give me 10 minutes.',
        timestamp: '10:35 AM',
        isOwn: true,
    },
    {
        id: '4',
        user: users[0],
        content:
            'Thanks Alex! The main changes are in the (auth) module. Let me know if you have any questions.',
        timestamp: '10:36 AM',
        isOwn: false,
    },
    {
        id: '5',
        user: currentUser,
        content:
            "Looks good so far! Just noticed a minor issue with the error handling. I'll leave a comment on the PR.",
        timestamp: '10:45 AM',
        isOwn: true,
    },
    {
        id: '6',
        user: users[5],
        content: "Hey team, don't forget about the standup in 15 minutes! 📅",
        timestamp: '10:50 AM',
        isOwn: false,
    },
    {
        id: '7',
        user: users[0],
        content: 'Got it! Will fix the error handling right after standup.',
        timestamp: '10:52 AM',
        isOwn: false,
    },
    {
        id: '8',
        user: currentUser,
        content:
            'Perfect! Also, should we discuss the new API design during the standup?',
        timestamp: '10:55 AM',
        isOwn: true,
    },
    {
        id: '9',
        user: users[1],
        content:
            'Good idea! I have some thoughts on the endpoint structure we should go over.',
        timestamp: '10:57 AM',
        isOwn: false,
    },
    {
        id: '10',
        user: users[5],
        content: 'Sounds like a plan. See everyone in the call!',
        timestamp: '10:59 AM',
        isOwn: false,
    },
];
