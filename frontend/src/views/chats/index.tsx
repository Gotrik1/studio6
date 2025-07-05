
'use client';

import { useState } from 'react';
import { Bot } from 'lucide-react';
import { ChatContactList, type Contact } from '@/widgets/chat-contact-list';
import { ChatWindow } from '@/widgets/chat-window';
import { Card, CardContent } from '@/shared/ui/card';

export function ChatsPage() {
    const [selectedChat, setSelectedChat] = useState<Contact | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-10rem)] opacity-0 animate-fade-in-up">
            <div className="md:col-span-1 h-full">
                <ChatContactList
                    selectedChatId={selectedChat?.id || null}
                    onSelectChat={setSelectedChat}
                />
            </div>
            <div className="md:col-span-2 h-full">
                {selectedChat ? (
                    <ChatWindow chat={selectedChat} />
                ) : (
                    <Card className="h-full">
                        <CardContent className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <Bot className="h-12 w-12 mb-4" />
                            <p className="font-semibold">Выберите чат</p>
                            <p className="text-sm">Выберите чат для начала общения.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
