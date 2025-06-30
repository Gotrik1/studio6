
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { playerScout, type PlayerScoutOutput } from '@/shared/api/genkit/flows/player-scout-flow';
import { Loader2, Sparkles, Send, UserCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import Link from 'next/link';
import { useToast } from '@/shared/hooks/use-toast';

export function PlayerScoutPage() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('Ищем игрока поддержки (Sentinel) для Valorant, который хорошо играет на Cypher. Важна хорошая коммуникация и доступность по вечерам.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PlayerScoutOutput | null>(null);

    const handleSearch = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите, какого игрока вы ищете.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const searchResult = await playerScout(prompt);
            setResult(searchResult);
            if (searchResult.recommendations.length === 0) {
                 toast({
                    title: "Ничего не найдено",
                    description: "Попробуйте изменить ваш запрос.",
                });
            }
        } catch (e) {
            console.error(e);
            setError('Не удалось выполнить поиск. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleInvite = (playerName: string) => {
        toast({
            title: "Приглашение отправлено!",
            description: `Игрок ${playerName} получил ваше приглашение в команду.`,
        });
    }

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2 text-center">
                 <UserCheck className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">AI-Скаут Игроков</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Опишите идеального кандидата для вашей команды, и наш AI-скаут найдет лучших игроков на платформе.
                </p>
            </div>

            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Запрос для скаута</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Textarea
                        id="scout-prompt"
                        placeholder="Например: 'Нужен агрессивный дуэлянт для Valorant с высоким KDA, свободный для тренировок 3 раза в неделю...'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[100px] text-base"
                    />
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                     <Button onClick={handleSearch} disabled={isLoading} size="lg" className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        {isLoading ? 'Идет поиск...' : 'Найти игроков'}
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-8 space-y-6">
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex-row gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-1/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </CardHeader>
                        <CardContent><Skeleton className="h-10 w-full" /></CardContent>
                    </Card>
                ))}
                
                {result?.recommendations.map(({player, reasoning}) => (
                    <Card key={player.id} className="animate-in fade-in-50">
                        <CardHeader className="flex-row gap-4 justify-between items-start">
                           <div className="flex gap-4">
                             <Avatar className="h-12 w-12 border">
                                <AvatarImage src={player.avatar} alt={player.name} />
                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg">{player.name}</CardTitle>
                                <CardDescription>{player.role}</CardDescription>
                            </div>
                           </div>
                           <Button onClick={() => handleInvite(player.name)} size="sm">
                                <Send className="mr-2 h-4 w-4" />
                                Пригласить
                           </Button>
                        </CardHeader>
                        <CardContent>
                            <Alert>
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle>Почему это хороший кандидат?</AlertTitle>
                                <AlertDescription>
                                    {reasoning}
                                </AlertDescription>
                            </Alert>
                            <Button variant="link" asChild className="p-0 h-auto mt-2">
                                <Link href={player.profileUrl}>Смотреть полный профиль</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
             {!isLoading && result && result.recommendations.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                    <p>Подходящих игроков не найдено. Попробуйте уточнить ваш запрос.</p>
                </div>
            )}
        </div>
    );
}
