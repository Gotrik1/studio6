
'use client';

import { useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Loader2, Sparkles, AlertCircle, TrendingUp, TrendingDown, ClipboardList, Target, Youtube } from "lucide-react";
import { analyzePlayerPerformance, type AnalyzePlayerPerformanceOutput } from '@/shared/api/genkit/flows/analyze-player-performance-flow';
import { generateTrainingPlan, type GenerateTrainingPlanOutput } from '@/shared/api/genkit/flows/generate-training-plan-flow';
import Link from 'next/link';
import { useTraining } from '@/shared/context/training-provider';
import { getTrainingAnalytics } from '@/shared/lib/get-training-analytics';
import { winLossData } from '@/shared/lib/mock-data/player-stats';


const mockFitnessGoal = 'Набор массы';


export function PlayerPerformanceCoach() {
    const { log } = useTraining();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalyzePlayerPerformanceOutput | null>(null);
    
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [planError, setPlanError] = useState<string | null>(null);
    const [planResult, setPlanResult] = useState<GenerateTrainingPlanOutput | null>(null);


    const handleGetAnalysis = async () => {
        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult(null);
        setPlanResult(null);
        setPlanError(null);

        try {
             // Generate summaries from mock data
            const { trainingMetrics } = getTrainingAnalytics(log);
            const physicalSummary = `
                Всего тренировок: ${trainingMetrics.totalWorkouts},
                Ежемесячный объем: ${trainingMetrics.monthlyVolume},
                Тренировочный стрик: ${trainingMetrics.workoutStreak},
                Любимое упражнение: ${trainingMetrics.favoriteExercise},
                Последняя тренировка: ${trainingMetrics.lastWorkout}.
            `;
            const analysis = await analyzePlayerPerformance({ 
                trainingSummary: physicalSummary,
                recentWorkouts: JSON.stringify(log.filter(l => l.status === 'completed').slice(0, 2))
             });
            setAnalysisResult(analysis);
        } catch (e) {
            console.error(e);
            setAnalysisError("Не удалось выполнить анализ производительности.");
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const handleGeneratePlan = async () => {
        if (!analysisResult) return;
        
        setIsGeneratingPlan(true);
        setPlanError(null);
        setPlanResult(null);

        try {
            const plan = await generateTrainingPlan({
                analysis: analysisResult,
                fitnessGoal: mockFitnessGoal
            });
            setPlanResult(plan);
        } catch (e) {
             console.error(e);
            setPlanError("Не удалось сгенерировать план тренировок.");
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Персональный AI-Коуч</CardTitle>
                <CardDescription>Получите анализ вашей физической подготовки и персональный план на неделю.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {!analysisResult && (
                     <Button onClick={handleGetAnalysis} disabled={isAnalyzing}>
                        {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Проанализировать мою подготовку
                    </Button>
                )}
                
                {isAnalyzing && <Skeleton className="h-40 w-full" />}
                {analysisError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Ошибка</AlertTitle><AlertDescription>{analysisError}</AlertDescription></Alert>}

                {analysisResult && (
                    <div className="space-y-4 animate-in fade-in-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5"><TrendingUp className="text-green-500"/>Сильные стороны</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">{analysisResult.strengths.map((s,i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5"><TrendingDown className="text-yellow-500"/>Точки роста</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">{analysisResult.weaknesses.map((s,i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                        </div>
                         {!planResult && (
                             <Button onClick={handleGeneratePlan} disabled={isGeneratingPlan}>
                                {isGeneratingPlan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClipboardList className="mr-2 h-4 w-4" />}
                                Создать план на неделю
                            </Button>
                         )}
                    </div>
                )}
                
                {isGeneratingPlan && <Skeleton className="h-48 w-full" />}
                {planError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Ошибка</AlertTitle><AlertDescription>{planError}</AlertDescription></Alert>}

                 {planResult && (
                     <div className="space-y-6 border-t pt-6 animate-in fade-in-50">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Фокус на неделю: {planResult.weeklyFocus}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-semibold text-base">Цель: <span className="font-normal text-muted-foreground">{planResult.weeklyGoal}</span></p>
                            </CardContent>
                        </Card>
                        <div className="space-y-2">
                             <h4 className="font-semibold text-sm">Рекомендуемые упражнения:</h4>
                             {planResult.drills.map((drill, i) => (
                                <Card key={i}>
                                    <CardContent className="p-4">
                                        <p className="font-bold">{drill.name} ({drill.duration})</p>
                                        <p className="text-xs text-muted-foreground">{drill.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                         <div className="space-y-2">
                             <h4 className="font-semibold text-sm">Полезные видео:</h4>
                              {planResult.suggestedVideos.map((video, i) => (
                                <Button asChild variant="link" key={i} className="p-0 h-auto">
                                    <Link href={video.url} target="_blank" className="flex items-center gap-2 text-sm">
                                        <Youtube className="h-4 w-4 text-red-500"/>{video.title}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                     </div>
                 )}
            </CardContent>
        </Card>
    );
}
