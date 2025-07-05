'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Target, AlertCircle, Award } from 'lucide-react';
import { generatePlaygroundChallenge, type GeneratePlaygroundChallengeOutput } from '@/shared/api/genkit/flows/generate-playground-challenge-flow';
import type { Playground } from '@/entities/playground/model/types';
import { useToast } from '@/shared/hooks/use-toast';
import { getPlayerLeaderboard } from '@/entities/leaderboard/api/get-player-leaderboard';

interface AiPlaygroundChallengeProps {
    playground: Playground;
}

export function AiPlaygroundChallenge({ playground }: AiPlaygroundChallengeProps) {
    const { toast } = useToast();
    const [result, setResult] = useState<GeneratePlaygroundChallengeOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAccepted, setIsAccepted] = useState(false);

    useEffect(() => {
        const fetchChallenge = async () => {
            if (!playground) return;
            setIsLoading(true);
            setError(null);
            setIsAccepted(false);
            try {
                // In a real app, this would be a more sophisticated query for the playground's top player.
                const topPlayers = await getPlayerLeaderboard();
                const topPlayer = topPlayers[0] || { name: 'Неизвестный', points: 0 };
                const challengeData = await generatePlaygroundChallenge({
                    playgroundName: playground.name,
                    playgroundType: playground.type,
                    topPlayerName: topPlayer.name,
                    topPlayerStat: `${topPlayer.points} очков`
                });
                setResult(challengeData);
            } catch (e) {
                console.error(`Failed to fetch AI challenge for ${playground.name}:`, e);
                setError('Не удалось загрузить челлендж.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchChallenge();
    }, [playground]);
    
    const handleAccept = () => {
        setIsAccepted(true);
        toast({
            title: "Вызов принят!",
            description: `Челлендж "${result?.title}" добавлен в ваш список задач.`
        });
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
        );
    }
    
    if (error || !result) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error || 'Не удалось загрузить челлендж.'}</AlertDescription>
            </Alert>
        );
    }

    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Челлендж дня
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="font-semibold text-lg">{result.title}</p>
                <p className="text-sm text-muted-foreground">{result.description}</p>
                <div className="flex items-center gap-2 text-amber-500 font-bold">
                    <Award className="h-5 w-5" />
                    <span>Награда: {result.reward} PD</span>
                </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full" onClick={handleAccept} disabled={isAccepted}>
                    {isAccepted ? 'Вызов принят' : 'Принять вызов'}
                </Button>
            </CardFooter>
        </Card>
    );
}
