'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Bot, Send, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useSession } from '@/shared/lib/session/client';
import { askTeamChatbot } from '@/shared/api/genkit/flows/team-chatbot-flow';

type ChatMessage = {
    sender: 'user' | 'ai' | 'other';
    name: string;
    avatar: string;
    text: string;
    isThinking?: boolean;
};

interface TeamChatInterfaceProps {
    teamId: string;
}

const mockInitialMessages: ChatMessage[] = [
    { sender: 'other', name: 'Echo', avatar: 'https://placehold.co/100x100.png', text: 'Отлично сыграли вчера!' },
    { sender: 'other', name: 'Viper', avatar: 'https://placehold.co/100x100.png', text: 'Да, особенно выход на А.' },
];

export function TeamChatInterface({ teamId }: TeamChatInterfaceProps) {
    const { user } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>(mockInitialMessages);
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

        const text = input;
        setInput('');
        
        const userMessage: ChatMessage = { sender: 'user', name: user.name, avatar: user.avatar, text };
        setMessages(prev => [...prev, userMessage]);
        
        // Check if the message is a command for the bot
        if (text.toLowerCase().startsWith('/ai') || text.toLowerCase().startsWith('@ai')) {
            const thinkingMessage: ChatMessage = { sender: 'ai', name: 'AI Ассистент', avatar: '', text: 'Думаю...', isThinking: true };
            setMessages(prev => [...prev, thinkingMessage]);
            setIsLoading(true);
            const query = text.replace(/^\/ai\s*|^\@ai\s*/, '');
            
            try {
                const aiResponseText = await askTeamChatbot({ teamId, query });
                const aiMessage: ChatMessage = { sender: 'ai', name: 'AI Ассистент', avatar: '', text: aiResponseText };
                setMessages(prev => [...prev.filter(m => !m.isThinking), aiMessage]);
            } catch(e) {
                console.error(e);
                const errorMessage: ChatMessage = { sender: 'ai', name: 'AI Ассистент', avatar: '', text: 'Произошла ошибка при обработке вашего запроса.' };
                setMessages(prev => [...prev.filter(m => !m.isThinking), errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
        
    };
    
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !isLoading) {
            handleSend();
        }
    };
    
    const getAvatarFallback = (name: string) => name.split(' ').map(n => n[0]).join('');

    return (
        <Card className="flex flex-col h-[calc(100vh-28rem)]">
            <CardHeader>
                <CardTitle>Чат команды</CardTitle>
                <CardDescription>Общайтесь с командой и задавайте вопросы AI-ассистенту, используя /ai или @ai.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {messages.map((message, index) => (
                           <div key={index} className={cn("flex items-end gap-2", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                               {(message.sender === 'other' || message.sender === 'ai') && (
                                   <Avatar className="h-8 w-8 border">
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
                                   <Avatar className="h-8 w-8 border">
                                       <AvatarImage src={message.avatar} />
                                       <AvatarFallback>{getAvatarFallback(message.name)}</AvatarFallback>
                                   </Avatar>
                               )}
                           </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background">
                    <div className="flex items-center gap-2">
                        <Input 
                            placeholder="Напишите сообщение или задайте вопрос AI..."
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
