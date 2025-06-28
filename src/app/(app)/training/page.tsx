
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, BrainCircuit, Goal, Loader2, Sparkles, Youtube, AlertCircle, ShieldCheck, TrendingUp, TrendingDown } from "lucide-react";
import { analyzePlayerPerformance, type AnalyzePlayerPerformanceOutput } from '@/ai/flows/analyze-player-performance-flow';
import { generateTrainingPlan, type GenerateTrainingPlanOutput } from '@/ai/flows/generate-training-plan-flow';
import { analyzeSecurity, type AnalyzeSecurityOutput } from '@/ai/flows/analyze-security-flow';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

const mockActivityLog = `
- 2024-09-27 10:00: Login from IP 89.123.45.67 (Moscow, RU) on Chrome, Windows.
- 2024-09-27 10:05: Viewed team profile 'Cyber Eagles'.
- 2024-09-27 11:30: Played match vs 'Vortex Vipers'. Result: Win (13-5). KDA: 2.5.
- 2024-09-27 12:15: Chat with 'NewUser123': "hey man, cool skins, where did u get them? check out this site for free skins: sketchy-skins.com"
- 2024-09-28 03:15: Login from IP 104.28.99.12 (Jakarta, ID) on Firefox, Linux.
- 2024-09-28 03:20: Played match vs 'Shadow Syndicate'. Result: Win (13-2). KDA: 5.8.
- 2024-09-28 03:55: Logout.
`;

const SecurityRecommendationCard = ({ recommendation }: { recommendation: AnalyzeSecurityOutput['recommendations'][0] }) => {
    const severityMap = {
        high: { icon: <AlertCircle className="h-5 w-5 text-destructive" />, cardClass: "border-destructive bg-destructive/10", titleClass: "text-destructive" },
        medium: { icon: <ShieldCheck className="h-5 w-5 text-yellow-500" />, cardClass: "border-yellow-500/50 bg-yellow-500/10", titleClass: "text-yellow-600 dark:text-yellow-500" },
        low: { icon: <ShieldCheck className="h-5 w-5 text-green-500" />, cardClass: "border-green-500/50 bg-green-500/10", titleClass: "text-green-600 dark:text-green-500" }
    };
    const { icon, cardClass, titleClass } = severityMap[recommendation.severity];
    return (
        <Card className={cardClass}>
            <CardHeader className="flex-row items-start gap-4 space-y-0 p-4">
                {icon}
                <div className="flex-1">
                    <CardTitle className={`text-base ${titleClass}`}>{recommendation.title}</CardTitle>
                    <CardDescription className="text-xs">{recommendation.description}</CardDescription>
                </div>
            </CardHeader>
        </Card>
    );
};

