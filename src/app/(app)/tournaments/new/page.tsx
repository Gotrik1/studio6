'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Wand2, Megaphone } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { generateTournamentWizard, type GenerateTournamentWizardOutput } from '@/ai/flows/generate-tournament-wizard-flow';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewTournamentWizardPage() {
    const { toast } = useToast();

    // State
    const [prompt, setPrompt] = useState('Еженедельный турнир по Valorant для любителей');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GenerateTournamentWizardOutput | null>(null);

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите идею турнира.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const wizardResult = await generateTournamentWizard({ prompt });
            setResult(wizardResult);
            toast({ title: 'Турнир сгенерирован!', description: 'Теперь вы можете отредактировать детали и опубликовать его.' });
        } catch (e) {
            console.error(e);
            setError('Не удалось сгенерировать турнир. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = () => {
        if (!result) return;
        toast({
            title: 'Турнир опубликован!',
            description: `Турнир "${result.name}" успешно создан и виден всем пользователям.`,
        });
        // In a real app, this would redirect to the new tournament page or the main tournaments list
    };
    
    const handleFieldChange = (field: keyof GenerateTournamentWizardOutput, value: string) => {
        if (result) {
            setResult(prev => prev ? { ...prev, [field]: value } : null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <Wand2 className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">AI-Мастер Создания Турниров</h1>
                <p className="text-muted-foreground">
                    Опишите идею, и наш ИИ создаст готовый турнир с названием, описанием, баннером и расписанием.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Идея турнира</CardTitle>
                    <CardDescription>Введите всего одну фразу, чтобы начать магию.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Input
                        id="tournament-prompt"
                        placeholder="Например, 'Ежемесячный турнир по CS:GO 2 для команд из Москвы'"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="h-12 text-lg flex-1"
                    />
                    <Button onClick={handleGenerate} disabled={isLoading} size="lg">
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        {isLoading ? 'Генерация...' : 'Создать турнир'}
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
                            <Image src={result.imageDataUri} alt="Баннер турнира" fill className="object-cover" />
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
                                <CardTitle>Призовой фонд</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea value={result.prizePool} onChange={(e) => handleFieldChange('prizePool', e.target.value)} className="h-32"/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Расписание</CardTitle>
                            </CardHeader>
                             <CardContent>
                                <Textarea value={result.schedule} onChange={(e) => handleFieldChange('schedule', e.target.value)} className="h-32"/>
                            </CardContent>
                        </Card>
                    </div>

                     <Card>
                        <CardHeader>
                            <CardTitle>Публикация</CardTitle>
                            <CardDescription>Довольны результатом? Нажмите, чтобы опубликовать турнир и сделать его видимым для всех.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button size="lg" onClick={handlePublish}>
                                <Megaphone className="mr-2 h-4 w-4" />
                                Опубликовать турнир
                            </Button>
                        </CardContent>
                    </Card>
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
                <CardContent><Skeleton className="h-32 w-full rounded-md" /></CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2 rounded-md" /></CardHeader>
                <CardContent><Skeleton className="h-32 w-full rounded-md" /></CardContent>
            </Card>
        </div>
    </div>
);
