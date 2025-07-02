'use client';

import { useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Loader2, Sparkles, BrainCircuit, AlertCircle, TrendingUp, TrendingDown, ClipboardList } from "lucide-react";
import { analyzeEsportsPerformance, type AnalyzeEsportsPerformanceOutput } from '@/shared/api/genkit/flows/analyze-esports-performance-flow';


// Mock data for a player's esports performance
const mockEsportsData = {
    playerStats: "Role: Duelist, KDA: 1.4, Win Rate: 62%, Favorite Map: Ascent",
    matchHistory: "vs Team A: W 13-5\nvs Team B: W 13-10\nvs Team C: L 8-13",
};

export function EsportsAnalysisTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeEsportsPerformanceOutput | null>(null);

    const handleGetAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            // In a real app, this data would be fetched from the user's game history
            const analysis = await analyzeEsportsPerformance(mockEsportsData);
            setAnalysisResult(analysis);
        } catch (e) {
            console.error(e);
            setError("Не удалось получить анализ вашей игры. Пожалуйста, попробуйте еще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Киберспортивный AI-аналитик</CardTitle>
                <CardDescription>
                    Получите детальный разбор вашей игровой производительности, выявите сильные и слабые стороны.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {!analysisResult && !isLoading && (
                     <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-semibold mb-2">Готовы увидеть игру со стороны?</p>
                        <p className="text-sm text-muted-foreground mb-4">Нажмите кнопку, чтобы ИИ проанализировал вашу последнюю статистику и историю матчей.</p>
                        <Button onClick={handleGetAnalysis} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Получить анализ
                        </Button>
                    </div>
                )}
               
                {isLoading && (
                    <div className="space-y-6">
                        <Skeleton className="h-40 w-full" />
                    </div>
                )}
                
                {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                {analysisResult && (
                    <div className="space-y-6 animate-in fade-in-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500"/> Сильные стороны</h3>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                                    {analysisResult.strengths.map((item, i) => <li key={`str-${i}`}>{item}</li>)}
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><TrendingDown className="h-5 w-5 text-yellow-500"/> Точки роста</h3>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                                    {analysisResult.weaknesses.map((item, i) => <li key={`weak-${i}`}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                        
                        <Card className="mx-1 bg-muted/50 shadow-none">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-primary"/> Рекомендации</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                                    {analysisResult.recommendations.map((item, i) => <li key={`rec-${i}`}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                         <div className="text-center">
                            <Button variant="outline" onClick={handleGetAnalysis} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                Сгенерировать заново
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
