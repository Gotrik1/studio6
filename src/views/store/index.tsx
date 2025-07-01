
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { storeItems as initialStoreItems, type StoreItem } from '@/shared/lib/mock-data/store';
import { Coins, ShoppingCart, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/shared/hooks/use-toast';
import { findEquipment, type FindEquipmentOutput } from '@/shared/api/genkit/flows/find-equipment-flow';
import { Textarea } from '@/shared/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';

function StoreItemCard({ item, onPurchase }: { item: StoreItem; onPurchase: (item: StoreItem) => void }) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="p-0 relative h-40">
                <Image src={item.image} alt={item.name} fill className="object-cover rounded-t-lg" data-ai-hint={item.imageHint} />
            </CardHeader>
            <CardContent className="p-6 flex-1">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription className="mt-2">{item.description}</CardDescription>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={() => onPurchase(item)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {item.isRealMoney ? `Купить за $${item.price}` : (
                        <>
                            Купить за {item.price}
                            <Coins className="ml-1.5 h-4 w-4 text-amber-300" />
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}


export function StorePage() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('Легкая игровая мышь для шутеров');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FindEquipmentOutput | null>(null);

    const handleSearch = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите, какой товар вы ищете.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const searchResult = await findEquipment(prompt);
            setResult(searchResult);
            if (searchResult.recommendations.length === 0) {
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
    
    const handlePurchase = (item: StoreItem) => {
        toast({
            title: 'Покупка совершена!',
            description: `Вы успешно приобрели "${item.name}".`,
        });
    };
    
    const itemsToDisplay = result ? result.recommendations : initialStoreItems;

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Магазин</h1>
                <p className="text-muted-foreground">
                    Приобретайте подписки, бустеры и предметы кастомизации.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Умный поиск товаров</CardTitle>
                    <CardDescription>Опишите что вы ищете, и наш AI-ассистент подберет лучшие варианты.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Textarea
                        placeholder="Например, 'футбольные бутсы для искусственного газона' или 'хочу недорогую, но качественную клавиатуру'"
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
                        {isLoading ? 'Идет поиск...' : 'Найти товары'}
                    </Button>
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[380px] w-full" />
                ))}

                {!isLoading && itemsToDisplay.map(item => (
                    <StoreItemCard key={item.id} item={item} onPurchase={handlePurchase} />
                ))}
            </div>
            {!isLoading && itemsToDisplay.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>Товары не найдены. Попробуйте изменить фильтры или сбросить поиск.</p>
                </div>
            )}
        </div>
    );
}
