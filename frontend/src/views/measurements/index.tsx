'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { PlusCircle, LineChart, History } from 'lucide-react';
import type { Measurement } from '@/entities/user/model/types';
import { LogMeasurementDialog } from '@/widgets/log-measurement-dialog';
import { MeasurementChart } from '@/widgets/analytics-charts/measurements-chart';
import { MeasurementsHistoryTable } from '@/widgets/measurements-history-table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/select';
import { useMeasurements } from '@/shared/context/measurements-provider';
import { Skeleton } from '@/shared/ui/skeleton';

const metricOptions: { value: keyof Omit<Measurement, 'id' | 'date'>, label: string }[] = [
    { value: 'weight', label: 'Вес (кг)' },
    { value: 'bodyFat', label: 'Жир (%)' },
    { value: 'chest', label: 'Грудь (см)' },
    { value: 'waist', label: 'Талия (см)' },
    { value: 'hips', label: 'Бедра (см)' },
    { value: 'biceps', label: 'Бицепс (см)' },
    { value: 'thigh', label: 'Бедро (см)' },
];

const StatCard = ({ title, value, unit }: { title: string, value?: number, unit: string}) => (
    <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{value || '-'} <span className="text-lg text-muted-foreground">{unit}</span></p></CardContent>
    </Card>
);

const StatCardSkeleton = () => (
    <Card>
        <CardHeader className="pb-2">
            <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-16" />
        </CardContent>
    </Card>
);

export function MeasurementsPage() {
    const { history, addMeasurement, isLoading } = useMeasurements();
    const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState<keyof Omit<Measurement, 'id' | 'date'>>('weight');

    const latestMeasurement = history[0];

    return (
        <>
            <div className="space-y-6 opacity-0 animate-fade-in-up">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <h1 className="font-headline text-3xl font-bold tracking-tight">Замеры тела</h1>
                        <p className="text-muted-foreground">Отслеживайте изменения веса, жира и объемов для максимального контроля над прогрессом.</p>
                    </div>
                    <Button onClick={() => setIsLogDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Записать новые замеры
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         <StatCard title="Вес" value={latestMeasurement?.weight} unit="кг" />
                         <StatCard title="Жир" value={latestMeasurement?.bodyFat} unit="%" />
                         <StatCard title="Грудь" value={latestMeasurement?.chest} unit="см" />
                         <StatCard title="Талия" value={latestMeasurement?.waist} unit="см" />
                    </div>
                )}
                
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                            <div>
                                <CardTitle className="flex items-center gap-2"><LineChart/> Динамика</CardTitle>
                                <p className="text-sm text-muted-foreground">Выберите показатель для отображения на графике.</p>
                            </div>
                            <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as keyof Omit<Measurement, 'id' | 'date'>)}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    {metricOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-[300px] w-full" /> : <MeasurementChart history={history} metric={selectedMetric} />}
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2"><History/> История замеров</CardTitle>
                    </CardHeader>
                    <CardContent>
                       {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : (
                            <MeasurementsHistoryTable history={history} />
                        )}
                    </CardContent>
                </Card>

            </div>
            <LogMeasurementDialog
                isOpen={isLogDialogOpen}
                onOpenChange={setIsLogDialogOpen}
                onLog={addMeasurement}
                latestMeasurement={latestMeasurement}
            />
        </>
    );
}
