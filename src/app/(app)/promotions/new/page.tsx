'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Wand2, Megaphone } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { generatePromotionWizard, type GeneratePromotionWizardOutput } from '@/ai/flows/generate-promotion-wizard-flow';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewPromotionWizardPage() {
    const { toast } = useToast();

    // State
    const [prompt, setPrompt] = useState('Конкурс на лучший игровой скриншот');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GeneratePromotionWizardOutput | null>(null);

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите идею акции.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const wizardResult = await generatePromotionWizard({ prompt });
            setResult(wizardResult);
            toast({ title: 'Акция сгенерирована!', description: 'Теперь вы можете отредактировать детали и опубликовать её.' });
        } catch (e) {
            console.error(e);
            setError('Не удалось сгенерировать акцию. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = () => {
        if (!result) return;
        toast({
            title: 'Акция опубликована!',
            description: `Акция "${result.name}" успешно создана и видна всем пользователям.`,
        });
        // In a real app, this would redirect to the new promotion page or the main promotions list
    };
    
    const handleFieldChange = (field: keyof GeneratePromotionWizardOutput, value: string) => {
        if (result) {
            setResult(prev => prev ? { ...prev, [field]: value } : null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <Wand2 className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">AI-Мастер Создания Акций</h1>
                <p className="text-muted-foreground">
                    Опишите идею, и наш ИИ создаст готовый анонс с названием, описанием, баннером и призами.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Идея акции</CardTitle>
                    <CardDescription>Введите всего одну фразу, чтобы начать магию.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Input
                        id="promo-prompt"
                        placeholder="Например, 'Розыгрыш игровой клавиатуры за лучший комментарий'"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="h-12 text-lg flex-1"
                    />
                    <Button onClick={handleGenerate} disabled={isLoading} size="lg">
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        {isLoading ? 'Генерация...' : 'Создать акцию'}
                    </Button>
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isLoading && <LoadingSkeleton />}
            
            {result && (
                <div className="space-y-6 animate-in fade-in-50">
                    <Card className="overflow-hidden">
                        <div className="relative h-64">
                            <Image src={result.imageDataUri} alt="Баннер акции" fill className="object-cover" />
                        </div>
                        <CardHeader>
                            <Input 
                                className="font-headline text-3xl font-bold p-0 border-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={result.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                            />
                        </CardHeader>
                        <CardContent>
                             <Textarea
                                className="text-muted-foreground p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={result.description}
                                onChange={(e) => handleFieldChange('description', e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Детали акции</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="prize">Приз</Label>
                                    <Input id="prize" value={result.prize} onChange={(e) => handleFieldChange('prize', e.target.value)} />
                                </div>
                                 <div>
                                    <Label htmlFor="cost">Стоимость участия (в PD)</Label>
                                    <Input id="cost" type="number" value={result.cost} onChange={(e) => handleFieldChange('cost', e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Публикация</CardTitle>
                                <CardDescription>Довольны результатом? Нажмите, чтобы опубликовать акцию и сделать ее видимой для всех.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button size="lg" onClick={handlePublish}>
                                    <Megaphone className="mr-2 h-4 w-4" />
                                    Опубликовать акцию
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

const LoadingSkeleton = () => (
    <div className="space-y-6">
        <Card className="overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <CardHeader>
                <Skeleton className="h-8 w-3/4 rounded-md" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full mt-2 rounded-md" />
                <Skeleton className="h-4 w-2/3 mt-1 rounded-md" />
            </CardContent>
        </Card>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2 rounded-md" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2 rounded-md" /></CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                     <Skeleton className="h-12 w-1/2 rounded-md mt-4" />
                </CardContent>
            </Card>
        </div>
    </div>
);
