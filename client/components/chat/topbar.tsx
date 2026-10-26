'use client';

import { UserAvatar } from '@/components/user-avatar';
import { useAuth } from '@/context/auth-context';
import { MessageSquare, Wifi } from 'lucide-react';

interface TopbarProps {
    channelName: string;
}

export function Topbar({ channelName }: TopbarProps) {
    const { currentUser } = useAuth();

    return (
        <header className="border-border bg-card flex h-14 shrink-0 items-center justify-between border-b px-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]">
                    <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="text-foreground text-lg font-semibold">
                    ChatCore
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
                <UserAvatar
                    username={currentUser?.username}
                    className="ring-2 ring-[#3b82f6]/50"
                    fallbackClassName="bg-[#3b82f6] text-xs text-white"
                >
                    {/*<AvatarImage src={'/image'} alt={currentUser?.username} />*/}
                </UserAvatar>
            </div>
        </header>
    );
}
