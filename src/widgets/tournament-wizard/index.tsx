'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Loader2, Sparkles, Upload, Wand2, Trophy, Calendar, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/shared/hooks/use-toast';
import { Textarea } from '@/shared/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { generateTournamentWizard, type GenerateTournamentWizardOutput } from '@/shared/api/genkit/flows/generate-tournament-wizard-flow';
import { Skeleton } from '@/shared/ui/skeleton';
import { Separator } from '@/shared/ui/separator';

export function TournamentWizard() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('Еженедельный турнир по Valorant для новичков.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GenerateTournamentWizardOutput | null>(null);
    
    const [isCreating, setIsCreating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Пожалуйста, опишите вашу идею для турнира.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const concept = await generateTournamentWizard({ prompt });
            setResult(concept);
        } catch (e) {
            console.error(e);
            setError('Не удалось сгенерировать концепцию турнира. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTournament = () => {
        if (!result) return;
        
        setIsCreating(true);

        setTimeout(() => {
            toast({
                title: 'Турнир создан!',
                description: `Турнир "${result.name}" успешно создан и опубликован.`,
            });
            setIsCreating(false);
        }, 1000);
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
                <p className="text-muted-foreground">Опишите идею, и ИИ создаст название, описание, баннер и структуру для вашего турнира.</p>
            </div>

            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Шаг 1: Идея</CardTitle>
                    <CardDescription>Опишите ваш турнир в одном предложении.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Например, 'Большой летний турнир по CS:GO 2 для команд из Москвы'"
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
                        {isLoading ? 'Продумываем детали...' : 'Сгенерировать турнир'}
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
                        <CardDescription>Отредактируйте сгенерированные данные и опубликуйте турнир.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                             <Label>Баннер</Label>
                             <Image src={result.imageDataUri} alt="Сгенерированный баннер" width={1200} height={675} className="rounded-lg border aspect-video object-cover" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tourney-name">Название</Label>
                            <Input id="tourney-name" value={result.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="tourney-desc">Описание</Label>
                            <Textarea id="tourney-desc" value={result.description} onChange={(e) => handleFieldChange('description', e.target.value)} />
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="tourney-prize"><DollarSign className="inline h-4 w-4 mr-1"/>Призовой фонд</Label>
                                <Textarea id="tourney-prize" value={result.prizePool} onChange={(e) => handleFieldChange('prizePool', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="tourney-schedule"><Calendar className="inline h-4 w-4 mr-1"/>Расписание</Label>
                                <Textarea id="tourney-schedule" value={result.schedule} onChange={(e) => handleFieldChange('schedule', e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" onClick={handleCreateTournament} disabled={isCreating}>
                            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trophy className="mr-2 h-4 w-4" />}
                            {isCreating ? 'Публикация...' : 'Опубликовать турнир'}
                        </Button>
                    </CardFooter>
                </Card>
            )}

        </div>
    );
}
