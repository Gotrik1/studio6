
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { mainPoll } from '@/shared/lib/mock-data/dashboard';
import { teams } from '@/shared/lib/mock-data/teams';
import { PollCard } from '@/widgets/poll-card';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame, Megaphone } from 'lucide-react';
import { promotionsList } from '@/shared/lib/mock-data/promotions';
import { Button } from '@/shared/ui/button';
import { MatchPredictionWidget } from '@/widgets/match-predictions-widget';

export function FanZonePage() {
    const popularTeams = teams.slice(0, 4); // Take top 4 for display
    const fanPromotions = promotionsList.slice(0, 2); // Take a couple of promotions to display

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
                    <MatchPredictionWidget />
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
                            <PollCard poll={mainPoll} />
                        </CardContent>
                    </Card>

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
                            {fanPromotions.map((promo) => (
                                <Card key={promo.id} className="overflow-hidden flex flex-col">
                                    <div className="relative h-32 w-full">
                                        <Image src={promo.image} alt={promo.title} fill className="object-cover" data-ai-hint={promo.imageHint} />
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <p className="font-semibold text-sm">{promo.title}</p>
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
                            {popularTeams.map(team => (
                                <Link key={team.slug} href={`/teams/${team.slug}`} className="block">
                                    <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted transition-colors">
                                        <Image src={team.logo} alt={team.name} width={40} height={40} className="rounded-full border" data-ai-hint={team.dataAiHint} />
                                        <div className="flex-1">
                                            <p className="font-semibold">{team.name}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
