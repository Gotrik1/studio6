
'use client';

import { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { trainingLogData } from '@/shared/lib/mock-data/training-log';
import { getTrainingAnalytics } from '@/shared/lib/get-training-analytics';
import { Trophy, Dumbbell, Flame, Star, Activity, BarChart3, BrainCircuit } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { VolumeChart } from '@/widgets/analytics-charts/volume-chart';
import { Button } from '@/shared/ui/button';
import { AiFormCheckDialog } from '@/widgets/ai-form-check-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

export function PhysicalPrepTab() {
    const { personalRecords, trainingMetrics, volumeByMuscleGroupData } = getTrainingAnalytics(trainingLogData);
    const top5Records = personalRecords.slice(0, 5);

    const [isFormCheckOpen, setIsFormCheckOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState('Приседания со штангой');

    const uniqueExercisesWithRecords = [...new Set(personalRecords.map(pr => pr.exercise))];

    return (
        <>
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2"><Dumbbell className="h-4 w-4"/> Объем за месяц</CardDescription>
                            <CardTitle className="font-headline text-3xl">{trainingMetrics.monthlyVolume}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2"><Flame className="h-4 w-4"/> Тренировочный стрик</CardDescription>
                            <CardTitle className="font-headline text-3xl">{trainingMetrics.workoutStreak}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2"><Star className="h-4 w-4"/> Любимое упражнение</CardDescription>
                            <CardTitle className="font-headline text-xl">{trainingMetrics.favoriteExercise}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex items-center gap-2"><Activity className="h-4 w-4"/> Последняя тренировка</CardDescription>
                            <CardTitle className="font-headline text-xl">{trainingMetrics.lastWorkout}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
                
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-primary"/> AI-Проверка техники</CardTitle>
                        <CardDescription>Загрузите видео выполнения упражнения, чтобы получить детальный разбор вашей техники от ИИ.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                            <SelectTrigger className="w-full sm:w-[250px]">
                                <SelectValue placeholder="Выберите упражнение" />
                            </SelectTrigger>
                            <SelectContent>
                                {uniqueExercisesWithRecords.map(ex => (
                                    <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button className="w-full sm:w-auto" onClick={() => setIsFormCheckOpen(true)} disabled={!selectedExercise}>Проверить технику</Button>
                    </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" /> Топ-5 личных рекордов (1ПМ)</CardTitle>
                            <CardDescription>Лучшие силовые показатели, рассчитанные на основе данных из журнала тренировок.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Упражнение</TableHead>
                                        <TableHead>Результат (1ПМ)</TableHead>
                                        <TableHead className="text-right">Дата</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {top5Records.map((record) => (
                                        <TableRow key={record.exercise}>
                                            <TableCell className="font-medium">{record.exercise}</TableCell>
                                            <TableCell className="font-bold text-lg">{record.e1RM} кг</TableCell>
                                            <TableCell className="text-right text-muted-foreground text-xs">
                                                {format(new Date(record.date), 'd MMM yyyy', { locale: ru })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Фокус по группам мышц</CardTitle>
                            <CardDescription>Распределение тренировочного объема (тоннажа) за все время.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <VolumeChart data={volumeByMuscleGroupData} />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <AiFormCheckDialog 
                isOpen={isFormCheckOpen}
                onOpenChange={setIsFormCheckOpen}
                exerciseName={selectedExercise}
            />
        </>
    );
}
