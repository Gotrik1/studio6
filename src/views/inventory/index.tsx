
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { PlusCircle, Backpack, BrainCircuit, Sparkles, Loader2, ShoppingCart } from 'lucide-react';
import { inventory, type InventoryItem } from '@/shared/lib/mock-data/inventory';
import Image from 'next/image';
import { differenceInMonths } from 'date-fns';
import { Textarea } from '@/shared/ui/textarea';
import { findEquipment, type FindEquipmentOutput } from '@/shared/api/genkit/flows/find-equipment-flow';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import Link from 'next/link';

const getWearPercentage = (purchaseDate: string, lifespanMonths: number) => {
    const monthsUsed = differenceInMonths(new Date(), new Date(purchaseDate));
    if (monthsUsed >= lifespanMonths) return 100;
    if (monthsUsed <= 0) return 0;
    return (monthsUsed / lifespanMonths) * 100;
};

function InventoryItemCard({ item }: { item: InventoryItem }) {
    const wearPercentage = getWearPercentage(item.purchaseDate, item.lifespanMonths);
    
    return (
        <Card>
            <CardHeader className="flex-row gap-4 items-start">
                 <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-lg border aspect-square object-cover" data-ai-hint={item.imageHint} />
                 <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.type}</CardDescription>
                 </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Износ</span>
                        <span>{wearPercentage.toFixed(0)}%</span>
                    </div>
                     <Progress value={wearPercentage} />
                </div>
            </CardContent>
        </Card>
    );
}

function AiEquipmentAdvisor() {
    const [prompt, setPrompt] = useState('Мне нужна легкая игровая мышь для шутеров, до $100');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FindEquipmentOutput | null>(null);
    const { toast } = useToast();

    const handleSearch = async () => {
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
        } catch(e) {
            console.error(e);
            setError('Не удалось получить рекомендации. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BrainCircuit/> AI-Советник по инвентарю</CardTitle>
                <CardDescription>Опишите, что вы ищете, и AI подберет для вас лучшие варианты из магазина.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <Textarea 
                    placeholder="Например, 'Ищу прочные футбольные бутсы для искусственного газона...'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    className="min-h-[80px]"
                />
                 {error && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                 {isLoading && (
                    <div className="space-y-2">
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="h-28 w-full" />
                    </div>
                )}
                {result && (
                    <div className="space-y-3 animate-in fade-in-50">
                        {result.recommendations.map(item => (
                            <Card key={item.id} className="p-3 flex items-center gap-3">
                                <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md border aspect-square object-cover" data-ai-hint={item.imageHint}/>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.isRealMoney ? `$${item.price}` : `${item.price} PD`}</p>
                                </div>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/store">
                                        <ShoppingCart className="mr-2 h-4 w-4"/> В магазин
                                    </Link>
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                    Получить рекомендацию
                </Button>
            </CardFooter>
        </Card>
    );
}

export function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>(inventory);
    
    return (
         <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Backpack className="h-8 w-8 text-primary"/>
                        <h1 className="font-headline text-3xl font-bold tracking-tight">Мой инвентарь</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Отслеживайте свой спортивный и игровой инвентарь, чтобы всегда быть в лучшей форме.
                    </p>
                </div>
                <Button disabled>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить предмет (Скоро)
                </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 self-start">
                     {items.map(item => <InventoryItemCard key={item.id} item={item} />)}
                </div>
                <div className="lg:col-span-1">
                    <AiEquipmentAdvisor />
                </div>
            </div>
        </div>
    );
}
