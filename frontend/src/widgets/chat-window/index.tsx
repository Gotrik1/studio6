
'use client';

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
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
import { Skeleton } from '@/shared/ui/skeleton';
import type { Contact } from '@/widgets/chat-contact-list';

type Message = {
    sender: 'user' | 'ai' | 'other';
    name: string;
    avatar: string;
    text: string;
    isThinking?: boolean;
};

const getAvatarFallback = (name: string) => name.split(' ').map(n => n[0]).join('');

interface ChatWindowProps {
    chat: Contact;
}

export function ChatWindow({ chat }: ChatWindowProps) {
    const { user } = useSession();
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

    useEffect(() => {
        if (!user) return; 

        const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001');
        setSocket(newSocket);
        
        newSocket.on('receiveMessage', (message: any) => {
            // Only update if the message is for the current chat
            if (message.chatId === chat.id) {
                setMessages(prev => [...prev, {
                    sender: message.sender.id === user.id ? 'user' : 'other',
                    name: message.sender.name,
                    avatar: message.sender.avatar,
                    text: message.text,
                }]);
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user, chat.id]);

    useEffect(() => {
        const loadHistory = async () => {
            if (chat && user) {
                setIsLoadingHistory(true);
                setMessages([]);
                try {
                    const history = await getChatHistory(chat.id);
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
    }, [chat, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleSend = async () => {
        if (!input.trim() || !chat || !user || !socket) return;
        const text = input;
        
        const isTeamChat = chat.type === 'team';
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
                const aiResponseText = await askTeamChatbot({ teamId: chat.teamId, query });
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
                chatId: chat.id,
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
        const teamId = chat.type === 'team' ? chat.teamId : undefined;

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
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={chat.avatar} data-ai-hint={chat.avatarHint} />
                        <AvatarFallback>
                            {chat.type === 'team' ? <Users className="h-5 w-5"/> : getAvatarFallback(chat.name)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{chat.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={handleSuggestReplies} disabled={isThinking}>
                    {isThinking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    <span className="sr-only">Suggest replies</span>
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-6">
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
                                <div>
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
        </Card>
    );
}
