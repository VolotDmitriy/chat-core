'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, Search, UserPlus, X } from 'lucide-react';
import { useState } from 'react';

interface AddMemberDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const availableUsers = [
    {
        id: 'new1',
        name: 'David Wilson',
        email: 'david@company.com',
        avatar: 'https://i.pravatar.cc/150?img=11',
        role: 'Designer',
    },
    {
        id: 'new2',
        name: 'Emma Thompson',
        email: 'emma@company.com',
        avatar: 'https://i.pravatar.cc/150?img=12',
        role: 'Marketing',
    },
    {
        id: 'new3',
        name: 'James Anderson',
        email: 'james@company.com',
        avatar: 'https://i.pravatar.cc/150?img=14',
        role: 'Sales',
    },
    {
        id: 'new4',
        name: 'Olivia Martinez',
        email: 'olivia@company.com',
        avatar: 'https://i.pravatar.cc/150?img=16',
        role: 'HR',
    },
    {
        id: 'new5',
        name: 'William Brown',
        email: 'william@company.com',
        avatar: 'https://i.pravatar.cc/150?img=17',
        role: 'Finance',
    },
    {
        id: 'new6',
        name: 'Sophia Lee',
        email: 'sophia@company.com',
        avatar: 'https://i.pravatar.cc/150?img=20',
        role: 'Engineering',
    },
];

export function AddMemberDialog({ isOpen, onClose }: AddMemberDialogProps) {
    const [search, setSearch] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    if (!isOpen) return null;

    const filteredUsers = availableUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()),
    );

    const toggleUser = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId],
        );
    };

    const handleAddMembers = () => {
        // In a real app, this would add the members
        onClose();
        setSelectedUsers([]);
        setSearch('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="bg-card border-border relative w-full max-w-md rounded-xl border shadow-2xl">
                {/* Header */}
                <div className="border-border flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-2">
                        <UserPlus className="text-primary h-5 w-5" />
                        <h2 className="text-foreground text-lg font-semibold">
                            Add Members
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground h-8 w-8"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Search */}
                <div className="border-border border-b p-4">
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground pl-9"
                        />
                    </div>
                    {selectedUsers.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {selectedUsers.map((userId) => {
                                const user = availableUsers.find(
                                    (u) => u.id === userId,
                                );
                                if (!user) return null;
                                return (
                                    <div
                                        key={userId}
                                        className="bg-primary/20 text-primary flex items-center gap-1 rounded-full px-2 py-1 text-sm"
                                    >
                                        <span>{user.name.split(' ')[0]}</span>
                                        <button
                                            onClick={() => toggleUser(userId)}
                                            className="hover:bg-primary/30 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* User List */}
                <div className="max-h-64 overflow-y-auto p-2">
                    {filteredUsers.length === 0 ? (
                        <div className="text-muted-foreground py-8 text-center">
                            No users found
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredUsers.map((user) => {
                                const isSelected = selectedUsers.includes(
                                    user.id,
                                );
                                return (
                                    <button
                                        key={user.id}
                                        onClick={() => toggleUser(user.id)}
                                        className={cn(
                                            'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors',
                                            isSelected
                                                ? 'bg-primary/20 text-foreground'
                                                : 'hover:bg-muted/50 text-foreground',
                                        )}
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={user.avatar}
                                                alt={user.name}
                                            />
                                            <AvatarFallback className="bg-muted text-sm">
                                                {user.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate font-medium">
                                                {user.name}
                                            </div>
                                            <div className="text-muted-foreground truncate text-sm">
                                                {user.role} • {user.email}
                                            </div>
                                        </div>
                                        <div
                                            className={cn(
                                                'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                                                isSelected
                                                    ? 'bg-primary border-primary'
                                                    : 'border-muted-foreground',
                                            )}
                                        >
                                            {isSelected && (
                                                <Check className="h-3 w-3 text-white" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-border flex items-center justify-between border-t p-4">
                    <span className="text-muted-foreground text-sm">
                        {selectedUsers.length} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddMembers}
                            disabled={selectedUsers.length === 0}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            Add Members
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
