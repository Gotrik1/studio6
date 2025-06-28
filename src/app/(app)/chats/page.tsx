
'use client';

import { useState, useMemo, KeyboardEvent, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Phone, Video, Smile, Paperclip, Send, MoreVertical, PlusCircle, MessageSquare, MessagesSquare } from "lucide-react";
import { chatList as mockChatList } from '@/lib/mock-data/chats';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/session';
import { useSession } from '@/lib/session-client';

type Chat = (typeof mockChatList)[0];

export default function ChatsPage() {
    const { user: currentUser, loading: userLoading } = useSession();
    const [chatList, setChatList] = useState(mockChatList);
    const [activeChat, setActiveChat] = useState<Chat | null>(chatList[0] || null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Scroll to bottom when active chat changes or new messages are added
        scrollToBottom();
    }, [activeChat?.id, activeChat?.messages?.length]);

    const filteredChats = useMemo(() => {
        if (!searchQuery) return chatList;
        return chatList.filter(chat => 
            chat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [chatList, searchQuery]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeChat || !currentUser) return;

        const userMessage = {
            sender: 'me' as const,
            text: newMessage.trim(),
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        };
        
        const currentChatId = activeChat.id;

        const updateChatWithNewMessage = (chatToUpdate: Chat, message: typeof userMessage, isReply: boolean): Chat => {
            const lastMessageText = isReply ? message.text : `Вы: ${message.text}`;
            return {
                ...chatToUpdate,
                messages: [...(chatToUpdate.messages || []), message],
                lastMessage: {
                    text: lastMessageText,
                    time: message.time,
                },
                unreadCount: isReply ? (chatToUpdate.id === activeChat?.id ? 0 : (chatToUpdate.unreadCount || 0) + 1) : chatToUpdate.unreadCount,
            }
        };
        
        // --- Update with user's message ---
        let userUpdatedChat: Chat | undefined;
        const userUpdatedList = chatList.map(c => {
            if (c.id === currentChatId) {
                userUpdatedChat = updateChatWithNewMessage(c, userMessage, false);
                return userUpdatedChat;
            }
            return c;
        });

        if (userUpdatedChat) {
            setActiveChat(userUpdatedChat);
            setChatList([userUpdatedChat, ...userUpdatedList.filter(c => c.id !== currentChatId)]);
        }
        setNewMessage('');

        // --- Simulate and update with reply ---
        setTimeout(() => {
            const replies = [
                "Понял, спасибо!",
                "Хорошо, буду на месте.",
                "Отлично, договорились.",
                "Звучит как план. Увидимся!",
                "Принято. Спасибо за информацию.",
            ];
            const replyText = replies[Math.floor(Math.random() * replies.length)];
            const replyMessage = { sender: 'other' as const, text: replyText, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) };
            
            setChatList(prevList => {
                let replyUpdatedChat: Chat | undefined;
                const replyUpdatedList = prevList.map(c => {
                    if (c.id === currentChatId) {
                        replyUpdatedChat = updateChatWithNewMessage(c, replyMessage, true);
                        return replyUpdatedChat;
                    }
                    return c;
                });

                if (replyUpdatedChat) {
                    setActiveChat(prevActive => prevActive?.id === currentChatId ? replyUpdatedChat : prevActive);
                    return [replyUpdatedChat, ...replyUpdatedList.filter(c => c.id !== currentChatId)];
                }
                return prevList;
            });
        }, 1500);
    };
    
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };
    
    const selectChat = (chat: Chat) => {
        const fullChat = chatList.find(c => c.id === chat.id);
        if (fullChat) {
            const updatedChat = { ...fullChat, unreadCount: 0 };
            const updatedChatList = chatList.map(c => c.id === chat.id ? updatedChat : c);
            
            setActiveChat(updatedChat);
            setChatList(updatedChatList);
        }
    }

    if (userLoading) {
        return <div>Загрузка...</div>
    }

    if (!currentUser) {
        return <div>Пожалуйста, войдите в систему.</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 h-[calc(100vh-theme(spacing.16)-2*theme(spacing.4))]">
            <Card className="md:col-span-1 xl:col-span-1 flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline text-2xl">Чаты</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <PlusCircle className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Новый чат</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Поиск или новый чат..." 
                            className="w-full pl-10" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <CardContent className="p-0">
                        {filteredChats.length > 0 ? (
                            filteredChats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={cn(
                                        "flex items-start gap-4 p-4 cursor-pointer border-b last:border-b-0 hover:bg-muted/50",
                                        activeChat?.id === chat.id && "bg-muted"
                                    )}
                                    onClick={() => selectChat(chat)}
                                >
                                    <Avatar className="h-12 w-12 border">
                                        <AvatarImage src={chat.avatar} alt={chat.name} data-ai-hint={chat.dataAiHint}/>
                                        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 truncate">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold truncate">{chat.name}</p>
                                            <p className="text-xs text-muted-foreground whitespace-nowrap">{chat.lastMessage.time}</p>
                                        </div>
                                        <div className="flex justify-between items-start mt-1">
                                            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage.text}</p>
                                            {chat.unreadCount > 0 && (
                                                <Badge className="h-5 min-w-5 flex items-center justify-center p-1">{chat.unreadCount}</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                             <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                                <MessagesSquare className="h-10 w-10 mb-2" />
                                <p className="font-semibold">Чаты не найдены</p>
                                <p className="text-sm">Попробуйте изменить поисковый запрос.</p>
                            </div>
                        )}
                    </CardContent>
                </ScrollArea>
            </Card>

            <Card className="md:col-span-2 xl:col-span-3 flex-1 flex flex-col">
                {activeChat ? (
                    <>
                        <CardHeader className="flex-row items-center justify-between border-b">
                            <div className="flex items-center gap-4">
                                <Avatar className="border">
                                    <AvatarImage src={activeChat.avatar} alt={activeChat.name} data-ai-hint={activeChat.dataAiHint} />
                                    <AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg">{activeChat.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                        Онлайн
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <TooltipProvider>
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Phone /></Button></TooltipTrigger><TooltipContent><p>Голосовой вызов</p></TooltipContent></Tooltip>
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Video /></Button></TooltipTrigger><TooltipContent><p>Видеовызов</p></TooltipContent></Tooltip>
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><MoreVertical /></Button></TooltipTrigger><TooltipContent><p>Больше опций</p></TooltipContent></Tooltip>
                                </TooltipProvider>
                            </div>
                        </CardHeader>
                        <ScrollArea className="flex-1 bg-muted/20 p-6">
                            <div className="space-y-6">
                                {activeChat.messages?.map((message, index) => (
                                    <div key={index} className={cn("flex items-end gap-2", message.sender === 'me' ? "justify-end" : "justify-start")}>
                                        {message.sender !== 'me' && <Avatar className="h-8 w-8 border"><AvatarImage src={activeChat.avatar} data-ai-hint={activeChat.dataAiHint} /></Avatar>}
                                        <div className={cn(
                                            "max-w-xs lg:max-w-md rounded-lg p-3 text-sm shadow-sm",
                                            message.sender === 'me'
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-background rounded-bl-none"
                                        )}>
                                            <p>{message.text}</p>
                                            <p className="text-xs text-right mt-1 opacity-70">{message.time}</p>
                                        </div>
                                        {message.sender === 'me' && <Avatar className="h-8 w-8 border"><AvatarImage src={currentUser.avatar} data-ai-hint="current user" /></Avatar>}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t bg-background">
                            <div className="relative">
                                <Textarea
                                    placeholder="Напишите сообщение..."
                                    className="pr-28 min-h-[40px] resize-none"
                                    rows={1}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <TooltipProvider>
                                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Smile /></Button></TooltipTrigger><TooltipContent><p>Эмодзи</p></TooltipContent></Tooltip>
                                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Paperclip /></Button></TooltipTrigger><TooltipContent><p>Вложить файл</p></TooltipContent></Tooltip>
                                    </TooltipProvider>
                                    <Button onClick={handleSendMessage}><Send /></Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <MessageSquare className="h-16 w-16 mb-4" />
                        <h2 className="text-xl font-semibold">Выберите чат</h2>
                        <p>Начните общение, выбрав чат из списка слева.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
