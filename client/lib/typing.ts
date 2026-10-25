import { Message, User } from '@/lib/types';

export const formatTyping = (
    usersIds: string[],
    users: User[],
    currentId: string | undefined,
) => {
    const typingUsersId = usersIds.filter((id) => id !== currentId);
    const typingUsers = users.filter((user) => typingUsersId.includes(user.id));

    if (typingUsers.length === 0) return '';
    const names = typingUsers
        .slice(0, 2)
        .map((u) => u.username)
        .join(' and ');
    const more =
        typingUsers.length > 2 ? ` and ${typingUsers.length - 2} more` : '';
    return `${names}${more} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`;
};

export const formatTypingShort = (typingUsers: User[]) => {
    if (typingUsers.length === 0) return '';
    if (typingUsers.length === 1)
        return `${typingUsers[0].username} is typing...`;
    return `${typingUsers.length} people are typing...`;
};

export const getPreviewText = (
    typingUsers: User[],
    lastMessage: Message | undefined,
) => {
    return typingUsers.length > 0
        ? formatTypingShort(typingUsers)
        : lastMessage?.content;
};
