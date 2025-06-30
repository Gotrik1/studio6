'use client';

import { useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useToast } from "@/shared/hooks/use-toast";
import { BrainCircuit, Loader2, Sparkles, AlertCircle, Bot, User, Send } from "lucide-react";
import { askTeamChatbot } from '@/shared/api/genkit/flows/team-chatbot-flow';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';
import { Input } from '@/shared/ui/input';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { useSession } from '@/shared/lib/session/client';

type Message = {
    sender: 'user' | 'ai';
    text: string;
};

const examplePrompts = [
    "Какое у нас следующее расписание?",
    "Покажи историю последних матчей.",
    "Какая у нас текущая статистика?",
];

export function AITeamAssistantTab() {
    const { toast } = useToast();
    const { user } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [conversation, setConversation] = useState<Message[]>([]);

    const handleSubmit = async (prompt?: string) => {
        const query = prompt || input;
        if (!query.trim()) return;

        setIsLoading(true);
        const userMessage: Message = { sender: 'user', text: query };
        setConversation(prev => [...prev, userMessage]);
        setInput('');

        try {
            const aiResponse = await askTeamChatbot({ teamId: 'dvotovyie-atlety', query });
            const aiMessage: Message = { sender: 'ai', text: aiResponse };
            setConversation(prev => [...prev, aiMessage]);
        } catch (e) {
            console.error(e);
            const errorMessage: Message = { sender: 'ai', text: 'Произошла ошибка при обработке вашего запроса.' };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[calc(100vh-28rem)]">
            <CardHeader>
                <CardTitle>AI-Ассистент Команды</CardTitle>
                <CardDescription>Задайте вопрос о расписании, статистике или истории матчей вашей команды.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {conversation.length === 0 && (
                            <div className="p-4 text-center text-muted-foreground">
                                <p>Задайте вопрос или выберите пример ниже.</p>
                            </div>
                        )}
                        {conversation.map((msg, index) => (
                             <div key={index} className={cn('flex items-start gap-3', msg.sender === 'user' ? 'justify-end' : '')}>
                                {msg.sender === 'ai' && (
                                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex-shrink-0">
                                        <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn('max-w-md rounded-lg px-4 py-2 text-sm shadow-sm', msg.sender === 'ai' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                                     <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                                {msg.sender === 'user' && user && (
                                    <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground flex-shrink-0">
                                         <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                 <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex-shrink-0">
                                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                                <div className="max-w-md rounded-lg px-4 py-2 text-sm shadow-sm bg-muted flex items-center gap-2">
                                     <Loader2 className="h-4 w-4 animate-spin"/>
                                     <span>Думаю...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="border-t p-4 space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {examplePrompts.map(prompt => (
                            <Button key={prompt} variant="outline" size="sm" onClick={() => handleSubmit(prompt)} disabled={isLoading}>
                                {prompt}
                            </Button>
                        ))}
                    </div>
                     <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Например, 'какой у нас winrate?'"
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
