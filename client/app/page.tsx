'use client';

import { ChatArea } from '@/components/chat/chat-area';
import { MembersPanel } from '@/components/chat/members-panel';
import { Sidebar } from '@/components/chat/sidebar';
import { Topbar } from '@/components/chat/topbar';
import { useChats } from '@/hooks/use-chats';
import { useSocket } from '@/hooks/use-socket';
import { useTypingByChat } from '@/hooks/use-typing-by-chat';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedChannel = searchParams.get('chat');

    const socket = useSocket();
    const { chats, loading, refetch } = useChats({ socket });
    const { typingByChat } = useTypingByChat(socket);
    const currentChat = chats.find((chat) => chat.id === selectedChannel);
    const [isMembersOpen, setIsMembersOpen] = useState(true);

    const chatName = currentChat?.name ?? 'Select a channel';

    const handleSelectChannel = (id: string) => {
        router.push(`/?chat=${id}`);
    };

    const getTypingUserIds = (chatId: string | null) =>
        (chatId && typingByChat[chatId]) || [];

    return (
        <div className="bg-background flex h-screen flex-col">
            <Topbar channelName={chatName} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    selectedChannel={selectedChannel}
                    typingByChat={typingByChat}
                    onSelectChannel={handleSelectChannel}
                    chats={chats}
                    loading={loading}
                    onSuccess={refetch}
                />

                <ChatArea
                    channelName={chatName}
                    chatId={selectedChannel}
                    typingUserIds={getTypingUserIds(selectedChannel)}
                    participants={currentChat?.participants}
                    onToggleMembers={() => setIsMembersOpen((prev) => !prev)}
                    isMembersOpen={isMembersOpen}
                    socket={socket}
                />

                {currentChat && isMembersOpen && (
                    <MembersPanel
                        participants={currentChat.participants}
                        chatId={currentChat.id}
                        socket={socket}
                        onSuccess={refetch}
                    />
                )}
            </div>
        </div>
    );
}
