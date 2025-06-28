'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BrainCircuit, Loader2, AlertCircle, Sparkles, Lightbulb, User, MessageCircle, BarChart3, Medal, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { MatchDetails } from "@/lib/mock-data/match-details";
import { analyzeMatchReport, type AnalyzeMatchReportOutput } from "@/ai/flows/analyze-match-report-flow";

interface AiAnalysisTabProps {
    match: MatchDetails;
}

export function AiAnalysisTab({ match }: AiAnalysisTabProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeMatchReportOutput | null>(null);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        
        try {
            const analysisResult = await analyzeMatchReport({
                team1Name: match.team1.name,
                team2Name: match.team2.name,
                score: match.score,
                tournament: match.tournament,
                events: match.events,
                lineupTeam1: match.lineups.team1,
                lineupTeam2: match.lineups.team2,
            });
            setResult(analysisResult);
        } catch (e) {
            console.error("AI Analysis failed:", e);
            setError("Не удалось сгенерировать анализ. Пожалуйста, попробуйте еще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Анализ матча от AI</CardTitle>
                <CardDescription>
                    Искусственный интеллект разбирает игру, чтобы выявить ключевые моменты, лучших игроков и дать советы командам.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {!result && !isLoading && (
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-semibold mb-2">Готовы к глубокому разбору?</p>
                        <p className="text-sm text-muted-foreground mb-4">Нажмите кнопку, чтобы AI проанализировал ход матча.</p>
                        <Button onClick={handleAnalyze}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Сгенерировать анализ
                        </Button>
                    </div>
                )}
                
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {result && (
                    <div className="space-y-6">
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Краткая сводка матча</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{result.summary}</p>
                            </CardContent>
                        </Card>
                        
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Medal className="h-5 w-5 text-amber-500" /> MVP Матча</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                     <p className="font-bold text-lg">{result.mvp.name}</p>
                                     <p className="text-sm text-muted-foreground">{result.mvp.reason}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                 <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-green-500" /> Ключевой момент</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <p className="text-sm text-muted-foreground">{result.keyMoment}</p>
                                </CardContent>
                            </Card>
                             <Card>
                                 <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-blue-500" /> Советы командам</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                     <div>
                                        <p className="font-semibold text-sm">{match.team1.name}:</p>
                                        <p className="text-xs text-muted-foreground">{result.team1Advice}</p>
                                     </div>
                                     <div>
                                        <p className="font-semibold text-sm">{match.team2.name}:</p>
                                        <p className="text-xs text-muted-foreground">{result.team2Advice}</p>
                                     </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="text-center">
                            <Button variant="outline" onClick={handleAnalyze}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Сгенерировать заново
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
