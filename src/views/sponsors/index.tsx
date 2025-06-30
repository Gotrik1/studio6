
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { sponsorshipScout, type SponsorshipScoutOutput } from '@/shared/api/genkit/flows/sponsorship-scout-flow';
import { Textarea } from '@/shared/ui/textarea';
import { Loader2, Sparkles, Send, UserSearch } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { teamsSeekingSponsorship } from '@/shared/lib/mock-data/sponsorship';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { Separator } from '@/shared/ui/separator';

export function SponsorsPage() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('Мы - бренд энергетических напитков, наша целевая аудитория - молодежь 16-24 лет, интересующаяся динамичными видами спорта.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SponsorshipScoutOutput | null>(null);

    const handleScout = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const scoutResult = await sponsorshipScout(prompt);
            setResult(scoutResult);
        } catch (e) {
            console.error(e);
            setError("Не удалось найти команды. Попробуйте изменить ваш запрос.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleContact = (teamName: string) => {
        toast({
            title: "Запрос отправлен!",
            description: `Ваш запрос на сотрудничество был отправлен команде ${teamName}.`
        })
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Центр спонсорства</h1>
                <p className="text-muted-foreground">
                    Найдите идеальную команду для продвижения вашего бренда с помощью нашего AI-скаута.
                </p>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserSearch /> AI-Скаут Команд</CardTitle>
                    <CardDescription>Опишите ваши маркетинговые цели, и наш AI подберет команды, которые наилучшим образом соответствуют вашему бренду.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Например: 'Мы - производитель спортивного питания, ищем футбольные команды с большой аудиторией...'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[100px]"
                    />
                     {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                     <Button onClick={handleScout} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                        Найти команды
                    </Button>
                </CardFooter>
            </Card>

            {isLoading && (
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            )}
            
            {error && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

            {result && (
                <div className="space-y-6 animate-in fade-in-50">
                    <h2 className="font-headline text-2xl font-semibold">Рекомендации AI</h2>
                    <Alert>
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle>Обоснование выбора</AlertTitle>
                        <AlertDescription>{result.reasoning}</AlertDescription>
                    </Alert>
                    {result.recommendations.map((team) => (
                         <Card key={team.slug}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Image src={team.logo} alt={team.name} width={64} height={64} className="rounded-lg border" data-ai-hint={team.logoHint} />
                                <div className="flex-1">
                                    <CardTitle>{team.name}</CardTitle>
                                    <Badge variant="secondary">{team.game}</Badge>
                                </div>
                                <Button onClick={() => handleContact(team.name)}>
                                    <Send className="mr-2 h-4 w-4"/>Связаться
                                </Button>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
            
            <Separator />

             <div>
                <h2 className="font-headline text-2xl font-semibold mb-4">Все команды в поиске спонсоров</h2>
                <div className="space-y-4">
                    {teamsSeekingSponsorship.map(team => (
                         <Card key={team.slug}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Image src={team.logo} alt={team.name} width={64} height={64} className="rounded-lg border" data-ai-hint={team.logoHint} />
                                <div className="flex-1">
                                    <CardTitle>{team.name}</CardTitle>
                                    <Badge variant="secondary">{team.game}</Badge>
                                </div>
                                 <Button asChild variant="outline">
                                    <Link href={`/teams/${team.slug}`}>Профиль</Link>
                                </Button>
                                <Button onClick={() => handleContact(team.name)}>
                                    <Send className="mr-2 h-4 w-4"/>Связаться
                                </Button>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
