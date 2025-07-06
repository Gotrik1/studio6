

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { PlusCircle, Swords, Search, Loader2, Sparkles, Dumbbell } from 'lucide-react';
import { LfgCreateDialog, type FormValues as LfgFormValues } from '@/widgets/lfg-create-dialog';
import { Textarea } from '@/shared/ui/textarea';
import { findLfgLobbies, type FindLfgLobbiesOutput } from '@/shared/api/genkit/flows/find-lfg-lobbies-flow';
import type { LfgLobby as LfgLobbyType } from '@/entities/lfg/model/types';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useLfg } from '@/shared/context/lfg-provider';
import { LfgCard } from '@/widgets/lfg-card';
import { useToast } from '@/shared/hooks/use-toast';
import type { CreateLobbyApiData } from '@/entities/lfg/api/lfg';


export function LfgPage() {
    const { toast } = useToast();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [prompt, setPrompt] = useState('Хочу поиграть в футбол вечером');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filteredLobbies, setFilteredLobbies] = useState<LfgLobbyType[] | null>(null);
    const [typeFilter, setTypeFilter] = useState<'all' | 'GAME' | 'TRAINING'>('all');
    const { lobbies, isLoading, addLobby, joinLobby } = useLfg();

    const handleSearch = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите, какую игру вы ищете.');
            return;
        }
        setIsAiLoading(true);
        setError(null);
        setFilteredLobbies(null);

        try {
            const searchResult = await findLfgLobbies(prompt);
            setFilteredLobbies(searchResult.recommendations.map(l => ({...l, type: l.type.toUpperCase() as 'GAME' | 'TRAINING', startTime: new Date(l.startTime), endTime: new Date(l.endTime) })));
            if (searchResult.recommendations.length === 0) {
                 toast({
                    title: "Ничего не найдено",
                    description: "Попробуйте изменить ваш запрос или создайте свое лобби.",
                });
            }
        } catch (e) {
            console.error(e);
            setError('Не удалось выполнить поиск. Попробуйте еще раз.');
        } finally {
            setIsAiLoading(false);
        }
    };
    
    const handleCreateLobby = async (data: LfgFormValues) => {
        const [hours, minutes] = data.time.split(':').map(Number);
        const combinedDate = new Date(data.date);
        combinedDate.setHours(hours, minutes, 0, 0);

        const payload: CreateLobbyApiData = {
            type: data.type,
            sport: data.sport,
            location: data.location,
            playgroundId: data.playgroundId,
            startTime: combinedDate,
            duration: data.duration,
            playersNeeded: data.playersNeeded,
            comment: data.comment,
        };

        const success = await addLobby(payload);
        if (success) {
            toast({ title: "Лобби создано!", description: "Ваш запрос на игру опубликован." });
            setIsCreateOpen(false);
        } else {
             toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось создать лобби.' });
        }
        return success;
    };
    
    const lobbiesToDisplay = useMemo(() => {
        const source = filteredLobbies === null ? lobbies : filteredLobbies;
        if (typeFilter === 'all') {
            return source;
        }
        return source.filter(lobby => lobby.type === typeFilter);
    }, [filteredLobbies, lobbies, typeFilter]);

    return (
        <>
            <div className="space-y-6 opacity-0 animate-fade-in-up">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Swords className="h-8 w-8 text-primary"/>
                            <h1 className="font-headline text-3xl font-bold tracking-tight">Поиск игры и тренировок</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Найдите компанию для игры или тренировки с помощью AI или создайте свое лобби.
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать лобби
                    </Button>
                </div>

                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Умный поиск</CardTitle>
                        <CardDescription>Опишите своими словами, во что, где и когда вы хотите поиграть.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Например: 'Ищу с кем поиграть в баскетбол в Парке Горького сегодня вечером...'"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isAiLoading}
                            className="min-h-[100px] text-base"
                        />
                         {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTitle>Ошибка</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSearch} disabled={isAiLoading} size="lg" className="w-full">
                            {isAiLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                            {isAiLoading ? 'Идет поиск...' : 'Найти игры'}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="flex justify-center gap-2">
                    <Button variant={typeFilter === 'all' ? 'default' : 'outline'} onClick={() => setTypeFilter('all')}>Все</Button>
                    <Button variant={typeFilter === 'GAME' ? 'default' : 'outline'} onClick={() => setTypeFilter('GAME')}>Игры</Button>
                    <Button variant={typeFilter === 'TRAINING' ? 'default' : 'outline'} onClick={() => setTypeFilter('TRAINING')}>Тренировки</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(isLoading || isAiLoading) && Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}><Skeleton className="h-80 w-full" /></Card>
                    ))}

                    {!isLoading && !isAiLoading && lobbiesToDisplay.map(lobby => (
                        <LfgCard key={lobby.id} lobby={lobby} onJoin={joinLobby} />
                    ))}
                </div>
                 {!isLoading && !isAiLoading && lobbiesToDisplay.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Активных лобби по вашему запросу не найдено.</p>
                        <p>Попробуйте изменить запрос или создайте свое лобби.</p>
                    </div>
                )}
            </div>
            <LfgCreateDialog 
                isOpen={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onCreate={handleCreateLobby}
            />
        </>
    );
}
