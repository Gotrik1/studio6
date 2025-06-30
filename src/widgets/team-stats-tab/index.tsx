'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { WinLossChart } from '@/widgets/analytics-charts/win-loss-chart';
import { teamWinLossData } from '@/shared/lib/mock-data/player-stats';
import { Trophy, Shield, Target, Users } from 'lucide-react';

const teamStats = {
    matches: 65,
    winrate: 69.2,
    goalsFor: 128,
    goalsAgainst: 74,
    tournamentsWon: 3,
};

export function TeamStatsTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardDescription>Всего матчей</CardDescription>
                        <CardTitle className="font-headline text-4xl">{teamStats.matches}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                     <CardHeader>
                        <CardDescription>Командный Winrate</CardDescription>
                        <CardTitle className="font-headline text-4xl">{teamStats.winrate}%</CardTitle>
                    </CardHeader>
                </Card>
            </div>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Target className="h-4 w-4"/> Забито голов</CardDescription>
                        <CardTitle className="font-headline text-3xl">{teamStats.goalsFor}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Shield className="h-4 w-4"/> Пропущено голов</CardDescription>
                        <CardTitle className="font-headline text-3xl">{teamStats.goalsAgainst}</CardTitle>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Trophy className="h-4 w-4"/> Выиграно турниров</CardDescription>
                        <CardTitle className="font-headline text-3xl">{teamStats.tournamentsWon}</CardTitle>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Users className="h-4 w-4"/> Игроков в составе</CardDescription>
                        <CardTitle className="font-headline text-3xl">11</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div className="grid grid-cols-1">
                <WinLossChart data={teamWinLossData} />
            </div>
        </div>
    );
}
