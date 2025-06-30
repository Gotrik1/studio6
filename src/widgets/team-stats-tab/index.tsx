'use client';

import { KdaChart } from '@/widgets/analytics-charts/kda-chart';
import { WinLossChart } from '@/widgets/analytics-charts/win-loss-chart';
import { WinrateByMapChart } from '@/widgets/analytics-charts/winrate-by-map-chart';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { teamKdaData, teamWinLossData, teamWinrateByMapData } from '@/shared/lib/mock-data/player-stats';

export function TeamStatsTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardDescription>Всего матчей</CardDescription>
                        <CardTitle className="font-headline text-4xl">65</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="lg:col-span-3">
                     <CardHeader>
                        <CardDescription>Командный Winrate</CardDescription>
                        <CardTitle className="font-headline text-4xl">69.2%</CardTitle>
                    </CardHeader>
                </Card>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WinLossChart data={teamWinLossData} />
                <WinrateByMapChart data={teamWinrateByMapData} />
            </div>
            <div className="grid grid-cols-1">
                <KdaChart data={teamKdaData} />
            </div>
        </div>
    );
}
