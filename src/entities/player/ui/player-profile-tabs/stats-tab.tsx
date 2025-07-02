
'use client';

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Target, Shield, Handshake, Footprints } from 'lucide-react';
import { KdaChart } from '@/widgets/analytics-charts/kda-chart'; // Reusing for goals/match
import { WinrateByMapChart } from '@/widgets/analytics-charts/winrate-by-map-chart'; // Reusing for winrate/stadium
import { goalDynamicsData } from '@/shared/lib/mock-data/goal-dynamics';
import { winrateByStadiumData } from '@/shared/lib/mock-data/winrate-by-stadium';

const playerStats = {
    matches: 218,
    winrate: 71.8,
    goals: 152,
    assists: 89,
    tackles: 430,
    passAccuracy: 85,
};


export function StatsTab() {
    // Adapt data for the charts
    const goalChartData = goalDynamicsData.map(d => ({ month: d.month, kda: d.ratio }));
    const stadiumWinrateData = winrateByStadiumData.map(d => ({ map: d.stadium, winrate: d.winrate }));

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
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Динамика голов за матч</CardTitle>
                        <CardDescription>Среднее количество голов за матч в последние 5 месяцев.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <KdaChart data={goalChartData} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Процент побед по стадионам</CardTitle>
                        <CardDescription>Ваша эффективность на разных полях.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WinrateByMapChart data={stadiumWinrateData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
