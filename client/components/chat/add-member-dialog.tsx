'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SpinnerEmpty } from '@/components/ui/loading';
import { addMember, searchUsers } from '@/lib/chat';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check, Search, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface AddMemberDialogProps {
    isOpen: boolean;
    onClose: () => void;
    chatId: string;
    participants: { user: User }[];
    onSuccess: () => void;
}

export function AddMemberDialog({
    isOpen,
    onClose,
    chatId,
    participants,
    onSuccess,
}: AddMemberDialogProps) {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [selected, setSelected] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [debouncedSearch] = useDebounce(search, 300);

    const existingIds = new Set(participants.map((p) => p.user.id));

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true);
        searchUsers(debouncedSearch)
            .then((res) => {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setResults(res);
            })
            .finally(() => {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setIsLoading(false);
            });
    }, [debouncedSearch]);

    if (!isOpen) return null;

    const toggleUser = (user: User) => {
        setSelected((prev) =>
            prev.find((u) => u.id === user.id)
                ? prev.filter((u) => u.id !== user.id)
                : [...prev, user],
        );
    };

    const handleAdd = async () => {
        if (!selected.length) return;
        setIsAdding(true);
        try {
            await Promise.all(selected.map((u) => addMember(chatId, u.id)));
            onSuccess();
            handleClose();
        } finally {
            setIsAdding(false);
        }
    };

    const handleClose = () => {
        setSearch('');
        setResults([]);
        setSelected([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

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
                        onClick={handleClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Search + chips */}
                <div className="border-border border-b p-4 space-y-3">
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by username or email..."
                            className="bg-input border-border pl-9"
                        />
                    </div>
                    {selected.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selected.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-primary/20 text-primary flex items-center gap-1 rounded-full px-2 py-1 text-sm"
                                >
                                    <span>{user.username}</span>
                                    <button
                                        onClick={() => toggleUser(user)}
                                        className="hover:bg-primary/30 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="max-h-64 overflow-y-auto p-2">
                    {isLoading ? (
                        <div className="py-6 text-center">
                            <SpinnerEmpty />
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-muted-foreground py-8 text-center text-sm">
                            {search.length > 0
                                ? 'No users found'
                                : 'Start typing to search'}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {results.map((user) => {
                                const isSelected = !!selected.find(
                                    (u) => u.id === user.id,
                                );
                                const alreadyMember = existingIds.has(user.id);
                                return (
                                    <button
                                        key={user.id}
                                        onClick={() =>
                                            !alreadyMember && toggleUser(user)
                                        }
                                        disabled={alreadyMember}
                                        className={cn(
                                            'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors',
                                            alreadyMember
                                                ? 'cursor-not-allowed opacity-50'
                                                : isSelected
                                                  ? 'bg-primary/20'
                                                  : 'hover:bg-muted/50',
                                        )}
                                    >
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarFallback className="bg-muted text-xs">
                                                {user.username[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-medium">
                                                {user.username}
                                            </div>
                                            <div className="text-muted-foreground truncate text-xs">
                                                {alreadyMember
                                                    ? 'Already a member'
                                                    : user.email}
                                            </div>
                                        </div>
                                        {!alreadyMember && (
                                            <div
                                                className={cn(
                                                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                                    isSelected
                                                        ? 'bg-primary border-primary'
                                                        : 'border-muted-foreground',
                                                )}
                                            >
                                                {isSelected && (
                                                    <Check className="h-3 w-3 text-white" />
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-border flex items-center justify-between border-t p-4">
                    <span className="text-muted-foreground text-sm">
                        {selected.length} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAdd}
                            disabled={selected.length === 0 || isAdding}
                        >
                            {isAdding ? 'Adding...' : 'Add Members'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
