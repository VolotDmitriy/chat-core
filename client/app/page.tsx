'use client';

import { ChatArea } from '@/components/chat/chat-area';
import { MembersPanel } from '@/components/chat/members-panel';
import { Sidebar } from '@/components/chat/sidebar';
import { Topbar } from '@/components/chat/topbar';
import { useChats } from '@/hooks/use-chats';
import { useState } from 'react';

export default function Home() {
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
    const { chats } = useChats();
    const currentChat = chats.find((chat) => chat.id === selectedChannel);

    const chatName = currentChat?.name ?? 'Select a channel';
    return (
        <div className="bg-background flex h-screen flex-col">
            <Topbar channelName={chatName} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    selectedChannel={selectedChannel}
                    onSelectChannel={setSelectedChannel}
                />

                <ChatArea channelName={chatName} />

                <MembersPanel />
            </div>
        </div>
    );
}
