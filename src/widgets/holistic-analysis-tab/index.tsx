'use client';

import { useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Loader2, Sparkles, BrainCircuit, AlertCircle, TrendingUp, Goal, Link as LinkIcon } from "lucide-react";
import { analyzeHolisticPerformance, type AnalyzeHolisticPerformanceOutput } from '@/shared/api/genkit/flows/analyze-holistic-performance-flow';

// Mock data for the flow
const mockPhysicalSummary = "Consistent training 3-4 times a week. Focus on strength (bench press, squats). Recent increase in total volume. Personal record in deadlift last week.";
const mockEsportsSummary = "Win rate stable at 62%. KDA slightly dropped in the last 7 days. Best performance on Fridays and Saturdays.";

export function HolisticAnalysisTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeHolisticPerformanceOutput | null>(null);

    const handleGetAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const analysis = await analyzeHolisticPerformance({
                physicalSummary: mockPhysicalSummary,
                esportsSummary: mockEsportsSummary,
            });
            setAnalysisResult(analysis);
        } catch (e) {
            console.error(e);
            setError("Не удалось выполнить комплексный анализ. Пожалуйста, попробуйте еще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Комплексный AI-Анализ</CardTitle>
                <CardDescription>
                    Откройте для себя взаимосвязи между вашей физической формой и игровыми результатами.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {!analysisResult && !isLoading && (
                     <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-semibold mb-2">Объедините два мира</p>
                        <p className="text-sm text-muted-foreground mb-4">Нажмите кнопку, чтобы AI проанализировал ваши физические и игровые данные, выявил корреляции и дал уникальные рекомендации.</p>
                        <Button onClick={handleGetAnalysis} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Начать комплексный анализ
                        </Button>
                    </div>
                )}
               
                {isLoading && (
                    <div className="space-y-6">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                )}
                
                {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                {analysisResult && (
                    <div className="space-y-6 animate-in fade-in-50">
                        <Alert>
                           <AlertTitle>Общая оценка</AlertTitle>
                           <AlertDescription>{analysisResult.overallAssessment}</AlertDescription>
                        </Alert>
                        
                        <div className="space-y-4">
                           <h3 className="font-semibold text-lg flex items-center gap-2"><LinkIcon className="text-primary"/>Выявленные корреляции</h3>
                           {analysisResult.correlations.map((item, i) => (
                               <Card key={i} className="bg-muted/50 shadow-none">
                                   <CardHeader className="pb-2">
                                       <CardTitle className="text-base flex items-center gap-2">
                                           <TrendingUp className="h-5 w-5"/> {item.observation}
                                       </CardTitle>
                                   </CardHeader>
                                   <CardContent>
                                        <p className="text-sm text-muted-foreground">{item.explanation}</p>
                                   </CardContent>
                               </Card>
                           ))}
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><Goal className="text-primary"/>Рекомендации</h3>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                                {analysisResult.recommendations.map((item, i) => <li key={`rec-${i}`}>{item}</li>)}
                            </ul>
                        </div>
                        
                        <div className="text-center pt-4 border-t">
                            <Button variant="outline" onClick={handleGetAnalysis} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                Проанализировать заново
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
