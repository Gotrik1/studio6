'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Check, Loader2, Sparkles, Send, Users, MapPin, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { analyzeMatchChallenge, type AnalyzeMatchChallengeOutput } from '@/ai/flows/analyze-match-challenge-flow';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";


type SuggestedTeam = AnalyzeMatchChallengeOutput['suggestedTeams'][0];
type SuggestedVenue = AnalyzeMatchChallengeOutput['suggestedVenues'][0];

export default function NewMatchChallengePage() {
    const { toast } = useToast();
    
    // State for AI generation
    const [prompt, setPrompt] = useState('Хочу сыграть в футбол 5x5 в субботу вечером против равной по силе команды в Москве');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeMatchChallengeOutput | null>(null);

    // State for user selections
    const [selectedTeam, setSelectedTeam] = useState<SuggestedTeam | null>(null);
    const [selectedVenue, setSelectedVenue] = useState<SuggestedVenue | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите, какой матч вы хотите организовать.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        setSelectedTeam(null);
        setSelectedVenue(null);

        try {
            const analysisResult = await analyzeMatchChallenge(prompt);
            setResult(analysisResult);
        } catch (e) {
            console.error(e);
            setError('Не удалось получить предложения от AI. Пожалуйста, попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSendChallenge = () => {
        if (!selectedTeam || !selectedVenue || !selectedDate) {
            toast({
                variant: 'destructive',
                title: 'Не все данные выбраны',
                description: 'Пожалуйста, выберите команду, площадку и дату для вызова.',
            });
            return;
        }
        
        toast({
            title: 'Вызов отправлен!',
            description: `Команде "${selectedTeam.name}" отправлен вызов на матч ${format(selectedDate, "PPP")}. Отслеживайте его статус во вкладке "Вызовы" на странице вашей команды.`,
        });
        
        setResult(null);
        setPrompt('');
        setSelectedTeam(null);
        setSelectedVenue(null);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <Sparkles className="mx-auto h-12 w-12 text-primary" />
                <h1 className="font-headline text-3xl font-bold tracking-tight">AI-Матчмейкер</h1>
                <p className="text-muted-foreground">
                    Опишите желаемый матч, и наш ИИ подберет вам идеальных соперников и место для игры.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Шаг 1: Опишите вашу игру</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        id="challenge-prompt"
                        placeholder="Например: 'Ищем соперника для игры в баскетбол 3x3 в эти выходные, уровень средний, желательно в центре'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[100px]"
                    />
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                        {isLoading ? 'Подбираем варианты...' : 'Найти соперников и площадки'}
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Шаг 2: Выберите соперника</CardTitle>
                            <CardDescription>AI подобрал несколько подходящих команд.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {result.suggestedTeams.map(team => (
                                <Card key={team.slug} onClick={() => setSelectedTeam(team)} className={cn("cursor-pointer transition-all hover:shadow-md", selectedTeam?.slug === team.slug && "border-2 border-primary shadow-lg")}>
                                    <CardHeader className="flex-row items-center gap-4 p-4">
                                        <Avatar className="h-12 w-12"><AvatarImage src={team.logo} data-ai-hint={team.dataAiHint} /><AvatarFallback>{team.name.charAt(0)}</AvatarFallback></Avatar>
                                        <div>
                                            <p className="font-semibold">{team.name}</p>
                                            <Badge variant="secondary">Ранг #{team.rank}</Badge>
                                        </div>
                                         {selectedTeam?.slug === team.slug && <Check className="ml-auto h-5 w-5 text-primary" />}
                                    </CardHeader>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Шаг 3: Выберите площадку</CardTitle>
                            <CardDescription>Вот несколько площадок, которые могут вам подойти.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {result.suggestedVenues.map(venue => (
                                <Card key={venue.id} onClick={() => setSelectedVenue(venue)} className={cn("cursor-pointer transition-all hover:shadow-md overflow-hidden", selectedVenue?.id === venue.id && "border-2 border-primary shadow-lg")}>
                                    <div className="relative h-24">
                                        <Image src={venue.image} alt={venue.name} fill className="object-cover" data-ai-hint={venue.imageHint} />
                                        {selectedVenue?.id === venue.id && <div className="absolute inset-0 bg-primary/20 flex items-center justify-center"><Check className="h-8 w-8 text-primary-foreground" /></div>}
                                    </div>
                                    <div className="p-4">
                                        <p className="font-semibold truncate">{venue.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{venue.address}</p>
                                    </div>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Шаг 4: Дата и время</CardTitle>
                            <CardDescription>Выберите дату для матча.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !selectedDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP") : <span>Выберите дату</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle>Шаг 5: Отправить вызов</CardTitle>
                            <CardDescription>Проверьте все детали и отправьте вызов команде. Они получат уведомление.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Соперник: <span className="font-semibold">{selectedTeam?.name || 'Не выбран'}</span></li>
                                <li>Место: <span className="font-semibold">{selectedVenue?.name || 'Не выбрано'}</span></li>
                                <li>Дата: <span className="font-semibold">{selectedDate ? format(selectedDate, "PPP") : 'Не выбрана'}</span></li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" onClick={handleSendChallenge} disabled={!selectedTeam || !selectedVenue || !selectedDate}>
                                <Send className="mr-2 h-4 w-4" />
                                Отправить вызов
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
}

const LoadingSkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/3 rounded-md" /></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/3 rounded-md" /></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-36 w-full rounded-md" />
                <Skeleton className="h-36 w-full rounded-md" />
                <Skeleton className="h-36 w-full rounded-md" />
            </CardContent>
        </Card>
    </div>
);
