'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { AddMemberDialog } from './add-member-dialog';

interface MembersPanelProps {
    participants: { user: User }[];
}

export function MembersPanel({ participants }: MembersPanelProps) {
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

    // const onlineUsers = users.filter(
    //     (u) => u.status === 'online' || u.status === 'away',
    // );
    // const offlineUsers = users.filter((u) => u.status === 'offline');

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
                        Online — {participants.length}
                    </div>
                    <div className="space-y-1">
                        {participants.map((user) => (
                            <MemberItem key={user.user.id} user={user.user} />
                        ))}
                    </div>
                </div>

                {/* Offline Section */}
                {/*<div className="p-3 pt-0">*/}
                {/*    <div className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">*/}
                {/*        Offline — {members.length}*/}
                {/*    </div>*/}
                {/*    <div className="space-y-1">*/}
                {/*        {members.map((user) => (*/}
                {/*            <MemberItem key={user.user.id} user={user.user} />*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}
            </ScrollArea>

            <AddMemberDialog
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
            />
        </aside>
    );
}

function MemberItem({ user }: { user: User }) {
    return (
        <div className="hover:bg-sidebar-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors">
            <div className="relative shrink-0">
                <Avatar
                    className={cn(
                        'h-8 w-8',
                        // user.status === 'offline' && 'opacity-50',
                    )}
                >
                    {/*<AvatarImage src={user.avatar} alt={user.username} />*/}
                    <AvatarFallback className="bg-muted text-xs">
                        {user.username
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                    </AvatarFallback>
                </Avatar>
                {/*<span*/}
                {/*    className={cn(*/}
                {/*        'border-sidebar absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2',*/}
                {/*        user.status === 'online' && 'bg-emerald-500',*/}
                {/*        user.status === 'away' && 'bg-amber-500',*/}
                {/*        user.status === 'offline' && 'bg-muted-foreground',*/}
                {/*    )}*/}
                {/*/>*/}
            </div>
            <div className="min-w-0 flex-1">
                <span
                    className={cn(
                        'block truncate text-sm',
                        // user.status === 'offline' && 'text-muted-foreground',
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
