'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { mainPoll } from '@/shared/lib/mock-data/dashboard';
import { teams } from '@/shared/lib/mock-data/teams';
import { PollCard } from '@/widgets/poll-card';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';

export function FanZonePage() {
    const popularTeams = teams.slice(0, 4); // Take top 4 for display

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Фан-зона</h1>
                <p className="text-muted-foreground">
                    Место для самых преданных болельщиков. Участвуйте в опросах, следите за командами и будьте в курсе событий.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
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
