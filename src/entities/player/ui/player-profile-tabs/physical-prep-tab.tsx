
'use client';

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { personalRecords, trainingMetrics } from '@/shared/lib/mock-data/training-stats';
import { Trophy, Dumbbell, Flame, Star, Activity } from 'lucide-react';

export function PhysicalPrepTab() {
    return (
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
                        <CardTitle className="font-headline text-3xl">{trainingMetrics.favoriteExercise}</CardTitle>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2"><Activity className="h-4 w-4"/> Последняя тренировка</CardDescription>
                        <CardTitle className="font-headline text-xl">{trainingMetrics.lastWorkout}</CardTitle>
                    </CardHeader>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" /> Персональные рекорды (1ПМ)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Упражнение</TableHead>
                                <TableHead className="text-right">Результат</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {personalRecords.map((record) => (
                                <TableRow key={record.exercise}>
                                    <TableCell className="font-medium">{record.exercise}</TableCell>
                                    <TableCell className="text-right font-bold text-lg">{record.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
