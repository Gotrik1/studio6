
'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { findVenues, type FindVenuesOutput } from '@/shared/api/genkit/flows/find-venues-flow';
import { Loader2, Search, MapPin, DollarSign, Star } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import Image from 'next/image';

export function BookingPage() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('футбольное поле с хорошим освещением');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FindVenuesOutput | null>(null);

    const handleSearch = async () => {
        if (!prompt) {
            setError('Пожалуйста, введите ваш запрос для поиска площадки.');
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
            description: `Площадка "${venueName}" успешно забронирована.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Поиск и бронирование площадок</h1>
                <p className="text-muted-foreground">
                    Используйте наш AI-помощник, чтобы найти идеальное место для вашей следующей игры.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Найти площадку</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Input
                        id="booking-prompt"
                        placeholder="Например: 'баскетбольная площадка в центре'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        disabled={isLoading}
                        className="text-base flex-1"
                    />
                    <Button onClick={handleSearch} disabled={isLoading} size="lg">
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                        {isLoading ? 'Идет поиск...' : 'Найти'}
                    </Button>
                </CardContent>
                 {error && (
                    <CardFooter>
                        <Alert variant="destructive" className="w-full">
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </CardFooter>
                 )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <Skeleton className="h-48 w-full" />
                        <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                        <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                    </Card>
                ))}
                
                {result?.suggestedVenues.map((venue) => (
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
                            <div className="flex justify-between items-center text-sm">
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
             {!isLoading && result && result.suggestedVenues.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                    <p>Подходящих площадок не найдено. Попробуйте уточнить ваш запрос.</p>
                </div>
            )}
        </div>
    );
}
