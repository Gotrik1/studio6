'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Award, BookOpen, BrainCircuit, CheckCircle, Dumbbell, Goal, Loader2, Sparkles, Youtube, AlertCircle } from "lucide-react";
import { analyzePlayerPerformance } from '@/ai/flows/analyze-player-performance-flow';
import { generateTrainingPlan, type GenerateTrainingPlanOutput } from '@/ai/flows/generate-training-plan-flow';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function TrainingCenterPage() {
    const { toast } = useToast();
    const [plan, setPlan] = useState<GenerateTrainingPlanOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [completedDrills, setCompletedDrills] = useState<string[]>([]);

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        setError(null);
        setPlan(null);
        setCompletedDrills([]);

        try {
            // Step 1: Analyze player performance (with mock data for now)
            const analysisResult = await analyzePlayerPerformance({
                playerStats: "Role: Duelist, KDA: 1.1, Win Rate: 55%, Favorite Agent: Jett",
                matchHistory: "Recent games show inconsistent entry fragging and difficulty in post-plant situations."
            });

            // Step 2: Generate training plan based on analysis
            const trainingPlanResult = await generateTrainingPlan({
                analysis: analysisResult,
                playerRole: 'Duelist',
            });
            
            setPlan(trainingPlanResult);
            toast({
                title: "Новый план сгенерирован!",
                description: "Ваш персональный план тренировок на неделю готов.",
            });
        } catch (e) {
            console.error(e);
            setError("Не удалось сгенерировать план. Попробуйте еще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDrillCompletion = (drillName: string) => {
        setCompletedDrills(prev => 
            prev.includes(drillName) 
            ? prev.filter(name => name !== drillName) 
            : [...prev, drillName]
        );
    };
    
    const totalDrills = plan?.drills.length || 0;
    const progressPercentage = totalDrills > 0 ? (completedDrills.length / totalDrills) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Dumbbell className="h-8 w-8 text-primary" />
                    Тренировочный Центр
                </h1>
                <p className="text-muted-foreground">
                    Получите персональный план развития, созданный AI-тренером на основе вашей производительности.
                </p>
            </div>
            
            {!plan && !isLoading && (
                 <Card className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed">
                    <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold">Ваш личный AI-тренер</h2>
                    <p className="text-muted-foreground mb-4 max-w-md">Нажмите кнопку, чтобы проанализировать вашу игру и получить персональный план тренировок на неделю.</p>
                    <Button onClick={handleGeneratePlan} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                        {isLoading ? "Анализирую..." : "Сгенерировать мой план"}
                    </Button>
                </Card>
            )}

             {isLoading && (
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            )}

            {error && (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            {plan && (
                <div className="space-y-6 animate-in fade-in-50">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Прогресс за неделю</CardTitle>
                                <CardDescription>Выполнено {completedDrills.length} из {totalDrills} заданий.</CardDescription>
                            </div>
                            <Button variant="outline" onClick={handleGeneratePlan} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                {isLoading ? "Генерация..." : "Сгенерировать новый план"}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Progress value={progressPercentage} className="h-2" />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary"/>План тренировок</CardTitle>
                                    <CardDescription>Отмечайте выполненные задания, чтобы отслеживать прогресс.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                {plan.drills.map((drill, index) => (
                                    <div key={index} className="flex items-start gap-4 rounded-md border p-4 transition-colors hover:bg-muted/50">
                                        <Checkbox 
                                                id={`drill-${index}`} 
                                                checked={completedDrills.includes(drill.name)}
                                                onCheckedChange={() => toggleDrillCompletion(drill.name)}
                                                className="mt-1"
                                            />
                                        <div className="grid gap-1.5">
                                            <label htmlFor={`drill-${index}`} className="font-semibold cursor-pointer">{drill.name} <span className="font-normal text-muted-foreground">({drill.duration})</span></label>
                                            <p className="text-sm text-muted-foreground">{drill.description}</p>
                                        </div>
                                    </div>
                                ))}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary"/>Фокус недели</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{plan.weeklyFocus}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Goal className="h-5 w-5 text-primary"/>Цель на неделю</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-semibold">{plan.weeklyGoal}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Youtube className="h-5 w-5 text-primary"/>Видео-гайды</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                {plan.suggestedVideos.map((video, index) => (
                                    <a key={index} href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline-offset-4 hover:underline block truncate">
                                        {video.title}
                                    </a>
                                ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
