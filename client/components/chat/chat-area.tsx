'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { type Message, messages, users } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Hash, Paperclip, Pin, Send, Smile, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EmojiPicker } from './emoji-picker';

interface ChatAreaProps {
    channelName: string;
}

export function ChatArea({ channelName }: ChatAreaProps) {
    const [inputValue, setInputValue] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    const handleEmojiSelect = (emoji: string) => {
        setInputValue((prev) => prev + emoji);
        setShowEmojiPicker(false);
        textareaRef.current?.focus();
    };

    return (
        <div className="bg-background flex min-w-0 flex-1 flex-col">
            {/* Chat Header */}
            <div className="border-border flex h-12 shrink-0 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2">
                    <Hash className="text-muted-foreground h-5 w-5" />
                    <span className="text-foreground font-semibold">
                        {channelName}
                    </span>
                    <span className="text-muted-foreground text-sm">|</span>
                    <span className="text-muted-foreground text-sm">
                        Team discussions and updates
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground h-8 w-8"
                    >
                        <Pin className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground h-8 w-8"
                    >
                        <Users className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}

                    {/* Typing Indicator */}
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={users[0].avatar}
                                alt={users[0].name}
                            />
                            <AvatarFallback className="bg-muted text-xs">
                                SC
                            </AvatarFallback>
                        </Avatar>
                        <div className="bg-card rounded-2xl rounded-bl-sm px-4 py-2">
                            <div className="flex items-center gap-1">
                                <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
                                <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
                                <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full" />
                            </div>
                        </div>
                        <span className="text-muted-foreground text-xs">
                            Sarah is typing...
                        </span>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="border-border shrink-0 border-t p-4">
                <div className="bg-card border-border flex items-center gap-2 rounded-lg border p-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0"
                    >
                        <Paperclip className="h-4 w-4" />
                    </Button>
                    <Textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Message #${channelName}`}
                        className="max-h-32 min-h-8 resize-none border-0 bg-transparent p-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        rows={1}
                    />
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <Smile className="h-4 w-4" />
                        </Button>
                        {showEmojiPicker && (
                            <EmojiPicker
                                onEmojiSelect={handleEmojiSelect}
                                onClose={() => setShowEmojiPicker(false)}
                            />
                        )}
                    </div>
                    <Button
                        size="icon"
                        className="h-8 w-8 shrink-0 bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                        disabled={!inputValue.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function MessageBubble({ message }: { message: Message }) {
    return (
        <div
            className={cn(
                'flex items-start gap-2',
                message.isOwn && 'flex-row-reverse',
            )}
        >
            {!message.isOwn && (
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage
                        src={message.user.avatar}
                        alt={message.user.name}
                    />
                    <AvatarFallback className="bg-muted text-xs">
                        {message.user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                    </AvatarFallback>
                </Avatar>
            )}
            <div
                className={cn(
                    'flex max-w-[70%] flex-col',
                    message.isOwn && 'items-end',
                )}
            >
                {!message.isOwn && (
                    <div className="mb-1 flex items-center gap-2">
                        <span className="text-foreground text-sm font-medium">
                            {message.user.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {message.timestamp}
                        </span>
                    </div>
                )}
                <div
                    className={cn(
                        'rounded-2xl px-4 py-2 text-sm',
                        message.isOwn
                            ? 'rounded-br-sm bg-linear-to-r from-[#3b82f6] to-[#1d4ed8] text-white'
                            : 'bg-card text-foreground rounded-bl-sm',
                    )}
                >
                    {message.content}
                </div>
                {message.isOwn && (
                    <span className="text-muted-foreground mt-1 text-xs">
                        {message.timestamp}
                    </span>
                )}
            </div>
        </div>
    );
}
