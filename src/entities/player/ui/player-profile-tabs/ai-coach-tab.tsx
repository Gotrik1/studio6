'use client';

import { useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Loader2, Sparkles, BrainCircuit, AlertCircle, TrendingUp, TrendingDown, Activity, BookOpen, Youtube, Goal } from "lucide-react";
import { analyzePlayerPerformance, type AnalyzePlayerPerformanceOutput } from '@/shared/api/genkit/flows/analyze-player-performance-flow';
import { generateTrainingPlan, type GenerateTrainingPlanOutput } from '@/shared/api/genkit/flows/generate-training-plan-flow';
import type { User } from "@/shared/lib/types";
import { recentMatches } from "@/shared/lib/mock-data/profiles";

interface AiCoachTabProps {
  user: User & {
    mainSport: string;
  };
}

export function AiCoachTab({ user }: AiCoachTabProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalyzePlayerPerformanceOutput | null>(null);
    const [trainingPlan, setTrainingPlan] = useState<GenerateTrainingPlanOutput | null>(null);

    const handleGetCoaching = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        setTrainingPlan(null);

        try {
            const playerStats = `
                Role: ${user.role},
                Main Sport: ${user.mainSport},
                Total Matches: 218,
                Wins: 152
            `;
            const matchHistory = recentMatches.map(m => `vs ${m.teamB}: ${m.scoreA}-${m.scoreB} on ${m.map}`).join('\n');

            const analysis = await analyzePlayerPerformance({ playerStats, matchHistory });
            const plan = await generateTrainingPlan({
                analysis: analysis,
                playerRole: user.role,
            });

            setAnalysisResult(analysis);
            setTrainingPlan(plan);
        } catch (e) {
            console.error(e);
            setError("Не удалось получить персональную тренировку. Пожалуйста, попробуйте еще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Персональный AI-тренер</CardTitle>
                <CardDescription>
                    Получите глубокий анализ вашей производительности и индивидуальный план тренировок, чтобы достичь новых высот.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {!analysisResult && !isLoading && (
                     <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-semibold mb-2">Готовы стать лучше?</p>
                        <p className="text-sm text-muted-foreground mb-4">Нажмите кнопку, чтобы ИИ проанализировал ваши последние игры и составил план.</p>
                        <Button onClick={handleGetCoaching} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Получить тренировку
                        </Button>
                    </div>
                )}
               
                {isLoading && (
                    <div className="space-y-6">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                )}
                
                {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                {analysisResult && trainingPlan && (
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
                        
                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> Персональный план на неделю</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm flex items-center gap-1.5"><Activity className="h-4 w-4"/>Фокус недели:</h4>
                                    <p className="text-sm text-muted-foreground">{trainingPlan.weeklyFocus}</p>
                                </div>
                                    <div>
                                    <h4 className="font-semibold text-sm flex items-center gap-1.5"><BookOpen className="h-4 w-4"/>Упражнения:</h4>
                                    <ul className="space-y-1 mt-1">
                                    {trainingPlan.drills.map((drill, i) => (
                                        <li key={i} className="text-sm text-muted-foreground ml-4 p-2 border-l-2">
                                            <strong>{drill.name} ({drill.duration}):</strong> {drill.description}
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm flex items-center gap-1.5"><Youtube className="h-4 w-4"/>Рекомендованные видео:</h4>
                                    <ul className="space-y-1 mt-1">
                                        {trainingPlan.suggestedVideos.map((video, i) => (
                                            <li key={i} className="text-sm text-primary underline">
                                                <a href={video.url} target="_blank" rel="noopener noreferrer">{video.title}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm flex items-center gap-1.5"><Goal className="h-4 w-4"/>Цель на неделю:</h4>
                                    <p className="text-sm text-muted-foreground">{trainingPlan.weeklyGoal}</p>
                                </div>
                            </CardContent>
                        </Card>
                         <div className="text-center">
                            <Button variant="outline" onClick={handleGetCoaching} disabled={isLoading}>
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
