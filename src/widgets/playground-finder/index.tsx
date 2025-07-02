
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { findVenues, type FindVenuesOutput } from '@/shared/api/genkit/flows/find-venues-flow';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import { PlaygroundCard } from '@/widgets/playground-card';

export function PlaygroundFinder() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('Хочу найти тихое футбольное поле с хорошим освещением на вечер');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FindVenuesOutput | null>(null);

    const handleSearch = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите, какую площадку вы ищете.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const searchResult = await findVenues(prompt);
            setResult(searchResult);
            if (searchResult.suggestedVenues.length === 0) {
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

    return (
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

            {(isLoading || result) && (
                 <CardContent>
                    <div className="space-y-4 pt-4 border-t">
                        {isLoading && (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
                             </div>
                        )}
                        {result && result.suggestedVenues.length > 0 && (
                            <>
                                <h3 className="font-semibold">Рекомендации AI:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50">
                                    {result.suggestedVenues.map(playground => (
                                        <PlaygroundCard key={playground.id} playground={playground as any} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
