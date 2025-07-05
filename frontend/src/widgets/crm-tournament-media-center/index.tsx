
'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { BrainCircuit, Loader2, AlertCircle, Sparkles, Award, Share2, Copy, Download, Volume2, Mic, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { generateTournamentSummary, type GenerateTournamentSummaryOutput } from '@/shared/api/genkit/flows/generate-tournament-summary-flow';
import { generatePostImage, type GeneratePostImageOutput } from '@/shared/api/genkit/flows/generate-post-image-flow';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { useToast } from '@/shared/hooks/use-toast';
import NextImage from 'next/image';
import { generateMatchCommentary, type GenerateMatchCommentaryOutput } from "@/shared/api/genkit/flows/generate-match-commentary-flow";
import { generateMatchInterview, type GenerateMatchInterviewOutput } from '@/shared/api/genkit/flows/generate-match-interview-flow';
import { generateMatchPost, type GenerateMatchPostOutput } from "@/shared/api/genkit/flows/generate-match-post-flow";
import { useRouter } from 'next/navigation';
import { createTournamentMedia } from '@/entities/tournament/api/media';
import type { TournamentDetails } from '@/entities/tournament/model/types';


interface CrmTournamentMediaCenterProps {
    tournament: TournamentDetails;
}

const mockFinalMatch = {
    team1: 'Дворовые Атлеты',
    team2: 'Вымпел',
    score: '3-3 (2-1 пен)',
}
const mockChampion = 'Дворовые Атлеты';


