'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { WinLossChart } from '@/widgets/analytics-charts/win-loss-chart';
import { winLossData } from '@/shared/lib/mock-data/player-stats';
import { Target, Shield, Handshake, Footprints } from 'lucide-react';

const playerStats = {
    matches: 218,
    winrate: 71.8,
    goals: 152,
    assists: 89,
    tackles: 430,
    passAccuracy: 85,
};


export function StatsTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardDescription>Матчи</CardDescription>
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
                        <CardDescription className="flex items-center gap-2"><Target className="h-4 w-4"/> Голы</CardDescription>
                        <CardTitle className="font-headline text-3xl">{playerStats.goals}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Handshake className="h-4 w-4"/> Ассисты</CardDescription>
                        <CardTitle className="font-headline text-3xl">{playerStats.assists}</CardTitle>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Shield className="h-4 w-4"/> Отборы</CardDescription>
                        <CardTitle className="font-headline text-3xl">{playerStats.tackles}</CardTitle>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Footprints className="h-4 w-4"/> Точность пасов</CardDescription>
                        <CardTitle className="font-headline text-3xl">{playerStats.passAccuracy}%</CardTitle>
                    </CardHeader>
                </Card>
            </div>
             <div className="grid grid-cols-1">
                <WinLossChart data={winLossData} />
            </div>
        </div>
    );
}
