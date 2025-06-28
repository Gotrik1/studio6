'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Send, BrainCircuit, User, Loader2 } from "lucide-react";
import { useSession } from '@/lib/session-client';
import { cn } from '@/lib/utils';
import { askTeamChatbot } from '@/ai/flows/team-chatbot-flow';

type Message = {
    sender: 'me' | 'ai';
    text: string;
    isThinking?: boolean;
};

const aiHelperUser = {
    name: 'AI-помощник',
    avatar: 'https://placehold.co/40x40.png',
    dataAiHint: 'brain circuit',
};

export default function AiChatPage() {
    const { user: currentUser } = useSession();
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Привет! Я AI-помощник команды 'Кибер Орлы'. Чем могу помочь? Я могу рассказать о расписании, недавних матчах или статистике." }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isLoading) return;

        const userMessage: Message = { sender: 'me', text: newMessage.trim() };
        const thinkingMessage: Message = { sender: 'ai', text: 'Думаю...', isThinking: true };

        setMessages(prev => [...prev, userMessage, thinkingMessage]);
        setNewMessage('');
        setIsLoading(true);

        try {
            const teamId = 'cyber-eagles'; // Hardcoded for demo
            const aiResponseText = await askTeamChatbot({ teamId, query: userMessage.text });
            const aiResponseMessage: Message = { sender: 'ai', text: aiResponseText };
            
            setMessages(prev => prev.slice(0, -1).concat(aiResponseMessage));

        } catch (error) {
            console.error(error);
            const errorMessage: Message = { sender: 'ai', text: 'Извините, произошла ошибка. Попробуйте снова.' };
            setMessages(prev => prev.slice(0, -1).concat(errorMessage));
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Чат с AI-помощником</h1>
                <p className="text-muted-foreground">
                    Задайте вопрос о команде "Кибер Орлы" и получите мгновенный ответ.
                </p>
            </div>
             <Card className="h-[calc(100vh-theme(spacing.16)-2*theme(spacing.4)-8rem)] flex flex-col">
                <CardHeader className="flex-row items-center gap-4 border-b">
                     <Avatar className="h-12 w-12 border">
                        <AvatarImage src={aiHelperUser.avatar} alt={aiHelperUser.name} data-ai-hint={aiHelperUser.dataAiHint} />
                        <AvatarFallback><BrainCircuit /></AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{aiHelperUser.name}</CardTitle>
                        <CardDescription>Команда: Кибер Орлы</CardDescription>
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1 bg-muted/20 p-6">
                    <div className="space-y-6">
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-end gap-2", message.sender === 'me' ? "justify-end" : "justify-start")}>
                                {message.sender === 'ai' && (
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarImage src={aiHelperUser.avatar} data-ai-hint={aiHelperUser.dataAiHint} />
                                        <AvatarFallback><BrainCircuit /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "max-w-xs lg:max-w-md rounded-lg p-3 text-sm shadow-sm",
                                    message.sender === 'me' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-background rounded-bl-none"
                                )}>
                                    {message.isThinking ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>{message.text}</span>
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{message.text}</p>
                                    )}
                                </div>
                                {message.sender === 'me' && (
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarImage src={currentUser.avatar} data-ai-hint="current user" />
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background">
                    <div className="relative">
                        <Textarea 
                            placeholder="Спросите что-нибудь о команде..." 
                            className="pr-20 min-h-[40px] resize-none" 
                            rows={1}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            disabled={isLoading}
                        />
                        <Button className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleSendMessage} disabled={isLoading}>
                            <Send />
                        </Button>
                    </div>
                </div>
             </Card>
        </div>
    );
}