function SecurityCheckCard() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiResult, setAiResult] = useState<AnalyzeSecurityOutput | null>(null);

    const handleCheckSecurity = async () => {
        setIsLoading(true);
        setError(null);
        setAiResult(null);

        try {
            const result = await analyzeSecurity({ activityLog: mockActivityLog });
            setAiResult(result);
        } catch (e) {
            console.error(e);
            setError("Не удалось выполнить проверку безопасности.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/>Здоровье аккаунта</CardTitle>
                <CardDescription>Проверьте безопасность вашего аккаунта с помощью ИИ.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!aiResult && !isLoading && (
                    <Button onClick={handleCheckSecurity} className="w-full">
                        <BrainCircuit className="mr-2 h-4 w-4"/>
                        Запустить проверку безопасности
                    </Button>
                )}
                {isLoading && <div className="space-y-2"><Skeleton className="h-16 w-full"/><Skeleton className="h-16 w-full"/></div>}
                {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                {aiResult && (
                    <div className="space-y-2">
                        {aiResult.recommendations.length > 0 ? (
                            aiResult.recommendations.map((rec, index) => <SecurityRecommendationCard key={index} recommendation={rec} />)
                        ) : (
                            <SecurityRecommendationCard recommendation={{ title: "Всё в порядке!", description: "Мы не обнаружили подозрительной активности.", severity: "low" }} />
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function TrainingCenterPage() {
    const { toast } = useToast();
    const [plan, setPlan] = useState<GenerateTrainingPlanOutput | null>(null);
    const [analysis, setAnalysis] = useState<AnalyzePlayerPerformanceOutput | null>(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    const [isLoadingPlan, setIsLoadingPlan] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [completedDrills, setCompletedDrills] = useState<string[]>([]);

    const handleAnalyze = async () => {
        setIsLoadingAnalysis(true);
        setError(null);
        setAnalysis(null);
        setPlan(null);

        try {
            const analysisResult = await analyzePlayerPerformance({
                playerStats: "Role: Duelist, KDA: 1.1, Win Rate: 55%, Favorite Agent: Jett",
                matchHistory: "Recent games show inconsistent entry fragging and difficulty in post-plant situations."
            });
            setAnalysis(analysisResult);
        } catch (e) {
            console.error(e);
            setError("Не удалось провести анализ. Попробуйте еще раз.");
        } finally {
            setIsLoadingAnalysis(false);
        }
    };

    const handleGeneratePlan = async () => {
        if (!analysis) return;
        setIsLoadingPlan(true);
        setError(null);
        setPlan(null);
        setCompletedDrills([]);
        try {
            const trainingPlanResult = await generateTrainingPlan({
                analysis: analysis,
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
            setIsLoadingPlan(false);
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
                    <BrainCircuit className="h-8 w-8 text-primary" />
                    AI-Коуч Центр
                </h1>
                <p className="text-muted-foreground">
                    Получите персональный анализ игры, план развития и советы по безопасности от вашего AI-тренера.
                </p>
            </div>
            
            {error && (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Произошла ошибка</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                    {!analysis && !isLoadingAnalysis && (
                        <Card className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed h-full">
                            <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold">Ваш личный AI-тренер</h2>
                            <p className="text-muted-foreground mb-4 max-w-md">Нажмите кнопку, чтобы проанализировать вашу игру и получить персональный план тренировок на неделю.</p>
                            <Button onClick={handleAnalyze} disabled={isLoadingAnalysis}>
                                {isLoadingAnalysis ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                {isLoadingAnalysis ? "Анализирую..." : "Начать анализ"}
                            </Button>
                        </Card>
                    )}

                    {isLoadingAnalysis && (
                        <Card>
                            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                            <CardContent className="space-y-4"><Skeleton className="h-32 w-full" /></CardContent>
                        </Card>
                    )}

                    {analysis && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Анализ производительности</CardTitle>
                                <CardDescription>Сильные и слабые стороны на основе ваших последних игр.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500"/>Сильные стороны</h3>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                        {analysis.strengths.map((item, i) => <li key={`str-${i}`}>{item}</li>)}
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2"><TrendingDown className="h-5 w-5 text-yellow-500"/>Точки роста</h3>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                        {analysis.weaknesses.map((item, i) => <li key={`weak-${i}`}>{item}</li>)}
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleGeneratePlan} disabled={isLoadingPlan || !analysis}>
                                    {isLoadingPlan ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                    {isLoadingPlan ? "Генерирую план..." : "Создать план тренировок"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {isLoadingPlan && (
                        <Card>
                             <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                             <CardContent className="space-y-4"><Skeleton className="h-40 w-full" /></CardContent>
                        </Card>
                    )}
                    
                    {plan && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary"/>План тренировок на неделю</CardTitle>
                                <CardDescription>Отмечайте выполненные задания, чтобы отслеживать прогресс.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Прогресс: {completedDrills.length} / {totalDrills}</span>
                                        <span>{Math.round(progressPercentage)}%</span>
                                    </div>
                                    <Progress value={progressPercentage} className="h-2" />
                                </div>
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
                    )}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <SecurityCheckCard />
                    {plan && (
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Goal className="h-5 w-5 text-primary"/>Цель на неделю</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-semibold">{plan.weeklyGoal}</p>
                            </CardContent>
                        </Card>
                    )}
                    {plan && (
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
                    )}
                </div>
            </div>
        </div>
    );
}
