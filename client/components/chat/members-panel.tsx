'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/user-avatar';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';
import { AddMemberDialog } from './add-member-dialog';

interface MembersPanelProps {
    participants: { user: User }[];
    chatId: string;
    socket: Socket | null;
    onSuccess: () => void;
}

export function MembersPanel({
    participants,
    chatId,
    socket,
    onSuccess,
}: MembersPanelProps) {
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const membersIds = useMemo(
        () => participants.map((u) => u.user.id),
        [participants],
    );
    const { onlineUserIds, offlineUserIds } = useOnlineStatus({
        userIds: membersIds,
        socket,
    });

    return (
        <aside className="bg-sidebar border-sidebar-border flex w-60 shrink-0 flex-col border-l">
            <div className="border-sidebar-border flex h-12 items-center justify-between border-b px-4">
                <div className="flex items-center">
                    <span className="text-foreground font-semibold">
                        Members
                    </span>
                    <span className="text-muted-foreground ml-2 text-sm">
                        — {participants.length}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Add member"
                    className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent h-7 w-7"
                    onClick={() => setIsAddMemberOpen(true)}
                >
                    <UserPlus className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                {/* Online Section */}
                <div className="p-3">
                    <div className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                        Online — {participants.length - offlineUserIds.size}
                    </div>
                    <div className="space-y-1">
                        {participants.map((user) => {
                            const isOnline = onlineUserIds.has(user.user.id);
                            if (!isOnline) return null;
                            return (
                                <MemberItem
                                    key={user.user.id}
                                    user={user.user}
                                    isOnline={true}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Offline Section */}
                <div className="p-3 pt-0">
                    <div className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                        Offline — {offlineUserIds.size}
                    </div>
                    <div className="space-y-1">
                        {participants.map((user) => {
                            const isOffline = offlineUserIds.has(user.user.id);
                            if (!isOffline) return null;
                            return (
                                <MemberItem
                                    key={user.user.id}
                                    user={user.user}
                                    isOnline={false}
                                />
                            );
                        })}
                    </div>
                </div>
            </ScrollArea>

            <AddMemberDialog
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                chatId={chatId}
                participants={participants}
                onSuccess={onSuccess}
            />
        </aside>
    );
}

function MemberItem({ user, isOnline }: { user: User; isOnline: boolean }) {
    return (
        <div className="hover:bg-sidebar-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors">
            <div className="relative shrink-0">
                <UserAvatar username={user.username} isOnline={isOnline}>
                    {/*<AvatarImage src={user.avatar} alt={user.username} />*/}
                </UserAvatar>
                <span
                    className={cn(
                        'border-sidebar absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2',
                        isOnline && 'bg-emerald-500',
                        !isOnline && 'bg-muted-foreground',
                    )}
                />
            </div>
            <div className="min-w-0 flex-1">
                <span
                    className={cn(
                        'block truncate text-sm',
                        !isOnline && 'text-muted-foreground',
                    )}
                >
                    {user.username}
                </span>
                {/*{user.lastSeen && (*/}
                {/*    <span className="text-muted-foreground text-xs">*/}
                {/*        Last seen {user.lastSeen}*/}
                {/*    </span>*/}
                {/*)}*/}
            </div>
        </div>
    );
}
