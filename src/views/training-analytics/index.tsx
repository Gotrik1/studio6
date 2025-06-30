
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { VolumeChart } from '@/widgets/analytics-charts/volume-chart';
import { MeasurementChart } from '@/widgets/analytics-charts/measurements-chart';
import { Dumbbell, Flame, Star, Activity, BarChart3, LineChart } from 'lucide-react';
import { getTrainingAnalytics } from '@/shared/lib/get-training-analytics';
import { trainingLogData } from '@/shared/lib/mock-data/training-log';
import { measurementsHistory } from '@/shared/lib/mock-data/measurements';

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export function TrainingAnalyticsPage() {
    const { trainingMetrics, volumeByMuscleGroupData } = getTrainingAnalytics(trainingLogData);

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Аналитика тренировок</h1>
                <p className="text-muted-foreground">
                    Отслеживайте свой прогресс, анализируйте результаты и достигайте новых высот.
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Объем за месяц" value={trainingMetrics.monthlyVolume} icon={Dumbbell} />
                <StatCard title="Тренировочный стрик" value={trainingMetrics.workoutStreak} icon={Flame} />
                <StatCard title="Любимое упражнение" value={trainingMetrics.favoriteExercise} icon={Star} />
                <StatCard title="Всего тренировок" value={String(trainingMetrics.totalWorkouts)} icon={Activity} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart3/> Тренировочный объем по группам мышц</CardTitle>
                        <CardDescription>Общий тоннаж за все время (кг)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <VolumeChart data={volumeByMuscleGroupData} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><LineChart/> Динамика веса</CardTitle>
                        <CardDescription>Изменение вашего веса на основе данных из замеров (кг)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MeasurementChart history={measurementsHistory} metric="weight" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
