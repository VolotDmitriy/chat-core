'use client';

import { ChatArea } from '@/components/chat/chat-area';
import { MembersPanel } from '@/components/chat/members-panel';
import { Sidebar } from '@/components/chat/sidebar';
import { Topbar } from '@/components/chat/topbar';
import { useChats } from '@/hooks/use-chats';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedChannel = searchParams.get('chat');

    const { chats, loading, refetch } = useChats();
    const currentChat = chats.find((chat) => chat.id === selectedChannel);
    const [isMembersOpen, setIsMembersOpen] = useState(true);

    const chatName = currentChat?.name ?? 'Select a channel';

    const handleSelectChannel = (id: string) => {
        router.push(`/?chat=${id}`);
    };

    return (
        <div className="bg-background flex h-screen flex-col">
            <Topbar channelName={chatName} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    selectedChannel={selectedChannel}
                    onSelectChannel={handleSelectChannel}
                    chats={chats}
                    loading={loading}
                    onSuccess={refetch}
                />

                <ChatArea
                    channelName={chatName}
                    chatId={selectedChannel}
                    onToggleMembers={() => setIsMembersOpen((prev) => !prev)}
                    isMembersOpen={isMembersOpen}
                />

                {currentChat && isMembersOpen && (
                    <MembersPanel
                        participants={currentChat.participants}
                        chatId={currentChat.id}
                        onSuccess={refetch}
                    />
                )}
            </div>
        </div>
    );
}
