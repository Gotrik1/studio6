'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Phone, Video, Smile, Paperclip, Send, MoreVertical, PlusCircle, MessageSquare } from "lucide-react";
import { chatList as mockChatList } from '@/lib/mock-data/chats';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/session';

type Chat = (typeof mockChatList)[0];

export default function ChatsPage() {
    const [chatList] = useState(mockChatList);
    const [activeChat, setActiveChat] = useState<Chat | null>(chatList[0] || null);
    
    // In a real app, this would come from the session
    const currentUser: User = { name: 'You', email: '', role: '', avatar: 'https://placehold.co/40x40.png' };

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
                        <Input placeholder="Поиск или новый чат..." className="w-full pl-10" />
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <CardContent className="p-0">
                        {chatList.map((chat) => (
                            <div
                                key={chat.id}
                                className={cn(
                                    "flex items-start gap-4 p-4 cursor-pointer border-b last:border-b-0 hover:bg-muted/50",
                                    activeChat?.id === chat.id && "bg-muted"
                                )}
                                onClick={() => setActiveChat(chat)}
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
                        ))}
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
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t bg-background">
                            <div className="relative">
                                <Textarea
                                    placeholder="Напишите сообщение..."
                                    className="pr-28 min-h-[40px] resize-none"
                                    rows={1}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <TooltipProvider>
                                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Smile /></Button></TooltipTrigger><TooltipContent><p>Эмодзи</p></TooltipContent></Tooltip>
                                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Paperclip /></Button></TooltipTrigger><TooltipContent><p>Вложить файл</p></TooltipContent></Tooltip>
                                    </TooltipProvider>
                                    <Button><Send /></Button>
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
