
'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { useSession } from '@/shared/lib/session/client';
import { analyzePlayerPerformance, type AnalyzePlayerPerformanceOutput } from '@/shared/api/genkit/flows/analyze-player-performance-flow';
import { generateTrainingPlan, type GenerateTrainingPlanOutput } from '@/shared/api/genkit/flows/generate-training-plan-flow';
import { recentMatches } from '@/shared/lib/mock-data/profiles';
import { BrainCircuit, Loader2, Sparkles, AlertCircle, TrendingUp, TrendingDown, BookOpen, Youtube, Goal, Activity } from 'lucide-react';

export function TrainingCenterPage() {
    const { user } = useSession();

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzePlayerPerformanceOutput | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [trainingPlan, setTrainingPlan] = useState<GenerateTrainingPlanOutput | null>(null);
    const [planError, setPlanError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!user) return;
        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult(null);
        setTrainingPlan(null);
        setPlanError(null);

        try {
            const playerStats = `Role: ${user.role}, Total Matches: 218, Wins: 152`;
            const matchHistory = recentMatches.map(m => `vs ${m.teamB}: ${m.scoreA}-${m.scoreB} on ${m.map}`).join('\n');
            const result = await analyzePlayerPerformance({ playerStats, matchHistory });
            setAnalysisResult(result);
        } catch (e) {
            console.error(e);
            setAnalysisError("Не удалось получить анализ. Пожалуйста, попробуйте еще раз.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGeneratePlan = async () => {
        if (!analysisResult || !user) return;
        setIsGeneratingPlan(true);
        setPlanError(null);
        setTrainingPlan(null);

        try {
            const plan = await generateTrainingPlan({
                analysis: analysisResult,
                playerRole: user.role,
            });
            setTrainingPlan(plan);
        } catch (e) {
            console.error(e);
            setPlanError("Не удалось сгенерировать план тренировок. Пожалуйста, попробуйте еще раз.");
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    const renderInitialState = () => (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Персональный AI-Коуч</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
                Получите детальный разбор вашей игры, определите сильные и слабые стороны и получите персональный план тренировок на неделю.
            </p>
            <Button onClick={handleAnalyze} size="lg">
                <Sparkles className="mr-2 h-4 w-4" />
                Проанализировать мою игру
            </Button>
        </div>
    );

    const renderAnalysisSkeleton = () => (
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div><Skeleton className="h-40 w-full" /></div>
                <div><Skeleton className="h-40 w-full" /></div>
            </CardContent>
        </Card>
    );

    const renderAnalysisResults = () => (
        analysisResult && (
            <Card>
                <CardHeader>
                    <CardTitle>Результаты анализа</CardTitle>
                    <CardDescription>Ваши сильные стороны и точки роста на основе последних игр.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-muted/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" /> Сильные стороны</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {analysisResult.strengths.map((item, i) => <li key={`str-${i}`}>{item}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                        <CardHeader className="pb-4">
                             <CardTitle className="text-lg flex items-center gap-2"><TrendingDown className="h-5 w-5 text-yellow-500" /> Точки роста</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {analysisResult.weaknesses.map((item, i) => <li key={`weak-${i}`}>{item}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        )
    );

    const renderPlanGenerator = () => (
        <div className="mt-6">
            {isGeneratingPlan ? (
                 <div className="flex items-center justify-center h-40 border rounded-lg border-dashed">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                    <p className="ml-2">Создаем ваш персональный план...</p>
                 </div>
            ) : trainingPlan ? (
                renderTrainingPlan()
            ) : (
                <div className="text-center p-8 border-2 border-dashed rounded-lg bg-muted/30">
                     <h2 className="text-xl font-semibold mb-2">Готовы к следующему шагу?</h2>
                     <p className="text-sm text-muted-foreground mb-4">На основе этого анализа AI может создать для вас персональный план тренировок.</p>
                     <Button onClick={handleGeneratePlan} size="lg">
                         <Sparkles className="mr-2 h-4 w-4" />
                         Сгенерировать план на неделю
                     </Button>
                 </div>
            )}
            {planError && <Alert variant="destructive" className="mt-4"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{planError}</AlertDescription></Alert>}
        </div>
    );
    
    const renderTrainingPlan = () => (
        trainingPlan && (
             <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> Ваш персональный план на неделю</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold flex items-center gap-1.5"><Activity className="h-4 w-4"/>Фокус недели:</h4>
                        <p className="text-muted-foreground">{trainingPlan.weeklyFocus}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold flex items-center gap-1.5"><BookOpen className="h-4 w-4"/>Упражнения:</h4>
                        <ul className="space-y-2 mt-2">
                        {trainingPlan.drills.map((drill, i) => (
                            <li key={i} className="text-sm text-muted-foreground p-3 border-l-2 border-primary/50 bg-background/50 rounded-r-md">
                                <strong>{drill.name} ({drill.duration}):</strong> {drill.description}
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold flex items-center gap-1.5"><Youtube className="h-4 w-4"/>Рекомендованные видео:</h4>
                        <ul className="space-y-1 mt-2">
                            {trainingPlan.suggestedVideos.map((video, i) => (
                                <li key={i} className="text-sm">
                                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                                        {video.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold flex items-center gap-1.5"><Goal className="h-4 w-4"/>Цель на неделю:</h4>
                        <p className="text-muted-foreground">{trainingPlan.weeklyGoal}</p>
                    </div>
                </CardContent>
            </Card>
        )
    );

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Тренировочный центр</h1>
                <p className="text-muted-foreground">
                    Ваш персональный AI-коуч для достижения новых высот в игре.
                </p>
            </div>
            {isAnalyzing && renderAnalysisSkeleton()}
            {analysisError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Ошибка</AlertTitle><AlertDescription>{analysisError}</AlertDescription></Alert>}
            
            {!analysisResult && !isAnalyzing && !analysisError && renderInitialState()}
            
            {analysisResult && renderAnalysisResults()}
            
            {analysisResult && renderPlanGenerator()}
        </div>
    );
}
    