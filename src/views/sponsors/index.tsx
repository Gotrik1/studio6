
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Handshake, Loader2, Sparkles, Send, UserSearch } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { sponsorsList } from '@/shared/lib/mock-data/sponsors';
import { Textarea } from '@/shared/ui/textarea';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';
import { findSponsorsForTeam, type FindSponsorsForTeamOutput } from '@/shared/api/genkit/flows/find-sponsors-for-team-flow';
import { Separator } from '@/shared/ui/separator';

const mockTeamData = {
    teamName: "Дворовые Атлеты",
    teamGame: "Футбол",
    teamDescription: "Мы - топ-1 футбольная команда платформы, ищем партнеров для выхода на городскую лигу. Нам нужно финансирование поездок на матчи и брендированная форма.",
};

export function SponsorsPage() {
    const { toast } = useToast();
    const [scoutPrompt, setScoutPrompt] = useState(mockTeamData.teamDescription);
    const [isScouting, setIsScouting] = useState(false);
    const [scoutError, setScoutError] = useState<string | null>(null);
    const [scoutResult, setScoutResult] = useState<FindSponsorsForTeamOutput | null>(null);

    const handleScout = async () => {
        setIsScouting(true);
        setScoutError(null);
        setScoutResult(null);

        try {
            const result = await findSponsorsForTeam({
                teamName: mockTeamData.teamName,
                teamGame: mockTeamData.teamGame,
                teamDescription: scoutPrompt,
            });
            setScoutResult(result);
        } catch (e) {
            console.error("Scouting failed:", e);
            setScoutError("Не удалось найти спонсоров. Попробуйте изменить запрос.");
        } finally {
            setIsScouting(false);
        }
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Поиск спонсоров</h1>
                <p className="text-muted-foreground">
                    Найдите подходящего партнера для вашей команды с помощью AI-скаута или просмотрите полный список.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserSearch /> AI-Скаут Спонсоров</CardTitle>
                    <CardDescription>Опишите вашу команду, её цели и потребности, чтобы AI подобрал наиболее релевантных спонсоров.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Например: 'Мы - молодая хоккейная команда, ищем спонсора для оплаты аренды льда...'"
                        value={scoutPrompt}
                        onChange={(e) => setScoutPrompt(e.target.value)}
                        disabled={isScouting}
                        className="min-h-[100px]"
                    />
                </CardContent>
                <CardFooter>
                    <Button onClick={handleScout} disabled={isScouting}>
                        {isScouting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                        Найти спонсора
                    </Button>
                </CardFooter>
            </Card>

            {isScouting && (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            )}

            {scoutError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{scoutError}</AlertDescription></Alert>}
            
            {scoutResult && (
                <div className="space-y-4 animate-in fade-in-50">
                    <h2 className="font-headline text-2xl font-semibold">Рекомендации AI</h2>
                    {scoutResult.recommendations.map(({ sponsor, reasoning }) => (
                         <Card key={sponsor.id}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Image src={sponsor.logo} alt={sponsor.name} width={64} height={64} className="rounded-lg border" data-ai-hint={sponsor.logoHint} />
                                <div className="flex-1">
                                    <CardTitle>{sponsor.name}</CardTitle>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {sponsor.interests.map(interest => (
                                            <Badge key={interest} variant="secondary">{interest}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <Button onClick={() => toast({title: "Заявка отправлена!", description: `Ваше предложение было отправлено ${sponsor.name}`})}>
                                    <Send className="mr-2 h-4 w-4"/> Отправить питч
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Alert>
                                    <Sparkles className="h-4 w-4" />
                                    <AlertTitle>Почему это хороший кандидат?</AlertTitle>
                                    <AlertDescription>{reasoning}</AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            
            <Separator />

            <div>
                <h2 className="font-headline text-2xl font-semibold mb-4">Все спонсоры</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sponsorsList.map(sponsor => (
                        <Card key={sponsor.id} className="flex flex-col">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Image src={sponsor.logo} alt={sponsor.name} width={64} height={64} className="rounded-lg border" data-ai-hint={sponsor.logoHint} />
                                <div>
                                    <CardTitle>{sponsor.name}</CardTitle>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {sponsor.interests.map(interest => (
                                            <Badge key={interest} variant="secondary">{interest}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground">{sponsor.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline" asChild>
                                    <Link href={sponsor.profileUrl}>Профиль</Link>
                                </Button>
                                <Button onClick={() => toast({title: "Заявка отправлена!", description: `Ваше предложение было отправлено ${sponsor.name}`})}>
                                    <Handshake className="mr-2 h-4 w-4" />
                                    Связаться
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
