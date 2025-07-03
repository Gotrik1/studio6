
'use client';

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { BrainCircuit, Loader2, AlertCircle, Sparkles, Lightbulb, BarChart3, Medal, Trophy, Mic, Share2, Copy, Download, Volume2 } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import type { MatchDetails } from "@/entities/match/model/types";
import { analyzeMatchReport, type AnalyzeMatchReportOutput } from '@/shared/api/genkit/flows/analyze-match-report-flow';
import { generateMatchInterview, type GenerateMatchInterviewOutput } from '@/shared/api/genkit/flows/generate-match-interview-flow';
import { generateMatchPost, type GenerateMatchPostOutput } from "@/shared/api/genkit/flows/generate-match-post-flow";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { useToast } from '@/shared/hooks/use-toast';
import { generateMatchCommentary, type GenerateMatchCommentaryOutput } from "@/shared/api/genkit/flows/generate-match-commentary-flow";


interface AiAnalysisTabProps {
    match: MatchDetails;
}

export function AiAnalysisTab({ match }: AiAnalysisTabProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeMatchReportOutput | null>(null);

    const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
    const [interviewError, setInterviewError] = useState<string | null>(null);
    const [interviewResult, setInterviewResult] = useState<GenerateMatchInterviewOutput | null>(null);

    const [isGeneratingPost, setIsGeneratingPost] = useState(false);
    const [postError, setPostError] = useState<string | null>(null);
    const [postResult, setPostResult] = useState<GenerateMatchPostOutput | null>(null);

    const [isGeneratingCommentary, setIsGeneratingCommentary] = useState(false);
    const [commentaryError, setCommentaryError] = useState<string | null>(null);
    const [commentaryResult, setCommentaryResult] = useState<(GenerateMatchCommentaryOutput & { audioDataUri: string }) | null>(null);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setInterviewResult(null);
        setInterviewError(null);
        setPostResult(null);
        setPostError(null);
        setCommentaryResult(null);
        setCommentaryError(null);
        
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
    
    const handleGenerateInterview = async () => {
        if (!result) return;
        
        setIsGeneratingInterview(true);
        setInterviewError(null);
        setInterviewResult(null);

        try {
            const interviewData = await generateMatchInterview({
                matchSummary: result.summary,
                mvpName: result.mvp.name,
            });
            setInterviewResult(interviewData);
        } catch (e) {
            console.error("AI Interview generation failed:", e);
            setInterviewError("Не удалось сгенерировать аудио-интервью.");
        } finally {
            setIsGeneratingInterview(false);
        }
    };

    const handleGeneratePost = async () => {
        if (!result) return;
        setIsGeneratingPost(true);
        setPostError(null);
        setPostResult(null);
    
        try {
            const scoreParts = match.score.split('-').map(s => parseInt(s, 10));
            const winningTeam = scoreParts[0] > scoreParts[1] ? match.team1.name : match.team2.name;
            const losingTeam = scoreParts[0] > scoreParts[1] ? match.team2.name : match.team1.name;

            const postData = await generateMatchPost({
                winningTeam,
                losingTeam,
                score: match.score,
                matchSummary: result.summary
            });
            setPostResult(postData);
        } catch (e) {
            console.error("AI Post generation failed:", e);
            setPostError("Не удалось сгенерировать пост.");
        } finally {
            setIsGeneratingPost(false);
        }
    };

     const handleGenerateCommentary = async () => {
        if (!result) return;
        setIsGeneratingCommentary(true);
        setCommentaryError(null);
        setCommentaryResult(null);

        const mockEvents = [
            {time: '10:00', event: 'Гол', player: 'Иванов', team: 'Дворовые Атлеты'},
            {time: '25:00', event: 'Гол', player: 'Петров', team: 'Вымпел'},
        ];

        try {
            const commentaryData = await generateMatchCommentary({
                team1Name: match.team1.name,
                team2Name: match.team2.name,
                events: mockEvents,
            });
            setCommentaryResult(commentaryData);
        } catch (e) {
            console.error("AI Commentary generation failed:", e);
            setCommentaryError("Не удалось сгенерировать комментарий.");
        } finally {
            setIsGeneratingCommentary(false);
        }
    };

    const handleCopyText = (text: string) => {
        if (text) {
          navigator.clipboard.writeText(text);
          toast({
            title: "Текст скопирован!",
          });
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
                        
                        <Card className="bg-background">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Volume2 className="h-5 w-5 text-red-500" /> AI Комментатор</CardTitle>
                                <CardDescription>Прослушайте яркий комментарий ключевых моментов матча, созданный AI.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!commentaryResult && (
                                    <Button onClick={handleGenerateCommentary} disabled={isGeneratingCommentary || !result}>
                                        {isGeneratingCommentary ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                        {result ? 'Сгенерировать комментарий' : 'Сначала сгенерируйте анализ'}
                                    </Button>
                                )}
                                {isGeneratingCommentary && <Skeleton className="h-20 w-full" />}
                                {commentaryError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{commentaryError}</AlertDescription></Alert>}
                                {commentaryResult && (
                                    <div className="space-y-4">
                                        <audio controls src={commentaryResult.audioDataUri} className="w-full" />
                                        <div>
                                            <Label htmlFor="commentary-script">Скрипт:</Label>
                                            <Textarea id="commentary-script" readOnly value={commentaryResult.commentaryScript} className="mt-2 h-40 bg-muted"/>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-background">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Mic className="h-5 w-5 text-purple-500" /> Аудио-интервью с MVP</CardTitle>
                                <CardDescription>Создайте короткое аудио-интервью с лучшим игроком матча.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!interviewResult && (
                                    <Button onClick={handleGenerateInterview} disabled={isGeneratingInterview}>
                                        {isGeneratingInterview ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                        Сгенерировать интервью
                                    </Button>
                                )}
                                {isGeneratingInterview && <Skeleton className="h-20 w-full" />}
                                {interviewError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{interviewError}</AlertDescription></Alert>}
                                {interviewResult && (
                                    <div className="space-y-4">
                                        <audio controls src={interviewResult.audioDataUri} className="w-full" />
                                        <div>
                                            <Label htmlFor="interview-script">Скрипт:</Label>
                                            <Textarea id="interview-script" readOnly value={interviewResult.script} className="mt-2 h-40 bg-muted"/>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-background">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5 text-green-500" /> SMM-Ассистент</CardTitle>
                                <CardDescription>Создайте пост для социальных сетей о победе в этом матче.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!postResult && (
                                    <Button onClick={handleGeneratePost} disabled={isGeneratingPost || !result}>
                                        {isGeneratingPost ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                        {result ? 'Создать пост' : 'Сначала сгенерируйте анализ'}
                                    </Button>
                                )}
                                {isGeneratingPost && <div className="space-y-2"><Skeleton className="h-24 w-full" /><Skeleton className="h-10 w-1/3" /></div>}
                                {postError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{postError}</AlertDescription></Alert>}
                                {postResult && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="post-text">Текст поста</Label>
                                                <Textarea id="post-text" value={result.socialMediaPost} readOnly className="h-48"/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Изображение</Label>
                                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                                    <Image src={postResult.imageDataUri} alt="Сгенерированное изображение для поста" fill className="object-cover"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleCopyText(result.socialMediaPost)}><Copy className="mr-2 h-4 w-4"/> Копировать текст</Button>
                                            <Button variant="outline" asChild>
                                                <a href={postResult.imageDataUri} download="match_post_image.png">
                                                    <Download className="mr-2 h-4 w-4"/> Скачать изображение
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
