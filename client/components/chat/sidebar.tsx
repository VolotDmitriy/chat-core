'use client';

import { Input } from '@/components/ui/input';
import { SpinnerEmpty } from '@/components/ui/loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/user-avatar';
import { useAuth } from '@/context/auth-context';
import type { Chat, TypingByChat, User } from '@/lib/types';
import { getPreviewText } from '@/lib/typing';
import { cn } from '@/lib/utils';
import { ChevronDown, Hash, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { CreateChatDialog } from './create-chat-dialog';

interface SidebarProps {
    chats: Chat[];
    typingByChat: TypingByChat;
    loading: boolean;
    selectedChannel: string | null;
    onSelectChannel: (id: string) => void;
    onSuccess: () => void;
}

export function Sidebar({
    chats,
    typingByChat,
    loading,
    selectedChannel,
    onSelectChannel,
    onSuccess,
}: SidebarProps) {
    const [showChannels, setShowChannels] = useState(true);
    const [showDMs, setShowDMs] = useState(true);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { currentUser } = useAuth();
    const { groupChats, directChats } = chatFilter(search.toLowerCase());

    function chatFilter(query: string) {
        const groupChats = chats.filter(
            (chat) =>
                chat.isGroup && (chat.name ?? '').toLowerCase().includes(query),
        );
        const directChats = chats.filter((chat) => {
            if (chat.isGroup) return false;
            const partner = chat.participants.find(
                (partner) => partner.user.id !== currentUser?.id,
            );
            return (
                partner?.user.username?.toLowerCase().includes(query) ?? true
            );
        });
        return { groupChats, directChats };
    }

    function getTypingUsers(chatId: string) {
        const targetChat = chats.find((chat) => chat.id === chatId);
        if (!targetChat) return [];
        const typingUserIds = typingByChat[chatId] || [];
        const typingUsers: User[] = [];

        for (const typingUserId of typingUserIds) {
            if (typingUserId === currentUser?.id) continue;

            const participant = targetChat.participants.find(
                (item) => item.user.id === typingUserId,
            );
            if (participant) typingUsers.push(participant.user);
        }
        return typingUsers;
    }

    return (
        <aside className="bg-sidebar border-sidebar-border flex w-64 shrink-0 flex-col border-r">
            {/* Search */}
            <div className="p-3">
                <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        aria-label="Search"
                        className="bg-sidebar-accent border-sidebar-border h-9 pl-9 text-sm"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                {/* Channels Section */}
                <div className="px-3 py-2">
                    <div className="mb-2 flex items-center justify-between">
                        <button
                            onClick={() => setShowChannels((prev) => !prev)}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-semibold tracking-wider uppercase transition-colors"
                        >
                            <ChevronDown
                                className={cn(
                                    'h-3 w-3 transition-transform',
                                    !showChannels && '-rotate-90',
                                )}
                            />
                            Channels
                        </button>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    {showChannels && (
                        <div className="space-y-0.5">
                            {loading ? (
                                <SpinnerEmpty />
                            ) : (
                                groupChats.map((chat) => (
                                    <ChannelItem
                                        key={chat.id}
                                        chat={chat}
                                        typingUsers={getTypingUsers(chat.id)}
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
                    <div className="mb-2 flex items-center justify-between">
                        <button
                            onClick={() => setShowDMs((prev) => !prev)}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-semibold tracking-wider uppercase transition-colors"
                        >
                            <ChevronDown
                                className={cn(
                                    'h-3 w-3 transition-transform',
                                    !showDMs && '-rotate-90',
                                )}
                            />
                            Direct Messages
                        </button>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    {showDMs && (
                        <div className="space-y-0.5">
                            {loading ? (
                                <SpinnerEmpty />
                            ) : (
                                directChats.map((chat) => (
                                    <DirectMessageItem
                                        key={chat.id}
                                        chat={chat}
                                        typingUsers={getTypingUsers(chat.id)}
                                        isSelected={selectedChannel === chat.id}
                                        onSelect={() =>
                                            onSelectChannel(chat.id)
                                        }
                                        currentUserId={currentUser?.id}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </ScrollArea>
            <CreateChatDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={() => {
                    setIsCreateOpen(false);
                    onSuccess();
                }}
                chats={chats}
            />
        </aside>
    );
}

function ChannelItem({
    chat,
    typingUsers,
    isSelected,
    onSelect,
}: {
    chat: Chat;
    typingUsers: User[];
    isSelected: boolean;
    onSelect: () => void;
}) {
    const previewText = getPreviewText(typingUsers, chat.messages.at(-1));

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
                {previewText && (
                    <p className="text-muted-foreground truncate text-xs">
                        {previewText}
                    </p>
                )}
            </div>
        </button>
    );
}

function DirectMessageItem({
    chat,
    isSelected,
    typingUsers,
    onSelect,
    currentUserId,
}: {
    chat: Chat;
    isSelected: boolean;
    typingUsers: User[];
    onSelect: () => void;
    currentUserId: string | undefined;
}) {
    const partner = chat.participants.find(
        (p) => p.user.id !== currentUserId,
    )?.user;
    const previewText = getPreviewText(typingUsers, chat.messages.at(-1));

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
            <UserAvatar
                username={partner?.username}
                fallbackClassName={isSelected ? 'bg-background' : undefined}
            />
            <div className="min-w-0 flex-1">
                <span className="truncate text-sm">
                    {partner?.username ?? 'Unknown'}
                </span>
                {previewText && (
                    <p className="text-muted-foreground truncate text-xs">
                        {previewText}
                    </p>
                )}
            </div>
        </button>
    );
}
