'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { BrainCircuit, Loader2, Sparkles, AlertCircle, TrendingUp, TrendingDown, UserCheck, Activity } from 'lucide-react';
import { analyzeTeamPerformance, type AnalyzeTeamPerformanceOutput } from '@/shared/api/genkit/flows/analyze-team-performance-flow';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';

const mockTeamData = {
    teamName: "Кибер Орлы",
    recentMatches: "Победа 13-5 против 'Стальные Титаны', Поражение 10-13 против 'Ледяные Волки'",
    playerStats: [
        { name: "Superuser", kda: "1.2", winRate: "65%", recentPerformanceTrend: 'stable' as const },
        { name: "Echo", kda: "1.5", winRate: "68%", recentPerformanceTrend: 'up' as const },
        { name: "Viper", kda: "1.1", winRate: "62%", recentPerformanceTrend: 'stable' as const },
        { name: "Reaper", kda: "0.9", winRate: "59%", recentPerformanceTrend: 'down' as const },
        { name: "Blaze", kda: "1.0", winRate: "60%", recentPerformanceTrend: 'stable' as const },
    ]
};

export function TeamCoachPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeTeamPerformanceOutput | null>(null);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const analysisResult = await analyzeTeamPerformance(mockTeamData);
            setResult(analysisResult);
        } catch (e) {
            console.error(e);
            setError("Не удалось сгенерировать анализ. Пожалуйста, попробуйте еще раз.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-6">
                    <Skeleton className="h-32 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
            );
        }
        
        if(error) {
            return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (result) {
            return (
                <div className="space-y-6 animate-in fade-in-50">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Activity /> Фокус на неделю</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold text-primary">{result.trainingFocus}</p>
                        </CardContent>
                    </Card>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2"><TrendingUp className="text-green-500"/> Сильные стороны</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    {result.teamStrengths.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2"><TrendingDown className="text-yellow-500"/> Точки роста</CardTitle>
                            </CardHeader>
                             <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    {result.teamWeaknesses.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><UserCheck /> Игрок в фокусе: {result.playerInFocus.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <p><span className="font-semibold">Причина:</span> {result.playerInFocus.reason}</p>
                             <p><span className="font-semibold">Рекомендация:</span> {result.playerInFocus.suggestion}</p>
                        </CardContent>
                    </Card>
                </div>
            )
        }
        
        return null;
    }


    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">AI-Коуч для Команды</h1>
                    <p className="text-muted-foreground">Глубокий анализ производительности и персональные рекомендации.</p>
                </div>
                <Button onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                    {result ? 'Проанализировать заново' : 'Начать анализ'}
                </Button>
            </div>
            
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
}
