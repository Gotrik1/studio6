
'use client';

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Swords, Trophy, Shield, Flame } from 'lucide-react';
import { WinLossChart } from '@/widgets/analytics-charts/win-loss-chart';
import { winLossData } from '@/shared/lib/mock-data/player-stats';
import { EsportsAnalysisTab } from './esports-analysis-tab';
import { Separator } from '@/shared/ui/separator';

const playerStats = {
    matches: winLossData.wins + winLossData.losses,
    winrate: ((winLossData.wins / (winLossData.wins + winLossData.losses)) * 100).toFixed(1),
    wins: winLossData.wins,
    losses: winLossData.losses,
    winStreak: 5,
};


export function StatsTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardDescription>Всего матчей</CardDescription>
                        <CardTitle className="font-headline text-4xl">{playerStats.matches}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                     <CardHeader>
                        <CardDescription>Процент побед</CardDescription>
                        <CardTitle className="font-headline text-4xl">{playerStats.winrate}%</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Trophy className="h-4 w-4"/> Победы</CardDescription>
                        <CardTitle className="font-headline text-3xl">{playerStats.wins}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Shield className="h-4 w-4"/> Поражения</CardDescription>
                        <CardTitle className="font-headline text-3xl">{playerStats.losses}</CardTitle>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Flame className="h-4 w-4"/> Победная серия</CardDescription>
                        <CardTitle className="font-headline text-3xl">{playerStats.winStreak}</CardTitle>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Swords className="h-4 w-4"/> KDA (Valorant)</CardDescription>
                        <CardTitle className="font-headline text-3xl">1.25</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div className="grid grid-cols-1">
                <WinLossChart data={winLossData} />
            </div>

            <Separator className="my-6" />
            
            <EsportsAnalysisTab />
        </div>
    );
}
