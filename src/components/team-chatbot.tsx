'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session-client';
import { askTeamChatbot } from '@/ai/flows/team-chatbot-flow';

type ChatMessage = {
    sender: 'user' | 'ai';
    text: string;
    isThinking?: boolean;
};

interface TeamChatbotProps {
    teamId: string;
}

export function TeamChatbot({ teamId }: TeamChatbotProps) {
    const { user } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !user) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        const thinkingMessage: ChatMessage = { sender: 'ai', text: 'Думаю...', isThinking: true };
        
        setMessages(prev => [...prev, userMessage, thinkingMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await askTeamChatbot({ teamId, query: currentInput });
            const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev.slice(0, -1), aiMessage]);
        } catch(e) {
            console.error(e);
            const errorMessage: ChatMessage = { sender: 'ai', text: 'Произошла ошибка при обработке вашего запроса.' };
            setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !isLoading) {
            handleSend();
        }
    };

    return (
        <Card className="flex flex-col h-[70vh]">
            <CardHeader>
                <CardTitle>Чат-бот команды</CardTitle>
                <CardDescription>Задайте вопрос о расписании, статистике или истории матчей.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {messages.map((message, index) => (
                           <div key={index} className={cn("flex items-end gap-2", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                               {message.sender === 'ai' && (
                                   <Avatar className="h-8 w-8 border">
                                       <AvatarFallback><Bot /></AvatarFallback>
                                   </Avatar>
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
                               {message.sender === 'user' && user && (
                                   <Avatar className="h-8 w-8 border">
                                       <AvatarImage src={user.avatar} data-ai-hint="user avatar"/>
                                       <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                   </Avatar>
                               )}
                           </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                     {messages.length === 0 && (
                        <div className="h-full flex flex-col justify-center items-center text-center text-muted-foreground">
                            <Bot className="h-12 w-12 mb-4"/>
                            <p className="font-semibold">Я — AI-помощник вашей команды</p>
                            <p className="text-sm">Спросите меня: &quot;Когда следующая игра?&quot;</p>
                        </div>
                    )}
                </ScrollArea>
                <div className="p-4 border-t bg-background">
                    <div className="flex items-center gap-2">
                        <Input 
                            placeholder="Ваш вопрос..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                        <Button onClick={handleSend} disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
