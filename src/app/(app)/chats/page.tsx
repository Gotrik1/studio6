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
import { Search, Phone, Video, Smile, Paperclip, Send, MoreVertical, PlusCircle, MessageSquare, MessagesSquare, Lightbulb, Loader2, Bot } from "lucide-react";
import { chatList as mockChatList } from '@/lib/mock-data/chats';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session-client';
import { useToast } from '@/hooks/use-toast';
import { suggestReply } from '@/ai/flows/suggest-reply-flow';
import { askTeamChatbot } from '@/ai/flows/team-chatbot-flow';

type Message = {
    sender: 'me' | 'other' | 'ai';
    text: string;
    time: string;
    isThinking?: boolean;
};
type Chat = (typeof mockChatList)[0] & { messages?: Message[] };

const aiHelperUser = {
    name: 'AI-помощник',
    avatar: 'https://placehold.co/40x40.png',
    dataAiHint: 'brain circuit',
};

export default function ChatsPage() {
    const { user: currentUser, loading: userLoading } = useSession();
    const [chatList, setChatList] = useState<Chat[]>(mockChatList);
    const [activeChat, setActiveChat] = useState<Chat | null>(chatList[0] || null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // AI Suggestions state
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.id, activeChat?.messages?.length]);

    const filteredChats = useMemo(() => {
        if (!searchQuery) return chatList;
        return chatList.filter(chat => 
            chat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [chatList, searchQuery]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeChat || !currentUser || isSending) return;

        setIsSending(true);
        const userMessage: Message = {
            sender: 'me',
            text: newMessage.trim(),
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        };
        const currentMessageText = newMessage;
        setNewMessage('');
        setSuggestions([]);

        // Immediately update UI with user's message
        const newChatListWithUserMessage = chatList.map(c => 
            c.id === activeChat.id ? { ...c, messages: [...(c.messages || []), userMessage], lastMessage: { text: `Вы: ${userMessage.text}`, time: userMessage.time } } : c
        );
        let updatedActiveChat = newChatListWithUserMessage.find(c => c.id === activeChat.id)!;
        setChatList([updatedActiveChat, ...newChatListWithUserMessage.filter(c => c.id !== activeChat.id)]);
        setActiveChat(updatedActiveChat);
        
        const isTeamChat = activeChat.id === 'chat-1';
        const aiTrigger = '@AI-помощник';

        if (isTeamChat && currentMessageText.toLowerCase().startsWith(aiTrigger.toLowerCase())) {
            const query = currentMessageText.substring(aiTrigger.length).trim();
            const thinkingMessage: Message = { sender: 'ai', text: 'Думаю...', time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }), isThinking: true };
            
            // Show thinking indicator
            updatedActiveChat = {...updatedActiveChat, messages: [...updatedActiveChat.messages, thinkingMessage]};
            const updatedListWithThinking = chatList.map(c => c.id === activeChat.id ? updatedActiveChat : c);
            setChatList(updatedListWithThinking);
            setActiveChat(updatedActiveChat);

            try {
                const aiResponseText = await askTeamChatbot({ teamId: 'cyber-eagles', query });
                const aiResponseMessage: Message = { sender: 'ai', text: aiResponseText, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) };
                
                // Replace thinking message with actual response
                setChatList(prev => prev.map(c => {
                    if (c.id === activeChat.id) {
                        const newMessages = c.messages?.filter(m => !m.isThinking) || [];
                        newMessages.push(aiResponseMessage);
                        return { ...c, messages: newMessages, lastMessage: { text: `AI: ${aiResponseMessage.text.substring(0, 30)}...`, time: aiResponseMessage.time } };
                    }
                    return c;
                }));
                setActiveChat(prev => {
                    if (!prev) return null;
                    const newMessages = prev.messages?.filter(m => !m.isThinking) || [];
                    newMessages.push(aiResponseMessage);
                    return { ...prev, messages: newMessages };
                });
            } catch (error) {
                console.error(error);
                const errorMessage: Message = { sender: 'ai', text: 'Извините, произошла ошибка. Попробуйте снова.', time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) };
                 setChatList(prev => prev.map(c => {
                    if (c.id === activeChat.id) {
                         const newMessages = c.messages?.filter(m => !m.isThinking) || [];
                        newMessages.push(errorMessage);
                        return { ...c, messages: newMessages };
                    }
                    return c;
                }));
                 setActiveChat(prev => {
                    if (!prev) return null;
                    const newMessages = prev.messages?.filter(m => !m.isThinking) || [];
                    newMessages.push(errorMessage);
                    return { ...prev, messages: newMessages };
                });
            }

        } else {
            // Simulate a reply from another user
            setTimeout(() => {
                const replies = ["Понял, спасибо!", "Хорошо, буду на месте.", "Отлично, договорились."];
                const replyText = replies[Math.floor(Math.random() * replies.length)];
                const replyMessage: Message = { sender: 'other', text: replyText, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) };
                
                const newChatListWithReply = chatList.map(c => 
                    c.id === activeChat.id ? { ...c, messages: [...(c.messages || []), replyMessage], lastMessage: { text: replyMessage.text, time: replyMessage.time }, unreadCount: (c.id === activeChat.id ? 0 : (c.unreadCount || 0) + 1) } : c
                );
                const updatedActiveChatWithReply = newChatListWithReply.find(c => c.id === activeChat.id)!;
                setChatList([updatedActiveChatWithReply, ...newChatListWithReply.filter(c => c.id !== activeChat.id)]);
                setActiveChat(prev => prev?.id === activeChat.id ? updatedActiveChatWithReply : prev);
            }, 1500);
        }
        setIsSending(false);
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
            setSuggestions([]);
        }
    }

    const handleSuggestReplies = async () => {
        if (!activeChat?.messages || activeChat.messages.length === 0) {
            toast({ variant: 'destructive', title: 'Недостаточно контекста', description: 'Невозможно предложить ответ для пустого чата.' });
            return;
        }

        setIsSuggesting(true);
        setSuggestions([]);
        try {
            const history = activeChat.messages.slice(-5).map(m => `${m.sender === 'me' ? 'me' : 'other'}: ${m.text}`).join('\n');
            const result = await suggestReply({ history });
            setSuggestions(result.suggestions);
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось получить подсказки от ИИ.' });
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setNewMessage(suggestion);
        setSuggestions([]);
    };

    if (userLoading) return <div>Загрузка...</div>
    if (!currentUser) return <div>Пожалуйста, войдите в систему.</div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 h-[calc(100vh-theme(spacing.16)-2*theme(spacing.4))]">
            <Card className="md:col-span-1 xl:col-span-1 flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline text-2xl">Чаты</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild><Button variant="ghost" size="icon"><PlusCircle className="h-5 w-5" /></Button></TooltipTrigger>
                                <TooltipContent><p>Новый чат</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Поиск или новый чат..." className="w-full pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <CardContent className="p-0">
                        {filteredChats.length > 0 ? (
                            filteredChats.map((chat) => (
                                <div key={chat.id} className={cn("flex items-start gap-4 p-4 cursor-pointer border-b last:border-b-0 hover:bg-muted/50", activeChat?.id === chat.id && "bg-muted")} onClick={() => selectChat(chat)}>
                                    <Avatar className="h-12 w-12 border"><AvatarImage src={chat.avatar} alt={chat.name} data-ai-hint={chat.dataAiHint}/><AvatarFallback>{chat.name.charAt(0)}</AvatarFallback></Avatar>
                                    <div className="flex-1 truncate">
                                        <div className="flex justify-between items-center"><p className="font-semibold truncate">{chat.name}</p><p className="text-xs text-muted-foreground whitespace-nowrap">{chat.lastMessage.time}</p></div>
                                        <div className="flex justify-between items-start mt-1"><p className="text-sm text-muted-foreground truncate">{chat.lastMessage.text}</p>{chat.unreadCount > 0 && (<Badge className="h-5 min-w-5 flex items-center justify-center p-1">{chat.unreadCount}</Badge>)}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                             <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground"><MessagesSquare className="h-10 w-10 mb-2" /><p className="font-semibold">Чаты не найдены</p><p className="text-sm">Попробуйте изменить поисковый запрос.</p></div>
                        )}
                    </CardContent>
                </ScrollArea>
            </Card>

            <Card className="md:col-span-2 xl:col-span-3 flex-1 flex flex-col">
                {activeChat ? (
                    <>
                        <CardHeader className="flex-row items-center justify-between border-b">
                            <div className="flex items-center gap-4"><Avatar className="border"><AvatarImage src={activeChat.avatar} alt={activeChat.name} data-ai-hint={activeChat.dataAiHint} /><AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback></Avatar><div><CardTitle className="text-lg">{activeChat.name}</CardTitle><CardDescription className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500"></span>Онлайн</CardDescription></div></div>
                            <div className="flex items-center gap-1"><TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Phone /></Button></TooltipTrigger><TooltipContent><p>Голосовой вызов</p></TooltipContent></Tooltip><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Video /></Button></TooltipTrigger><TooltipContent><p>Видеовызов</p></TooltipContent></Tooltip><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><MoreVertical /></Button></TooltipTrigger><TooltipContent><p>Больше опций</p></TooltipContent></Tooltip></TooltipProvider></div>
                        </CardHeader>
                        <ScrollArea className="flex-1 bg-muted/20 p-6">
                            <div className="space-y-6">
                                {activeChat.messages?.map((message, index) => (
                                    <div key={index} className={cn("flex items-end gap-2", message.sender === 'me' ? "justify-end" : "justify-start")}>
                                        {message.sender === 'other' && <Avatar className="h-8 w-8 border"><AvatarImage src={activeChat.avatar} data-ai-hint={activeChat.dataAiHint} /></Avatar>}
                                        {message.sender === 'ai' && <Avatar className="h-8 w-8 border"><AvatarImage src={aiHelperUser.avatar} data-ai-hint={aiHelperUser.dataAiHint}/><AvatarFallback><Bot /></AvatarFallback></Avatar>}
                                        
                                        <div className={cn("max-w-xs lg:max-w-md rounded-lg p-3 text-sm shadow-sm", 
                                            message.sender === 'me' ? "bg-primary text-primary-foreground rounded-br-none" : 
                                            message.sender === 'ai' ? "bg-muted rounded-bl-none" : "bg-background rounded-bl-none")}>
                                            
                                            {message.isThinking ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>{message.text}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="whitespace-pre-wrap">{message.text}</p>
                                                    <p className="text-xs text-right mt-1 opacity-70">{message.time}</p>
                                                </>
                                            )}
                                        </div>
                                        {message.sender === 'me' && <Avatar className="h-8 w-8 border"><AvatarImage src={currentUser.avatar} data-ai-hint="current user" /></Avatar>}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t bg-background space-y-2">
                             {suggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.map((s, i) => (
                                        <Button key={i} variant="outline" size="sm" onClick={() => handleSuggestionClick(s)}>
                                            {s}
                                        </Button>
                                    ))}
                                </div>
                            )}
                            <div className="relative">
                                <Textarea 
                                    placeholder={activeChat.id === 'chat-1' ? "Напишите сообщение или упомяните @AI-помощник..." : "Напишите сообщение..."}
                                    className="pr-36 min-h-[40px] resize-none" 
                                    rows={1} 
                                    value={newMessage} 
                                    onChange={(e) => setNewMessage(e.target.value)} 
                                    onKeyDown={handleKeyDown}
                                    disabled={isSending}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={handleSuggestReplies} disabled={isSuggesting || isSending}>
                                                    {isSuggesting ? <Loader2 className="animate-spin" /> : <Lightbulb />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent><p>AI-подсказки</p></TooltipContent>
                                        </Tooltip>
                                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled={isSending}><Smile /></Button></TooltipTrigger><TooltipContent><p>Эмодзи</p></TooltipContent></Tooltip>
                                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled={isSending}><Paperclip /></Button></TooltipTrigger><TooltipContent><p>Вложить файл</p></TooltipContent></Tooltip>
                                    </TooltipProvider>
                                    <Button onClick={handleSendMessage} disabled={isSending || !newMessage.trim()}><Send /></Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"><MessageSquare className="h-16 w-16 mb-4" /><h2 className="text-xl font-semibold">Выберите чат</h2><p>Начните общение, выбрав чат из списка слева.</p></div>
                )}
            </Card>
        </div>
    );
}
