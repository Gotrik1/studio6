
'use client';

import { useState, useMemo } from 'react';
import { getTrainingAnalytics } from '@/shared/lib/get-training-analytics';
import { trainingLogData } from '@/shared/lib/mock-data/training-log';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Award, LineChart, TrendingUp, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PersonalRecordHistoryChart } from '@/widgets/analytics-charts/personal-record-chart';
import type { PersonalRecord } from '@/shared/lib/get-training-analytics';
import { cn } from '@/shared/lib/utils';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { ExerciseHistoryTable } from '@/widgets/exercise-history-table';
import type { ExerciseSession } from '@/shared/lib/get-training-analytics';

export function PersonalRecordsPage() {
    const { personalRecords, recordHistory, fullExerciseHistory } = useMemo(() => getTrainingAnalytics(trainingLogData), []);
    const [selectedRecord, setSelectedRecord] = useState<PersonalRecord | null>(personalRecords[0] || null);

    const selected1RMHistory = selectedRecord ? recordHistory[selectedRecord.exercise] || [] : [];
    const selectedFullHistory = selectedRecord ? fullExerciseHistory[selectedRecord.exercise] || [] : [];
    
    const firstRecord = selected1RMHistory.length > 0 ? selected1RMHistory[0] : null;
    const growth = (selectedRecord && firstRecord && firstRecord.e1RM > 0) 
        ? (((selectedRecord.e1RM - firstRecord.e1RM) / firstRecord.e1RM) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Личные рекорды</h1>
                <p className="text-muted-foreground">
                    Все ваши лучшие результаты и история их достижения. Кликните на упражнение, чтобы увидеть график прогресса.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                     <CardHeader>
                        <CardTitle>Список рекордов</CardTitle>
                        <CardDescription>Лучший результат (1ПМ) по каждому упражнению.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[500px]">
                            <Table>
                                <TableHeader className="sticky top-0 bg-card z-10">
                                    <TableRow>
                                        <TableHead>Упражнение</TableHead>
                                        <TableHead className="text-right">1ПМ (кг)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {personalRecords.map(record => (
                                        <TableRow 
                                            key={record.exercise}
                                            onClick={() => setSelectedRecord(record)}
                                            className={cn("cursor-pointer", selectedRecord?.exercise === record.exercise && "bg-muted")}
                                        >
                                            <TableCell className="font-medium">{record.exercise}</TableCell>
                                            <TableCell className="text-right font-bold">{record.e1RM}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    {selectedRecord ? (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><LineChart className="h-5 w-5 text-primary" />Динамика рекорда: {selectedRecord?.exercise}</CardTitle>
                                    <CardDescription>Прогресс вашего одноповторного максимума (1ПМ) с течением времени.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PersonalRecordHistoryChart data={selected1RMHistory} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ключевые показатели</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">Текущий рекорд</p>
                                        <p className="text-2xl font-bold flex items-center justify-center gap-1">
                                            <Award className="h-6 w-6 text-amber-500" />
                                            {selectedRecord.e1RM} кг
                                        </p>
                                         <p className="text-xs text-muted-foreground">({format(new Date(selectedRecord.date), 'd MMM yyyy', { locale: ru })})</p>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">Первый замер</p>
                                        <p className="text-2xl font-bold">
                                            {firstRecord?.e1RM || '-'} кг
                                        </p>
                                        {firstRecord && <p className="text-xs text-muted-foreground">({format(new Date(firstRecord.date), 'd MMMM yyyy', { locale: ru })})</p>}
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">Общий рост</p>
                                        <p className="text-2xl font-bold flex items-center justify-center gap-1">
                                            <TrendingUp className="h-6 w-6 text-green-500" />
                                            {growth}%
                                        </p>
                                         <p className="text-xs text-muted-foreground">&nbsp;</p>
                                    </div>
                                </CardContent>
                            </Card>
                            {selectedFullHistory.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Dumbbell className="h-5 w-5 text-primary" />Полная история: {selectedRecord.exercise}</CardTitle>
                                        <CardDescription>Просмотрите каждую тренировку, где вы выполняли это упражнение.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-96 pr-4">
                                            <ExerciseHistoryTable sessions={selectedFullHistory} />
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    ) : (
                        <Card className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">Выберите упражнение для просмотра деталей</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
