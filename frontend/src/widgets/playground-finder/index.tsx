

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { findVenues } from '@/shared/api/genkit/flows/find-venues-flow';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import { PlaygroundCard } from '@/widgets/playground-card';
import type { Playground } from '@/entities/playground/model/types';

export function PlaygroundFinder() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('Хочу найти тихое футбольное поле с хорошим освещением на вечер');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [suggestedPlaygrounds, setSuggestedPlaygrounds] = useState<Playground[] | null>(null);

    const livePlaygrounds = new Set(['playground-2']); // This can remain mock for now

    const handleSearch = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите, какую площадку вы ищете.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAiSummary(null);
        setSuggestedPlaygrounds(null);

        try {
            const searchResult = await findVenues({ query: prompt });
            setAiSummary(searchResult.summary);
            if (searchResult.suggestedVenues.length > 0) {
                 setSuggestedPlaygrounds(searchResult.suggestedVenues);
            } else {
                 setSuggestedPlaygrounds([]);
                 toast({
                    title: "Ничего не найдено",
                    description: "Попробуйте изменить ваш запрос.",
                });
            }
        } catch (e) {
            console.error(e);
            setError('Не удалось выполнить поиск. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderSkeleton = () => (
         <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit/> AI-Поиск площадок</CardTitle>
                    <CardDescription>Опишите своими словами, какое место для игры вы ищете, и наш AI подберет лучшие варианты.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Например, 'бесплатная баскетбольная площадка с резиновым покрытием в центре...'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[80px]"
                    />
                     {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {isLoading ? 'Идет поиск...' : 'Найти площадки'}
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-8 space-y-4">
                {isLoading && renderSkeleton()}
                
                {aiSummary && (
                     <Alert>
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle>Ответ AI-скаута</AlertTitle>
                        <AlertDescription>{aiSummary}</AlertDescription>
                    </Alert>
                )}
                
                {suggestedPlaygrounds && suggestedPlaygrounds.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50">
                        {suggestedPlaygrounds.map(playground => {
                            const kingTeam = playground.kingOfTheCourt;
                            const isLive = livePlaygrounds.has(playground.id);
                            return (
                                 <PlaygroundCard 
                                    key={playground.id} 
                                    playground={playground}
                                    kingTeam={kingTeam}
                                    isLive={isLive}
                                />
                            )
                        })}
                    </div>
                )}

                 {!isLoading && suggestedPlaygrounds && suggestedPlaygrounds.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                        <p>Подходящих площадок не найдено. Попробуйте уточнить ваш запрос.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
