
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { PlusCircle, LineChart, History } from 'lucide-react';
import { measurementsHistory as initialHistory, type Measurement } from '@/shared/lib/mock-data/measurements';
import { LogMeasurementDialog } from '@/widgets/log-measurement-dialog';
import { MeasurementChart } from '@/widgets/analytics-charts/measurements-chart';
import { MeasurementsHistoryTable } from '@/widgets/measurements-history-table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/select';

const metricOptions: { value: keyof Omit<Measurement, 'id' | 'date'>, label: string }[] = [
    { value: 'weight', label: 'Вес (кг)' },
    { value: 'bodyFat', label: 'Жир (%)' },
    { value: 'chest', label: 'Грудь (см)' },
    { value: 'waist', label: 'Талия (см)' },
    { value: 'hips', label: 'Бедра (см)' },
    { value: 'biceps', label: 'Бицепс (см)' },
    { value: 'thigh', label: 'Бедро (см)' },
];

export function MeasurementsPage() {
    const [history, setHistory] = useState<Measurement[]>(initialHistory);
    const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState<keyof Omit<Measurement, 'id' | 'date'>>('weight');

    const handleLogMeasurement = (newMeasurement: Omit<Measurement, 'id' | 'date' | 'weight'> & { weight: number }) => {
        const newEntry: Measurement = {
            id: `m-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            ...newMeasurement,
        };
        setHistory(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Вес</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">{latestMeasurement?.weight || 0} кг</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Жир</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">{latestMeasurement?.bodyFat || 0}%</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Грудь</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">{latestMeasurement?.chest || 0} см</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Талия</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">{latestMeasurement?.waist || 0} см</p></CardContent>
                    </Card>
                </div>
                
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                            <div>
                                <CardTitle className="flex items-center gap-2"><LineChart/> Динамика</CardTitle>
                                <CardDescription>Выберите показатель для отображения на графике.</CardDescription>
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
                        <MeasurementChart history={history} metric={selectedMetric} />
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2"><History/> История замеров</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MeasurementsHistoryTable history={history} />
                    </CardContent>
                </Card>

            </div>
            <LogMeasurementDialog
                isOpen={isLogDialogOpen}
                onOpenChange={setIsLogDialogOpen}
                onLog={handleLogMeasurement}
                latestMeasurement={latestMeasurement}
            />
        </>
    );
}
