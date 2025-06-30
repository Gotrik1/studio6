'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Textarea } from '@/shared/ui/textarea';
import { analyzeMatchChallenge, type AnalyzeMatchChallengeOutput } from '@/shared/api/genkit/flows/analyze-match-challenge-flow';
import { Loader2, Sparkles, Send, MapPin } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import { Badge } from '@/shared/ui/badge';

type SuggestionTeam = AnalyzeMatchChallengeOutput['suggestedTeams'][0];
type SuggestionVenue = AnalyzeMatchChallengeOutput['suggestedVenues'][0];

type SuggestionCardProps = {
    item: SuggestionTeam | SuggestionVenue;
    type: 'team' | 'venue';
};

function SuggestionCard({ item, type }: SuggestionCardProps) {
    const { toast } = useToast();

    const handleActionClick = () => {
        const actionText = type === 'team' ? 'Вызов отправлен' : 'Площадка забронирована';
        const descriptionText = type === 'team'
            ? `Команда "${item.name}" получила ваш вызов на матч.`
            : `Площадка "${item.name}" забронирована на выбранное вами время.`;
        
        toast({
            title: actionText,
            description: descriptionText,
        });
    };

    if (type === 'team') {
        const team = item as SuggestionTeam;
        return (
             <Card className="flex flex-col">
                <CardHeader className="flex-row items-center gap-4">
                     <Image src={team.logo} alt={team.name} width={48} height={48} className="rounded-full border" data-ai-hint={team.dataAiHint} />
                    <div>
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <CardDescription className="text-xs italic">&quot;{team.motto}&quot;</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex justify-between text-sm">
                    <Badge variant="secondary">Ранг: #{team.rank}</Badge>
                </CardContent>
                <CardContent className="p-4 pt-0">
                    <Button className="w-full" onClick={handleActionClick}>
                        <Send className="mr-2 h-4 w-4" />
                        Бросить вызов
                    </Button>
                </CardContent>
            </Card>
        );
    }
    
    if (type === 'venue') {
        const venue = item as SuggestionVenue;
        return (
             <Card className="flex flex-col">
                <div className="relative h-32">
                    <Image src={venue.image} alt={venue.name} fill className="object-cover rounded-t-lg" data-ai-hint={venue.imageHint} />
                </div>
                <CardHeader>
                    <CardTitle className="text-lg">{venue.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 pt-1 text-xs"><MapPin className="h-3 w-3" />{venue.address}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex justify-between text-sm">
                    <Badge variant="outline">{venue.surfaceType}</Badge>
                    <Badge variant="secondary">{venue.price}</Badge>
                </CardContent>
                 <CardContent className="p-4 pt-0">
                    <Button className="w-full" onClick={handleActionClick}>
                        Забронировать
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return null;
}

export function AiMatchWizard() {
    const [prompt, setPrompt] = useState('Хочу сыграть в футбол в субботу вечером против равной по силе команды.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeMatchChallengeOutput | null>(null);

    const handleAnalyze = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите, какой матч вы хотите организовать.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const analysisResult = await analyzeMatchChallenge(prompt);
            setResult(analysisResult);
        } catch (e) {
            console.error(e);
            setError('Не удалось выполнить анализ. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderSkeleton = () => (
         <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
                </div>
            </div>
             <div>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 mt-4">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Ваш запрос</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Textarea
                        id="challenge-prompt"
                        placeholder="Например: 'Ищем команду по баскетболу для игры на выходных в центре. Уровень средний.'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[100px] text-base"
                    />
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        {isLoading ? 'Подбираем варианты...' : 'Найти соперников и место'}
                    </Button>
                </CardContent>
            </Card>
            
            <div className="mt-8">
                {isLoading && renderSkeleton()}

                {result && (
                    <div className="space-y-8 animate-in fade-in-50">
                        {result.suggestedTeams.length > 0 && (
                            <div>
                                <h2 className="font-headline text-2xl font-bold mb-4">Предложенные соперники</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {result.suggestedTeams.map((team, i) => <SuggestionCard key={`team-${i}`} item={team} type="team" />)}
                                </div>
                            </div>
                        )}
                        
                        {result.suggestedVenues.length > 0 && (
                            <div>
                                <h2 className="font-headline text-2xl font-bold mb-4">Рекомендованные площадки</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {result.suggestedVenues.map((venue, i) => <SuggestionCard key={`venue-${i}`} item={venue} type="venue" />)}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
