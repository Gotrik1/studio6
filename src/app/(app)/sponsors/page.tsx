'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, BrainCircuit, Loader2, Sparkles, Send } from "lucide-react";
import Link from "next/link";
import { teamsSeekingSponsorship, type TeamSeekingSponsorship } from "@/lib/mock-data/sponsorship";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { sponsorshipScout, type SponsorshipScoutOutput } from '@/ai/flows/sponsorship-scout-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

function SponsorshipOfferDialog() {
    const { toast } = useToast();
    // This is a placeholder. In a real app, it would have state and logic.
    return (
        <Button onClick={() => toast({ title: "Предложение отправлено!", description: "Команда получила ваше предложение." })}>
            <Send className="mr-2 h-4 w-4" />
            Сделать предложение
        </Button>
    )
}

function TeamCard({ team }: { team: TeamSeekingSponsorship }) {
    return (
         <Card className="flex flex-col">
            <CardHeader className="flex-row items-center gap-4">
                 <Avatar className="h-12 w-12 border">
                    <AvatarImage src={team.logo} alt={team.name} data-ai-hint={team.logoHint} />
                    <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription>{team.game}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">{team.pitch}</p>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
                <p className="text-xs font-semibold">Что нужно команде:</p>
                <p className="text-xs text-muted-foreground">{team.needs}</p>
                <div className="w-full pt-2 flex gap-2">
                    <Button variant="outline" className="w-full" asChild>
                        <Link href={`/teams/${team.slug}`}>Профиль</Link>
                    </Button>
                    <SponsorshipOfferDialog />
                </div>
            </CardFooter>
        </Card>
    )
}


export default function SponsorsPage() {
    const [prompt, setPrompt] = useState('Найди мне молодую, но перспективную команду по Valorant с активной фанатской базой в социальных сетях.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SponsorshipScoutOutput | null>(null);

    const handleSearch = async () => {
        if (!prompt) {
            setError('Пожалуйста, опишите ваши цели.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const scoutResult = await sponsorshipScout(prompt);
            setResult(scoutResult);
        } catch (e) {
            console.error(e);
            setError('Не удалось выполнить поиск. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <Handshake className="mx-auto h-16 w-16 mb-4 text-primary" />
                <h1 className="font-headline text-4xl font-bold">Центр Спонсорства</h1>
                <p className="mt-2 text-lg text-muted-foreground">Находите перспективные команды и заключайте выгодные партнерства.</p>
            </div>

            <Card className="shadow-lg border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit /> AI-Скаут талантов</CardTitle>
                    <CardDescription>Опишите цели вашей кампании, и наш ИИ подберет команды, которые идеально соответствуют вашим требованиям.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea 
                        placeholder="Например: 'Ищем команду по CS:GO 2 из Восточной Европы для продвижения нашего нового энергетического напитка...'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[80px]"
                    />
                     <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                        {isLoading ? "Идет поиск..." : "Найти команды"}
                    </Button>
                </CardContent>
            </Card>

            {error && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

            <section>
                 {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3 mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
                        </div>
                    </div>
                ) : result ? (
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-headline text-2xl font-bold">Рекомендации AI-Скаута</h2>
                            <p className="text-muted-foreground">{result.reasoning}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {result.recommendations.map(team => <TeamCard key={team.slug} team={team} />)}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="font-headline text-2xl font-bold">Команды в поиске поддержки</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teamsSeekingSponsorship.map(team => <TeamCard key={team.slug} team={team} />)}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