export function CrmTournamentMediaCenter({ tournament }: CrmTournamentMediaCenterProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summaryResult, setSummaryResult] = useState<GenerateTournamentSummaryOutput | null>(null);
    const [images, setImages] = useState<GeneratePostImageOutput[]>([]);

    const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
    const [interviewError, setInterviewError] = useState<string | null>(null);
    const [interviewResult, setInterviewResult] = useState<GenerateMatchInterviewOutput | null>(null);

    const [isGeneratingPost, setIsGeneratingPost] = useState(false);
    const [postError, setPostError] = useState<string | null>(null);
    const [postResult, setPostResult] = useState<GenerateMatchPostOutput | null>(null);

    const [isGeneratingCommentary, setIsGeneratingCommentary] = useState(false);
    const [commentaryError, setCommentaryError] = useState<string | null>(null);
    const [commentaryResult, setCommentaryResult] = useState<(GenerateMatchCommentaryOutput & { audioDataUri: string }) | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setSummaryResult(null);
        setImages([]);
        
        try {
            const summaryData = await generateTournamentSummary({
                tournamentName: tournament.name,
                tournamentGame: tournament.game,
                champion: mockChampion,
                finalMatch: mockFinalMatch,
            });
            setSummaryResult(summaryData);
            
            // Generate images based on prompts
            const imagePromises = summaryData.imagePrompts.map(prompt => generatePostImage(prompt));
            const imageResults = await Promise.all(imagePromises);
            setImages(imageResults);

        } catch (e) {
            console.error(e);
            setError("Не удалось сгенерировать медиа-кит. Попробуйте еще раз.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateInterview = async () => {
        if (!summaryResult) return;
        
        setIsGeneratingInterview(true);
        setInterviewError(null);
        setInterviewResult(null);

        try {
            const interviewData = await generateMatchInterview({
                matchSummary: summaryResult.summaryArticle,
                mvpName: summaryResult.mvp.name,
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
        if (!summaryResult) return;
        setIsGeneratingPost(true);
        setPostError(null);
        setPostResult(null);
    
        try {
            const scoreParts = mockFinalMatch.score.split('-').map(s => parseInt(s, 10));
            const winningTeam = scoreParts[0] > scoreParts[1] ? mockFinalMatch.team1 : mockFinalMatch.team2;
            const losingTeam = scoreParts[0] > scoreParts[1] ? mockFinalMatch.team2 : mockFinalMatch.team1;

            const postData = await generateMatchPost({
                winningTeam,
                losingTeam,
                score: mockFinalMatch.score,
                matchSummary: result.summaryArticle,
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
        if (!summaryResult) return;
        setIsGeneratingCommentary(true);
        setCommentaryError(null);
        setCommentaryResult(null);

        const mockEvents = [
            {time: '10:00', event: 'Гол', player: 'Иванов', team: 'Дворовые Атлеты'},
            {time: '25:00', event: 'Гол', player: 'Петров', team: 'Вымпел'},
        ];

        try {
            const commentaryData = await generateMatchCommentary({
                team1Name: mockFinalMatch.team1,
                team2Name: mockFinalMatch.team2,
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

    const handleSaveMedia = async (data: { type: 'IMAGE' | 'VIDEO' | 'AUDIO', src: string, description: string, hint: string }) => {
        const result = await createTournamentMedia(tournament.id, data);
        if (result.success) {
            toast({ title: "Медиа сохранено!", description: "Файл добавлен в галерею турнира." });
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: "Ошибка", description: "Не удалось сохранить медиа." });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Медиа-Центр</CardTitle>
                <CardDescription>Сгенерируйте полный медиа-кит для вашего турнира в один клик.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Button onClick={handleGenerate} disabled={isLoading || tournament.status !== 'FINISHED'}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Генерация...' : 'Сгенерировать медиа-кит'}
                </Button>
                 {tournament.status !== 'FINISHED' && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Функция недоступна</AlertTitle>
                        <AlertDescription>Медиа-кит можно сгенерировать только для завершенных турниров.</AlertDescription>
                    </Alert>
                )}
                 {error && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                 
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Skeleton className="aspect-square w-full" />
                            <Skeleton className="aspect-square w-full" />
                            <Skeleton className="aspect-square w-full" />
                            <Skeleton className="aspect-square w-full" />
                        </div>
                    </div>
                )}
                
                {summaryResult && (
                    <div className="space-y-6 animate-in fade-in-50">
                        <Card>
                            <CardHeader><CardTitle>Итоговая статья</CardTitle></CardHeader>
                            <CardContent>
                                <Textarea readOnly value={summaryResult.summaryArticle} className="h-48" />
                                <Button variant="ghost" size="sm" onClick={() => handleCopyText(summaryResult.summaryArticle)} className="mt-2"><Copy className="mr-2 h-4 w-4"/>Копировать</Button>
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Award className="text-amber-500" /> MVP Турнира</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg font-bold">{summaryResult.mvp.name}</p>
                                    <p className="text-sm text-muted-foreground">{summaryResult.mvp.reason}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Интерактивные медиа</CardTitle>
                                    <CardDescription>Озвучка, интервью и SMM.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                     <Button variant="outline" className="w-full justify-start" onClick={handleGenerateCommentary} disabled={isGeneratingCommentary}><Volume2 className="mr-2 h-4 w-4"/> {isGeneratingCommentary ? 'Генерация...' : 'Комментарий матча'}</Button>
                                     <Button variant="outline" className="w-full justify-start" onClick={handleGenerateInterview} disabled={isGeneratingInterview}><Mic className="mr-2 h-4 w-4"/> {isGeneratingInterview ? 'Генерация...' : 'Интервью с MVP'}</Button>
                                     <Button variant="outline" className="w-full justify-start" onClick={handleGeneratePost} disabled={isGeneratingPost}><Share2 className="mr-2 h-4 w-4"/> {isGeneratingPost ? 'Генерация...' : 'Пост для соцсетей'}</Button>
                                </CardContent>
                            </Card>
                        </div>
                        {commentaryError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{commentaryError}</AlertDescription></Alert>}
                        {commentaryResult && <audio controls src={commentaryResult.audioDataUri} className="w-full" />}

                        {interviewError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{interviewError}</AlertDescription></Alert>}
                        {interviewResult && <audio controls src={interviewResult.audioDataUri} className="w-full" />}

                        {postError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{postError}</AlertDescription></Alert>}
                        {postResult && (
                             <Card>
                                <CardHeader><CardTitle>SMM Пост</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="post-text">Текст поста</Label>
                                                <Textarea id="post-text" value={postResult.postText} readOnly className="h-48"/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Изображение</Label>
                                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                                    <NextImage src={postResult.imageDataUri} alt="Сгенерированное изображение для поста" fill className="object-cover"/>
                                                </div>
                                            </div>
                                        </div>
                                     <div className="flex gap-2">
                                        <Button onClick={() => handleCopyText(postResult.postText)}><Copy className="mr-2 h-4 w-4"/> Копировать текст</Button>
                                        <Button variant="outline" onClick={() => handleSaveMedia({ type: 'IMAGE', src: postResult.imageDataUri, description: postResult.postText, hint: 'match victory post' })}>
                                            <Download className="mr-2 h-4 w-4"/> Сохранить в галерею
                                        </Button>
                                    </div>
                                </CardContent>
                             </Card>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle>Сгенерированные изображения</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative aspect-square">
                                            <NextImage src={img.imageDataUri} alt={`Сгенерированное изображение ${index + 1}`} fill className="object-cover rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>

             <CardFooter>
                 <Card>
                    <CardHeader><CardTitle>Галерея турнира</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {tournament.media?.map(media => (
                               <div key={media.id} className="relative aspect-square">
                                    <NextImage src={media.src} alt={media.description || 'media'} fill className="object-cover rounded-md" />
                                </div>
                           ))}
                           {tournament.media?.length === 0 && <p className="text-sm text-muted-foreground col-span-full">В галерее пока пусто.</p>}
                        </div>
                    </CardContent>
                 </Card>
            </CardFooter>
        </Card>
    );
}
