'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { User } from '@/lib/types';
import { MessageSquare, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TopbarProps {
    channelName: string;
}

export function Topbar({ channelName }: TopbarProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (!stored) return;
        try {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(stored));
        } catch {
            localStorage.removeItem('user');
        }
    }, []);

    return (
        <header className="border-border bg-card flex h-14 shrink-0 items-center justify-between border-b px-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]">
                    <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="text-foreground text-lg font-semibold">
                    ChatFlow
                </span>
            </div>

            {/* Channel Name */}
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground">#</span>
                <span className="text-foreground font-medium">
                    {channelName}
                </span>
            </div>

            {/* Status & User */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <Wifi className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500">Connected</span>
                </div>
                <Avatar className="h-8 w-8 ring-2 ring-[#3b82f6]/50">
                    <AvatarImage src={'/image'} alt={user?.username} />
                    <AvatarFallback className="bg-[#3b82f6] text-xs text-white">
                        {user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
