'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { BrainCircuit, AlertCircle, RefreshCw } from 'lucide-react';
import { generateDashboardTip, type GenerateDashboardTipOutput } from '@/shared/api/genkit/flows/generate-dashboard-tip-flow';
import { cn } from '@/shared/lib/utils';
import { useSession } from '@/shared/lib/session/client';
import { trainingLogData } from '@/shared/lib/mock-data/training-log';
import { matchesList } from '@/shared/lib/mock-data/matches';


export function AiCoachTip() {
    const { user } = useSession();
    const [tip, setTip] = useState<GenerateDashboardTipOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleFetchTip = async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            // Find the last completed workout
            const lastWorkout = [...trainingLogData]
                .filter(log => log.status === 'completed')
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

            // Find the last completed match for the user's team (mocked as 'Дворовые Атлеты')
            const lastMatch = [...matchesList]
                .filter(m => m.status === 'Завершен' && (m.team1.name === 'Дворовые Атлеты' || m.team2.name === 'Дворовые Атлеты'))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

            let lastActivityText = "Начал пользоваться платформой.";

            if (lastWorkout && lastMatch) {
                if (new Date(lastWorkout.date) > new Date(lastMatch.date)) {
                    lastActivityText = `Завершил тренировку: "${lastWorkout.workoutName}".`;
                } else {
                    lastActivityText = `Сыграл матч за команду ${lastMatch.team1.name} против ${lastMatch.team2.name}, счет ${lastMatch.score}.`;
                }
            } else if (lastWorkout) {
                lastActivityText = `Завершил тренировку: "${lastWorkout.workoutName}".`;
            } else if (lastMatch) {
                lastActivityText = `Сыграл матч за команду ${lastMatch.team1.name} против ${lastMatch.team2.name}, счет ${lastMatch.score}.`;
            }

            const tipData = await generateDashboardTip({
                userName: user.name,
                lastActivity: lastActivityText,
            });
            setTip(tipData);
        } catch (e) {
            console.error('Failed to fetch AI Coach tip:', e);
            setError('Не удалось получить совет от AI-тренера.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            handleFetchTip();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (!user) return null; // Don't render if there's no user

    if (isLoading) {
        return <Skeleton className="w-full h-[120px]" />;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }
    
    if (!tip) return null;

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    Совет от AI-Тренера
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={handleFetchTip} disabled={isLoading}>
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground italic">&quot;{tip.tip}&quot;</p>
            </CardContent>
        </Card>
    );
}
