
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { PollCard } from '@/widgets/poll-card';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Megaphone } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { MatchOfTheWeekWidget } from '@/widgets/match-of-the-week';
import { getTeams } from '@/entities/team/api/teams';
import { getPromotions } from '@/entities/promotion/api/promotions';
import type { Team } from '@/entities/team/model/types';
import type { Promotion } from '@/entities/promotion/model/types';
import { Skeleton } from '@/shared/ui/skeleton';
import { getLatestPoll, submitVote } from '@/entities/poll/api/polls';
import type { Poll } from '@/entities/poll/model/types';
import { useToast } from '@/shared/hooks/use-toast';

export function FanZonePage() {
    const [popularTeams, setPopularTeams] = useState<Team[]>([]);
    const [fanPromotions, setFanPromotions] = useState<Promotion[]>([]);
    const [poll, setPoll] = useState<Poll | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
             const [teamsData, promotionsData, pollData] = await Promise.all([
                getTeams(),
                getPromotions(),
                getLatestPoll()
            ]);
            setPopularTeams(teamsData.slice(0, 4));
            setFanPromotions(promotionsData.slice(0, 2));
            setPoll(pollData);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить данные для фан-зоны.'});
        } finally {
            setIsLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        loadData();
    }, [loadData]);
    
     const handleVote = async (pollId: string, optionId: string) => {
        const result = await submitVote(pollId, optionId);
        if(result.success) {
            toast({ title: 'Голос учтён!' });
            await loadData(); // Refetch to update poll results
            return true;
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
            return false;
        }
    };


    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Фан-зона</h1>
                <p className="text-muted-foreground">
                    Место для самых преданных болельщиков. Голосуйте в опросах, участвуйте в конкурсах и следите за любимыми командами.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <MatchOfTheWeekWidget />
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Megaphone className="text-primary" />
                                Акции для болельщиков
                            </CardTitle>
                            <CardDescription>
                                Участвуйте в конкурсах от наших партнеров и выигрывайте ценные призы!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isLoading ? <> <Skeleton className="h-64 w-full" /> <Skeleton className="h-64 w-full" /> </> :
                             fanPromotions.map((promo) => (
                                <Card key={promo.id} className="overflow-hidden flex flex-col">
                                    <div className="relative h-32 w-full">
                                        <Image src={promo.imageDataUri} alt={promo.name} fill className="object-cover" data-ai-hint={promo.imageHint} />
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <p className="font-semibold text-sm">{promo.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1 flex-1">Приз: {promo.prize}</p>
                                        <Button size="sm" className="w-full mt-3" asChild>
                                            <Link href="/promotions">Подробнее</Link>
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Популярные команды</CardTitle>
                            <CardDescription>Команды, за которыми следят больше всего.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full"/>) :
                             popularTeams.map(team => (
                                <Link key={team.slug} href={`/teams/${team.slug}`} className="block">
                                    <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted transition-colors">
                                        <Image src={team.logo || 'https://placehold.co/100x100.png'} alt={team.name} width={40} height={40} className="rounded-full border" data-ai-hint={team.dataAiHint || 'team logo'} />
                                        <div className="flex-1">
                                            <p className="font-semibold">{team.name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Flame className="text-destructive" />
                                Горячие обсуждения
                            </CardTitle>
                            <CardDescription>
                                Ваше мнение важно для нас! Примите участие в еженедельном опросе.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             {isLoading ? <Skeleton className="h-64 w-full" /> : <PollCard poll={poll} onVote={handleVote} />}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
