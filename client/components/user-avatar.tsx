import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, getInitials } from '@/lib/utils';
import type { ReactNode } from 'react';

interface UserAvatarProps {
    username: string | undefined;
    children?: ReactNode;
    isOnline?: boolean;
    className?: string;
    fallbackClassName?: string;
}

export function UserAvatar({
    username,
    children,
    isOnline = true,
    className,
    fallbackClassName,
}: UserAvatarProps) {
    return (
        <Avatar
            className={cn(
                'h-8 w-8 shrink-0',
                !isOnline && 'opacity-50',
                className,
            )}
        >
            {children}
            <AvatarFallback
                className={cn('bg-muted text-[10px]', fallbackClassName)}
            >
                {getInitials(username)}
            </AvatarFallback>
        </Avatar>
    );
}
