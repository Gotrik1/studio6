'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Loader2, Sparkles, Trophy, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { generateTournamentWizard, type GenerateTournamentWizardOutput } from '@/ai/flows/generate-tournament-wizard-flow';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewTournamentWizardPage() {
    const { toast } = useToast();

    // State
    const [prompt, setPrompt] = useState('Еженедельный турнир по Valorant для новичков');
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
        // In a real app, this would redirect to the new tournament page
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <Wand2 className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">AI-Мастер Создания Турниров</h1>
                <p className="text-muted-foreground">
                    Опишите идею, и наш ИИ создаст готовый анонс турнира с названием, описанием, обложкой и призами.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Идея турнира</CardTitle>
                    <CardDescription>Введите всего одну фразу, чтобы начать магию.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Input
                        id="tour-prompt"
                        placeholder="Например, 'Благотворительный турнир по футболу 2x2'"
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
                            <Image src={result.imageDataUri} alt="Обложка турнира" fill className="object-cover" />
                        </div>
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl">{result.name}</CardTitle>
                            <CardDescription>{result.description}</CardDescription>
                        </CardHeader>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Призовой фонд</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{result.prizePool}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Примерное расписание</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{result.schedule}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Публикация</CardTitle>
                            <CardDescription>Довольны результатом? Вы можете опубликовать турнир или сгенерировать новый вариант.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                             <Button size="lg" onClick={handlePublish}>
                                <Trophy className="mr-2 h-4 w-4" />
                                Опубликовать турнир
                            </Button>
                             <Button size="lg" variant="outline" onClick={handleGenerate} disabled={isLoading}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Сгенерировать заново
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
                <Skeleton className="h-4 w-full mt-2 rounded-md" />
                <Skeleton className="h-4 w-2/3 mt-1 rounded-md" />
            </CardHeader>
        </Card>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2 rounded-md" /></CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-4/5 rounded-md" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2 rounded-md" /></CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-4/5 rounded-md" />
                </CardContent>
            </Card>
        </div>
    </div>
);
