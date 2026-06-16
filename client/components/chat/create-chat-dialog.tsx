'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SpinnerEmpty } from '@/components/ui/loading';
import { createChat, searchUsers } from '@/lib/chat';
import { Chat, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check, Hash, MessageCircle, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface CreateChatDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    chats: Chat[];
}

type Mode = 'group' | 'direct';

export function CreateChatDialog({
    isOpen,
    onClose,
    onSuccess,
    chats,
}: CreateChatDialogProps) {
    const [mode, setMode] = useState<Mode>('group');
    const [name, setName] = useState('');
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [selected, setSelected] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearch] = useDebounce(search, 300);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true);
        searchUsers(debouncedSearch)
            .then((res) => setResults(res))
            .finally(() => setIsLoading(false));
    }, [debouncedSearch]);

    const existingDmUserIds = new Set(
        chats
            .filter((c) => !c.isGroup)
            .flatMap((c) => c.participants.map((p) => p.user.id)),
    );

    if (!isOpen) return null;

    const toggleUser = (user: User) => {
        if (mode === 'direct') {
            setSelected((prev) =>
                prev.find((u) => u.id === user.id) ? [] : [user],
            );
            return;
        }
        setSelected((prev) =>
            prev.find((u) => u.id === user.id)
                ? prev.filter((u) => u.id !== user.id)
                : [...prev, user],
        );
    };
    const handleCreate = async () => {
        const isGroup = mode == 'group';
        await createChat({
            name: isGroup ? name : undefined,
            isGroup,
            memberIds: selected.map((u) => u.id),
        });
        onSuccess();
        handleClose();
    };

    const handleClose = () => {
        setMode('group');
        setName('');
        setSearch('');
        setResults([]);
        setSelected([]);
        onClose();
    };

    const canCreate =
        mode === 'direct'
            ? selected.length === 1
            : selected.length >= 1 && name.trim().length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="bg-card border-border relative w-full max-w-md rounded-xl border shadow-2xl">
                {/* Header */}
                <div className="border-border flex items-center justify-between border-b p-4">
                    <h2 className="text-foreground text-lg font-semibold">
                        New Conversation
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close"
                        className="text-muted-foreground hover:text-foreground h-8 w-8"
                        onClick={handleClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Mode Toggle */}
                <div className="border-border flex border-b">
                    <button
                        onClick={() => setMode('group')}
                        className={cn(
                            'flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                            mode === 'group'
                                ? 'text-foreground border-primary border-b-2'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <Hash className="h-4 w-4" />
                        Group Chat
                    </button>
                    <button
                        onClick={() => setMode('direct')}
                        className={cn(
                            'flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                            mode === 'direct'
                                ? 'text-foreground border-primary border-b-2'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <MessageCircle className="h-4 w-4" />
                        Direct Message
                    </button>
                </div>

                <div className="space-y-3 p-4">
                    {/* Name field (group only) */}
                    {mode === 'group' && (
                        <Input
                            aria-label="Channel name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Channel name..."
                            className="bg-input border-border"
                        />
                    )}

                    {/* Search */}
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            aria-label="Search by username or email"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            placeholder="Search by username or email..."
                            className="bg-input border-border pl-9"
                        />
                    </div>

                    {/* Selected chips */}
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
                <div className="max-h-52 overflow-y-auto px-2 pb-2">
                    {isLoading ? (
                        <div className="py06 text-center">
                            <SpinnerEmpty />
                        </div>
                    ) : results.length === 0 && search.length > 0 ? (
                        <div className="text-muted-foreground py-6 text-center text-sm">
                            No users found
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {results.map((user) => {
                                const isSelected = !!selected.find(
                                    (u) => u.id === user.id,
                                );
                                const hasExistingDm =
                                    mode === 'direct' &&
                                    existingDmUserIds.has(user.id);
                                return (
                                    <button
                                        key={user.id}
                                        onClick={() =>
                                            !hasExistingDm && toggleUser(user)
                                        }
                                        disabled={hasExistingDm}
                                        className={cn(
                                            'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors',
                                            hasExistingDm
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
                                                {hasExistingDm
                                                    ? 'Already in chat'
                                                    : user.email}
                                            </div>
                                        </div>
                                        {!hasExistingDm && (
                                            <div
                                                className={cn(
                                                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                                    isSelected
                                                        ? 'bg-primary border-primary'
                                                        : 'border-muted-foreground',
                                                )}
                                            >
                                                {isSelected && (
                                                    <Check className="h-3 w-3 text-black" />
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
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            disabled={!canCreate || isLoading}
                            onClick={handleCreate}
                        >
                            {isLoading ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
