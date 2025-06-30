'use client';

import { KdaChart } from '@/widgets/analytics-charts/kda-chart';
import { WinLossChart } from '@/widgets/analytics-charts/win-loss-chart';
import { WinrateByMapChart } from '@/widgets/analytics-charts/winrate-by-map-chart';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export function StatsTab() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardDescription>Матчи</CardDescription>
                        <CardTitle className="font-headline text-4xl">218</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="lg:col-span-3">
                     <CardHeader>
                        <CardDescription>Коэффициент Побед/Поражений</CardDescription>
                        <CardTitle className="font-headline text-4xl">71.8%</CardTitle>
                    </CardHeader>
                </Card>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WinLossChart />
                <WinrateByMapChart />
            </div>
            <div className="grid grid-cols-1">
                <KdaChart />
            </div>
        </div>
    );
}
