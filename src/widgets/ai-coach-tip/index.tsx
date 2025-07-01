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

const mockLastActivity = "Выиграл сложный матч по Valorant со счетом 13-11, сделав несколько ключевых фрагов в конце игры.";

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
            const tipData = await generateDashboardTip({
                userName: user.name,
                lastActivity: mockLastActivity, // In a real app, this would be fetched dynamically
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
        return <Skeleton className="w-full h-24" />;
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
