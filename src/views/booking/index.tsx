
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { findVenues, type FindVenuesOutput } from '@/shared/api/genkit/flows/find-venues-flow';
import { Loader2, Sparkles, MapPin, DollarSign, Star, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import Image from 'next/image';
import { Badge } from '@/shared/ui/badge';

export function BookingPage() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('Хочу найти футбольное поле с хорошим освещением на вечер.');
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

    const handleBook = (venueName: string) => {
        toast({
            title: 'Забронировано!',
            description: `Площадка "${venueName}" успешно забронирована на выбранное вами время.`,
        });
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2 text-center">
                <Search className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">AI-поиск площадок</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Просто опишите, что вы ищете, и наш AI-ассистент подберет лучшие варианты.
                </p>
            </div>
            
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Ваш запрос</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Например: 'Бесплатная баскетбольная площадка с хорошим покрытием в центре города'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[100px] text-base"
                    />
                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                     <Button onClick={handleSearch} disabled={isLoading} size="lg" className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        {isLoading ? 'Идет поиск...' : 'Найти площадки'}
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-8">
                {isLoading && (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
                    </div>
                )}
                
                {result?.suggestedVenues && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50">
                        {result.suggestedVenues.map((venue) => (
                            <Card key={venue.id} className="flex flex-col">
                                <div className="relative h-48 w-full">
                                    <Image src={venue.image} alt={venue.name} fill className="object-cover rounded-t-lg" data-ai-hint={venue.imageHint} />
                                </div>
                                <CardHeader>
                                    <CardTitle>{venue.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-1.5 pt-1">
                                        <MapPin className="h-4 w-4" /> {venue.address}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-2">
                                     <div className="flex flex-wrap gap-2">
                                        {venue.features.map(feature => <Badge key={feature} variant="outline">{feature}</Badge>)}
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-2">
                                        <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" />{venue.price}</span>
                                        <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-400" />{venue.rating}/5.0</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" onClick={() => handleBook(venue.name)}>
                                        Забронировать
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
