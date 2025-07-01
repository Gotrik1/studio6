'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Loader2, Sparkles, AlertCircle, Award, Share2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { generateTournamentSummary, type GenerateTournamentSummaryOutput } from '@/shared/api/genkit/flows/generate-tournament-summary-flow';
import { generatePostImage, type GeneratePostImageOutput } from '@/shared/api/genkit/flows/generate-post-image-flow';
import { Skeleton } from '@/shared/ui/skeleton';
import { Textarea } from '@/shared/ui/textarea';
import { useToast } from '@/shared/hooks/use-toast';
import Image from 'next/image';

interface CrmTournamentMediaCenterProps {
    tournament: {
        id: string;
        name: string;
        sport: string;
        status: string;
    }
}

const mockFinalMatch = {
    team1: 'Дворовые Атлеты',
    team2: 'Вымпел',
    score: '3-3 (2-1 пен)',
}
const mockChampion = 'Дворовые Атлеты';


export function CrmTournamentMediaCenter({ tournament }: CrmTournamentMediaCenterProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summaryResult, setSummaryResult] = useState<GenerateTournamentSummaryOutput | null>(null);
    const [images, setImages] = useState<GeneratePostImageOutput[]>([]);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setSummaryResult(null);
        setImages([]);

        try {
            const summaryData = await generateTournamentSummary({
                tournamentName: tournament.name,
                tournamentGame: tournament.sport,
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

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Скопировано!' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Медиа-Центр</CardTitle>
                <CardDescription>Сгенерируйте полный медиа-кит для вашего турнира в один клик.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Button onClick={handleGenerate} disabled={isLoading || tournament.status !== 'Завершён'}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Генерация...' : 'Сгенерировать медиа-кит'}
                </Button>
                 {tournament.status !== 'Завершён' && (
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
                                <Button variant="ghost" size="sm" onClick={() => handleCopy(summaryResult.summaryArticle)} className="mt-2">Копировать</Button>
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
                                    <CardTitle className="flex items-center gap-2"><Share2 className="text-blue-500" /> Пост для соцсетей</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea readOnly value={summaryResult.socialMediaPost} className="h-24" />
                                     <Button variant="ghost" size="sm" onClick={() => handleCopy(summaryResult.socialMediaPost)} className="mt-2">Копировать</Button>
                                </CardContent>
                            </Card>
                        </div>
                         <Card>
                            <CardHeader>
                                <CardTitle>Сгенерированные изображения</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative aspect-square">
                                            <Image src={img.imageDataUri} alt={`Сгенерированное изображение ${index + 1}`} fill className="object-cover rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
