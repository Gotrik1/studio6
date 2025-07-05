'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { BrainCircuit, AlertCircle, RefreshCw } from 'lucide-react';
import { generateDashboardTip, type GenerateDashboardTipOutput } from '@/shared/api/genkit/flows/generate-dashboard-tip-flow';
import { cn } from '@/shared/lib/utils';
import { useSession } from '@/shared/lib/session/client';


export function AiCoachTip() {
    const { user } = useSession();
    const [tip, setTip] = useState<GenerateDashboardTipOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleFetchTip = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        setTip(null);
        try {
            const tipData = await generateDashboardTip();
            setTip(tipData);
        } catch (e) {
            console.error('Failed to fetch AI Coach tip:', e);
            setError('Не удалось получить совет от AI-тренера.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            handleFetchTip();
        }
    }, [user, handleFetchTip]);

    if (!user) return null; // Don't render if there's no user

    if (isLoading) {
        return <Skeleton className="w-full h-[120px]" />;
    }

    if (error) {
        return (
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><BrainCircuit /> Совет от AI-Тренера</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                        <div className="mt-4">
                            <Button variant="outline" size="sm" onClick={handleFetchTip}>Попробовать снова</Button>
                        </div>
                    </Alert>
                </CardContent>
            </Card>
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

    