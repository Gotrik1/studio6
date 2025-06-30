'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Loader2, Sparkles, PartyPopper } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/shared/hooks/use-toast';
import { Textarea } from '@/shared/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { generatePromotionWizard, type GeneratePromotionWizardOutput } from '@/shared/api/genkit/flows/generate-promotion-wizard-flow';
import { Skeleton } from '@/shared/ui/skeleton';

export function AiPromotionWizard() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('Конкурс на лучший игровой момент по Valorant. Приз - игровая мышь.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GeneratePromotionWizardOutput | null>(null);
    
    const [isCreating, setIsCreating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Пожалуйста, опишите вашу идею для промо-акции.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const concept = await generatePromotionWizard({ prompt });
            setResult(concept);
        } catch (e) {
            console.error(e);
            setError('Не удалось сгенерировать концепцию. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePromotion = () => {
        if (!result) return;
        
        setIsCreating(true);

        setTimeout(() => {
            // In a real app, this would be an API call
            console.log("Creating promotion:", result);
            toast({
                title: 'Промо-акция создана!',
                description: `Акция "${result.name}" успешно запущена.`,
            });
            setIsCreating(false);
        }, 1000);
    };
    
     const handleFieldChange = (field: keyof GeneratePromotionWizardOutput, value: string) => {
        if (result) {
            setResult(prev => prev ? { ...prev, [field]: value } : null);
        }
    };

    return (
        <div className="space-y-6 mt-4">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Шаг 1: Идея</CardTitle>
                    <CardDescription>Опишите вашу промо-акцию в одном предложении. ИИ сгенерирует название, описание, баннер, приз и стоимость участия.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Например, 'Турнир 1 на 1 по CS:GO 2 с призом в виде скина на AWP'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[100px]"
                    />
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                     <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        {isLoading ? 'Генерируем магию...' : 'Сгенерировать акцию'}
                    </Button>
                </CardContent>
            </Card>

            {isLoading && (
                 <Card className="max-w-3xl mx-auto">
                    <CardHeader><CardTitle>Шаг 2: Результат</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            )}

            {result && (
                <Card className="max-w-3xl mx-auto animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle>Шаг 2: Результат</CardTitle>
                        <CardDescription>Отредактируйте сгенерированные данные и запустите акцию.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                             <Label>Изображение</Label>
                             <Image src={result.imageDataUri} alt="Сгенерированное изображение" width={1200} height={675} className="rounded-lg border aspect-video object-cover" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="promo-name">Название</Label>
                            <Input id="promo-name" value={result.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="promo-desc">Описание</Label>
                            <Textarea id="promo-desc" value={result.description} onChange={(e) => handleFieldChange('description', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="promo-prize">Приз</Label>
                                <Input id="promo-prize" value={result.prize} onChange={(e) => handleFieldChange('prize', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="promo-cost">Стоимость участия (PD)</Label>
                                <Input id="promo-cost" value={result.cost} onChange={(e) => handleFieldChange('cost', e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" onClick={handleCreatePromotion} disabled={isCreating}>
                            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PartyPopper className="mr-2 h-4 w-4" />}
                            {isCreating ? 'Запуск...' : 'Запустить промо-акцию'}
                        </Button>
                    </CardFooter>
                </Card>
            )}

        </div>
    );
}
