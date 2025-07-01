'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { findEquipment, type FindEquipmentOutput } from '@/shared/api/genkit/flows/find-equipment-flow';
import { Loader2, Sparkles, BrainCircuit, ShoppingCart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';

export function AiEquipmentAdvisor() {
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
