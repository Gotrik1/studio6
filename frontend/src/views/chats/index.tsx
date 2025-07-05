'use client';

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Send, Bot, Sparkles, Loader2, Users } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useSession } from '@/shared/lib/session/client';
import { suggestReply } from '@/shared/api/genkit/flows/suggest-reply-flow';
import { askTeamChatbot } from '@/shared/api/genkit/flows/team-chatbot-flow';
import { io, type Socket } from 'socket.io-client';
import { getChatHistory } from '@/entities/chat/api/get-chat-history';
import { getChats } from '@/entities/chat/api/chats';
import { Skeleton } from '@/shared/ui/skeleton';


type Message = {
    sender: 'user' | 'ai' | 'other';
    name: string;
    avatar: string;
    text: string;
    isThinking?: boolean;
};

type Contact = {
    id: string;
    teamId: string;
    name: string;
    avatar: string;
    avatarHint: string;
    lastMessage: string;
    timestamp: string;
    isOnline: boolean;
    type: 'team' | 'user';
}

const getAvatarFallback = (name: string) => name.split(' ').map(n => n[0]).join('');

export function ChatsPage() {
    const { user } = useSession();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoadingContacts, setIsLoadingContacts] = useState(true);
    const [selectedChat, setSelectedChat] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [replySuggestions, setReplySuggestions] = useState<string[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchContacts = useCallback(async () => {
        setIsLoadingContacts(true);
        try {
            const fetchedContacts = await getChats();
            setContacts(fetchedContacts);
            if (fetchedContacts.length > 0 && !selectedChat) {
                setSelectedChat(fetchedContacts[0]);
            }
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        } finally {
            setIsLoadingContacts(false);
        }
    }, [selectedChat]);


    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    useEffect(() => {
        if (!user) return; 

        const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001');
        setSocket(newSocket);
        
        newSocket.on('receiveMessage', (message: any) => {
            setMessages(prev => [...prev, {
                sender: message.sender.id === user.id ? 'user' : 'other',
                name: message.sender.name,
                avatar: message.sender.avatar,
                text: message.text,
            }]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);
    
    useEffect(() => {
        const loadHistory = async () => {
            if (selectedChat && user) {
                setIsLoadingHistory(true);
                setMessages([]);
                try {
                    const history = await getChatHistory(selectedChat.id);
                    const formattedHistory: Message[] = history.map((msg: any) => ({
                        sender: msg.author.id === user.id ? 'user' : 'other',
                        name: msg.author.name,
                        avatar: msg.author.avatar,
                        text: msg.text,
                    }));
                    setMessages(formattedHistory);
                } catch (error) {
                    console.error("Failed to load chat history:", error);
                } finally {
                    setIsLoadingHistory(false);
                }
            } else {
                setMessages([]);
            }
        };

        loadHistory();
        setReplySuggestions([]);
    }, [selectedChat, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSelectChat = (contact: Contact) => {
        setSelectedChat(contact);
    };
    
    const handleSend = async () => {
        if (!input.trim() || !selectedChat || !user || !socket) return;
        const text = input;
        
        const isTeamChat = selectedChat.type === 'team';
        const isAiCommand = text.toLowerCase().startsWith('/ai') || text.toLowerCase().startsWith('@ai');

        if (isTeamChat && isAiCommand) {
            const userMessage: Message = { sender: 'user', name: user.name, avatar: user.avatar, text };
            setMessages(prev => [...prev, userMessage]);
            setInput('');

            const thinkingMessage: Message = { sender: 'ai', name: 'AI Ассистент', avatar: '', text: 'Думаю...', isThinking: true };
            setMessages(prev => [...prev, thinkingMessage]);
            setIsThinking(true);
            const query = text.replace(/^\/ai\s*|^\@ai\s*/, '');
            
            try {
                const aiResponseText = await askTeamChatbot({ teamId: selectedChat.teamId, query });
                const aiMessage: Message = { sender: 'ai', name: 'AI Ассистент', avatar: '', text: aiResponseText };
                setMessages(prev => [...prev.filter(m => !m.isThinking), aiMessage]);
            } catch(e) {
                console.error(e);
                const errorMessage: Message = { sender: 'ai', name: 'AI Ассистент', avatar: '', text: 'Произошла ошибка при обработке вашего запроса.' };
                setMessages(prev => [...prev.filter(m => !m.isThinking), errorMessage]);
            } finally {
                setIsThinking(false);
            }
        } else {
            const messageToSend = {
                sender: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                },
                chatId: selectedChat.id,
                text
            };
            socket.emit('sendMessage', messageToSend);
            setInput('');
        }
    };

    const handleSuggestReplies = async () => {
        if (messages.length === 0 || isThinking) return;
        
        setIsThinking(true);
        setReplySuggestions([]);
        
        const history = messages.map(m => `${m.name}: ${m.text}`).join('\n');
        const teamId = selectedChat?.type === 'team' ? selectedChat.teamId : undefined;

        try {
            const { suggestions } = await suggestReply({ history, teamId });
            setReplySuggestions(suggestions);
        } catch (e) {
            console.error("Failed to suggest replies:", e);
        } finally {
            setIsThinking(false);
        }
    };
    
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !isThinking) {
            handleSend();
        }
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-10rem)] opacity-0 animate-fade-in-up">
            <Card className="md:col-span-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Сообщения</CardTitle>
                    <CardDescription>Ваши личные и командные чаты.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-y-auto">
                    <ScrollArea className="h-full">
                        <div className="space-y-1">
                             {isLoadingContacts ? (
                                <div className="p-3 space-y-1">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            ) : (
                                contacts.map(contact => (
                                    <button
                                        key={contact.id}
                                        className={cn(
                                            "flex items-center gap-3 p-3 w-full text-left transition-colors hover:bg-muted",
                                            selectedChat?.id === contact.id && "bg-muted"
                                        )}
                                        onClick={() => handleSelectChat(contact)}
                                    >
                                        <Avatar className="relative">
                                            <AvatarImage src={contact.avatar} data-ai-hint={contact.avatarHint} />
                                            <AvatarFallback>
                                                {contact.type === 'team' ? <Users className="h-5 w-5"/> : getAvatarFallback(contact.name)}
                                            </AvatarFallback>
                                            {contact.isOnline && <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />}
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-semibold truncate">{contact.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            
            <Card className="md:col-span-2 flex flex-col">
                {selectedChat ? (
                    <>
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={selectedChat.avatar} data-ai-hint={selectedChat.avatarHint} />
                                    <AvatarFallback>
                                        {selectedChat.type === 'team' ? <Users className="h-5 w-5"/> : getAvatarFallback(selectedChat.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-lg">{selectedChat.name}</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleSuggestReplies} disabled={isThinking}>
                                {isThinking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                                <span className="sr-only">Suggest replies</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            <ScrollArea className="h-[calc(100vh-22rem)] p-6">
                                <div className="space-y-6">
                                     {isLoadingHistory ? (
                                        <div className="space-y-6">
                                            <div className="flex items-start gap-2 justify-start">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <Skeleton className="h-16 w-48" />
                                            </div>
                                            <div className="flex items-start gap-2 justify-end">
                                                <Skeleton className="h-10 w-32" />
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                            </div>
                                            <div className="flex items-start gap-2 justify-start">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <Skeleton className="h-10 w-40" />
                                            </div>
                                        </div>
                                    ) : (
                                        messages.map((message, index) => (
                                        <div key={index} className={cn("flex items-end gap-2", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                                            {(message.sender === 'other' || message.sender === 'ai') && (
                                                <Avatar className="h-8 w-8 border flex-shrink-0">
                                                        {message.sender === 'ai' ? <AvatarFallback><Bot /></AvatarFallback> : <AvatarImage src={message.avatar} />}
                                                        <AvatarFallback>{getAvatarFallback(message.name)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex flex-col gap-1 items-start" style={{alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start'}}>
                                                    {(message.sender === 'other' || message.sender === 'ai') && (
                                                        <p className="text-xs text-muted-foreground mb-0.5 ml-1">{message.name}</p>
                                                    )}
                                                    <div className={cn(
                                                    "max-w-md rounded-lg p-3 text-sm shadow-sm",
                                                    message.sender === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                                                )}>
                                                    {message.isThinking ? (
                                                        <div className="flex items-center gap-2">
                                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                                            <span>{message.text}</span>
                                                        </div>
                                                    ) : <p className="whitespace-pre-wrap">{message.text}</p>}
                                                </div>
                                            </div>
                                            {message.sender === 'user' && user && (
                                                <Avatar className="h-8 w-8 border flex-shrink-0">
                                                    <AvatarImage src={user.avatar} data-ai-hint="user avatar"/>
                                                    <AvatarFallback>{getAvatarFallback(user.name)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <div className="p-4 border-t bg-background space-y-2">
                            {replySuggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {replySuggestions.map((suggestion, i) => (
                                        <Button key={i} variant="outline" size="sm" onClick={() => { setInput(suggestion); setReplySuggestions([]); }}>
                                            {suggestion}
                                        </Button>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Input 
                                    placeholder="Напишите сообщение..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isThinking}
                                />
                                <Button onClick={handleSend} disabled={isThinking}><Send className="h-4 w-4"/></Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <Bot className="h-12 w-12 mb-4" />
                        <p className="font-semibold">Выберите чат</p>
                        <p className="text-sm">Выберите чат для начала общения.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
