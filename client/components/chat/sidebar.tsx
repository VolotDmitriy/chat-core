'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { SpinnerEmpty } from '@/components/ui/loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Chat } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronDown, Hash, Search } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
    chats: Chat[];
    loading: boolean;
    selectedChannel: string | null;
    onSelectChannel: (id: string) => void;
}

export function Sidebar({
    chats,
    loading,
    selectedChannel,
    onSelectChannel,
}: SidebarProps) {
    const groupChats = chats.filter((chat) => chat.isGroup);
    const directChats = chats.filter((chat) => !chat.isGroup);
    const [showChannels, setShowChannels] = useState(true);
    const [showDMs, setShowDMs] = useState(true);

    return (
        <aside className="bg-sidebar border-sidebar-border flex w-64 shrink-0 flex-col border-r">
            {/* Search */}
            <div className="p-3">
                <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder="Search..."
                        aria-label="Search"
                        className="bg-sidebar-accent border-sidebar-border h-9 pl-9 text-sm"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                {/* Channels Section */}
                <div className="px-3 py-2">
                    <button
                        onClick={() => setShowChannels((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1 text-xs font-semibold tracking-wider uppercase transition-colors"
                    >
                        <ChevronDown
                            className={cn(
                                'h-3 w-3 transition-transform',
                                !showChannels && '-rotate-90',
                            )}
                        />
                        Channels
                    </button>
                    {showChannels && (
                        <div className="space-y-0.5">
                            {loading ? (
                                <SpinnerEmpty />
                            ) : (
                                groupChats.map((chat) => (
                                    <ChannelItem
                                        key={chat.id}
                                        chat={chat}
                                        isSelected={selectedChannel === chat.id}
                                        onSelect={() =>
                                            onSelectChannel(chat.id)
                                        }
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Direct Messages Section */}
                <div className="px-3 py-2">
                    <button
                        onClick={() => setShowDMs((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1 text-xs font-semibold tracking-wider uppercase transition-colors"
                    >
                        <ChevronDown
                            className={cn(
                                'h-3 w-3 transition-transform',
                                !showDMs && '-rotate-90',
                            )}
                        />
                        Direct Messages
                    </button>
                    {showDMs && (
                        <div className="space-y-0.5">
                            {loading ? (
                                <SpinnerEmpty />
                            ) : (
                                directChats.map((chat) => (
                                    <DirectMessageItem
                                        key={chat.id}
                                        chat={chat}
                                        isSelected={selectedChannel === chat.id}
                                        onSelect={() =>
                                            onSelectChannel(chat.id)
                                        }
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </aside>
    );
}

function ChannelItem({
    chat,
    isSelected,
    onSelect,
}: {
    chat: Chat;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const lastMessage = chat.messages.at(-1);

    return (
        <button
            onClick={onSelect}
            className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors',
                isSelected
                    ? 'bg-sidebar-accent text-sidebar-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
            )}
        >
            <Hash className="h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
                <span className="truncate text-sm">
                    {chat.name ?? 'Unnamed'}
                </span>
                {lastMessage && (
                    <p className="text-muted-foreground truncate text-xs">
                        {lastMessage.content}
                    </p>
                )}
            </div>
        </button>
    );
}

function DirectMessageItem({
    chat,
    isSelected,
    onSelect,
}: {
    chat: Chat;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const partner = chat.participants[0]?.user;
    const lastMessage = chat.messages.at(-1);
    const initials = partner?.username.slice(0, 2).toUpperCase() ?? '??';

    return (
        <button
            onClick={onSelect}
            className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors',
                isSelected
                    ? 'bg-sidebar-accent text-sidebar-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
            )}
        >
            <Avatar className="h-6 w-6 shrink-0">
                <AvatarFallback className="bg-muted text-[10px]">
                    {initials}
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
                <span className="truncate text-sm">
                    {partner?.username ?? 'Unknown'}
                </span>
                {lastMessage && (
                    <p className="text-muted-foreground truncate text-xs">
                        {lastMessage.content}
                    </p>
                )}
            </div>
        </button>
    );
}
