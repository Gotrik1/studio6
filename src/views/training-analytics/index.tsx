
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { VolumeChart } from '@/widgets/analytics-charts/volume-chart';
import { WeightChart } from '@/widgets/analytics-charts/weight-chart';
import { programProgress, aiAnalyticsHint } from '@/shared/lib/mock-data/analytics';
import { BrainCircuit } from 'lucide-react';

export function TrainingAnalyticsPage() {
    const progressPercentage = (programProgress.completed / programProgress.total) * 100;

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Аналитика</h1>
                <p className="text-muted-foreground">
                    Отслеживайте свой прогресс, анализируйте результаты и получайте персональные рекомендации.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Прогресс по программе</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium">Выполнено тренировок</span>
                                <span>{programProgress.completed} из {programProgress.total}</span>
                            </div>
                            <Progress value={progressPercentage} />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">Пропущено тренировок:</span>
                            <span className="font-bold text-destructive">{programProgress.skipped}</span>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2 bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BrainCircuit className="text-primary" />
                            AI-Подсказка
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold">{aiAnalyticsHint.title}</p>
                        <p className="text-sm text-muted-foreground italic">&quot;{aiAnalyticsHint.description}&quot;</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VolumeChart />
                <WeightChart />
            </div>
        </div>
    );
}
