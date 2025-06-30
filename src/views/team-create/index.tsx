
'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Loader2, Sparkles, Upload, Wand2, Users } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/shared/hooks/use-toast';
import { useTeams } from '@/app/providers/team-provider';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/shared/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { generateTeamConcept, type GenerateTeamConceptOutput } from '@/shared/api/genkit/flows/generate-team-concept-flow';
import { Skeleton } from '@/shared/ui/skeleton';

export function NewTeamPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { addTeam } = useTeams();

    const [prompt, setPrompt] = useState('Агрессивная команда по CS:GO 2 из Москвы, наш символ - волк.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GenerateTeamConceptOutput | null>(null);
    
    const [isCreating, setIsCreating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Пожалуйста, опишите вашу команду.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const concept = await generateTeamConcept({ prompt });
            setResult(concept);
        } catch (e) {
            console.error(e);
            setError('Не удалось сгенерировать концепцию команды. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTeam = () => {
        if (!result) return;
        
        setIsCreating(true);

        // Simulate API call
        setTimeout(() => {
            addTeam({
                name: result.name,
                motto: result.motto,
                logo: result.avatarDataUri,
                dataAiHint: prompt.split(' ').slice(0, 2).join(' '),
                game: 'Valorant', // In a real app, this would be selected
            });

            toast({
                title: 'Команда создана!',
                description: `Команда "${result.name}" успешно создана.`,
            });
            setIsCreating(false);
            router.push('/teams/cyber-eagles'); // Redirect to new team's page (mocked)
        }, 1000);
    };
    
     const handleFieldChange = (field: keyof GenerateTeamConceptOutput, value: string) => {
        if (result) {
            setResult(prev => prev ? { ...prev, [field]: value } : null);
        }
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2 text-center">
                <Wand2 className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">AI-Мастер Создания Команды</h1>
                <p className="text-muted-foreground">Опишите свою команду, и ИИ создаст название, девиз, логотип и описание.</p>
            </div>

            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Шаг 1: Концепция</CardTitle>
                    <CardDescription>Опишите идею вашей команды в одном предложении.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        id="team-prompt"
                        placeholder="Например, 'Свирепая команда из Сибири, которая играет в CS:GO 2. Наш символ — полярный медведь.'"
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
                        {isLoading ? 'Создаем концепцию...' : 'Сгенерировать'}
                    </Button>
                </CardContent>
            </Card>

            {isLoading && (
                 <Card className="max-w-3xl mx-auto">
                    <CardHeader><CardTitle>Шаг 2: Результат</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4"><Skeleton className="h-20 w-20 rounded-full" /><Skeleton className="h-8 w-1/2" /></div>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
            )}

            {result && (
                <Card className="max-w-3xl mx-auto animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle>Шаг 2: Результат</CardTitle>
                        <CardDescription>Отредактируйте сгенерированные данные и создайте команду.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                             <Image src={result.avatarDataUri} alt="Сгенерированный аватар" width={80} height={80} className="rounded-full border" />
                             <Button variant="outline"><Upload className="mr-2 h-4 w-4" />Загрузить другой</Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="team-name">Название команды</Label>
                            <Input id="team-name" value={result.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="team-motto">Девиз</Label>
                             <Input id="team-motto" value={result.motto} onChange={(e) => handleFieldChange('motto', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="team-description">Описание</Label>
                            <Textarea id="team-description" value={result.description} onChange={(e) => handleFieldChange('description', e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" onClick={handleCreateTeam} disabled={isCreating}>
                            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                            {isCreating ? 'Создание...' : 'Создать команду'}
                        </Button>
                    </CardFooter>
                </Card>
            )}

        </div>
    );
}
