

'use client';

import { useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Loader2, Sparkles, PartyPopper } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/shared/hooks/use-toast';
import { Textarea } from '@/shared/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { generateTournamentWizard, type GenerateTournamentWizardOutput } from '@/shared/api/genkit/flows/generate-tournament-wizard-flow';
import { Skeleton } from '@/shared/ui/skeleton';
import { createTournament, type CreateTournamentDto } from '@/entities/tournament/api/tournaments';
import { useRouter } from 'next/navigation';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/select';

type Tournament = {
  slug: string;
};


export function AiTournamentWizard() {
    const { toast } = useToast();
    const router = useRouter();
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

    const handleCreateTournament = async () => {
        if (!result) return;
        
        setIsCreating(true);

        const tournamentData: CreateTournamentDto = {
            name: result.name,
            description: result.description,
            prizePool: result.prizePool,
            bannerImage: result.imageDataUri,
            bannerImageHint: prompt.slice(0, 50),
            registrationEndDate: new Date(result.registrationEndDate),
            tournamentStartDate: new Date(result.tournamentStartDate),
            game: result.game,
            type: result.type,
            format: result.format,
            category: 'Киберспорт', // This could also be inferred by AI in a future version
            location: 'Онлайн',
            participantCount: 16,
            registrationStartDate: new Date(),
            rules: 'Стандартные правила. Подробности будут опубликованы позже.'
        };
        
        const createResult = await createTournament(tournamentData);
        
        if (createResult.success && createResult.data && typeof createResult.data === 'object' && 'slug' in createResult.data) {
            const newTournament = createResult.data as Tournament;
            toast({
                title: 'Турнир создан!',
                description: `Турнир "${result.name}" был успешно создан и скоро появится в списке.`
            });
             router.push(`/tournaments/${newTournament.slug}`);
        } else {
             toast({
                variant: 'destructive',
                title: 'Ошибка создания турнира',
                description: (createResult as {error: string}).error || 'Не удалось создать турнир.',
            });
        }
        setIsCreating(false);
    };
    
     const handleFieldChange = (
      field: keyof Omit<GenerateTournamentWizardOutput, 'imageDataUri' | 'registrationEndDate' | 'tournamentStartDate'>,
      value: string
    ) => {
        if (result) {
            setResult((prev: GenerateTournamentWizardOutput | null) => prev ? { ...prev, [field]: value } : null);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Шаг 1: Идея</CardTitle>
                    <CardDescription>Опишите ваш турнир в одном предложении. ИИ сгенерирует название, описание, баннер, расписание и призовой фонд.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Например, 'Чемпионат Москвы по дворовому футболу 5x5'"
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
                        {isLoading ? 'Генерируем магию...' : 'Сгенерировать турнир'}
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
                        <div className="grid grid-cols-2 gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
                    </CardContent>
                </Card>
            )}

            {result && (
                <Card className="max-w-3xl mx-auto animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle>Шаг 2: Результат</CardTitle>
                        <CardDescription>Отредактируйте сгенерированные данные и запустите турнир.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                             <Label>Баннер</Label>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="promo-game">Игра/Спорт</Label>
                                <Input id="promo-game" value={result.game} onChange={(e) => handleFieldChange('game', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="promo-type">Тип</Label>
                                <Select value={result.type} onValueChange={(v) => handleFieldChange('type', v)}>
                                    <SelectTrigger id="promo-type"><SelectValue/></SelectTrigger>
                                    <SelectContent><SelectItem value="team">Командный</SelectItem><SelectItem value="individual">Индивидуальный</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="promo-format">Формат</Label>
                                <Select value={result.format} onValueChange={(v) => handleFieldChange('format', v)}>
                                    <SelectTrigger id="promo-format"><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single_elimination">Single Elimination</SelectItem>
                                        <SelectItem value="round_robin">Round Robin</SelectItem>
                                        <SelectItem value="groups">Групповой этап + Плей-офф</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="promo-prize">Призовой фонд</Label>
                            <Textarea id="promo-prize" value={result.prizePool} onChange={(e) => handleFieldChange('prizePool', e.target.value)} className="h-24" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Конец регистрации (AI)</Label>
                                <Input value={result.registrationEndDate} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label>Начало турнира (AI)</Label>
                                <Input value={result.tournamentStartDate} disabled />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" onClick={handleCreateTournament} disabled={isCreating}>
                            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trophy className="mr-2 h-4 w-4" />}
                            {isCreating ? 'Создание...' : 'Создать турнир'}
                        </Button>
                    </CardFooter>
                </Card>
            )}

        </div>
    );
}
