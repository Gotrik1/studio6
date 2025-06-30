
'use client';

import { getTrainingAnalytics } from '@/shared/lib/get-training-analytics';
import { trainingLogData } from '@/shared/lib/mock-data/training-log';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Award } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function PersonalRecordsPage() {
    const { personalRecords } = getTrainingAnalytics(trainingLogData);

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Личные рекорды</h1>
                <p className="text-muted-foreground">
                    Все ваши лучшие результаты в одном месте. Данные автоматически обновляются из журнала тренировок.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Все рекорды (1ПМ)</CardTitle>
                    <CardDescription>Расчетный одноповторный максимум (e1RM) по всем упражнениям.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Упражнение</TableHead>
                                <TableHead>Лучший сет</TableHead>
                                <TableHead className="text-center">Расчетный 1ПМ (кг)</TableHead>
                                <TableHead className="text-right">Дата рекорда</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {personalRecords.map(record => (
                                <TableRow key={record.exercise}>
                                    <TableCell className="font-medium">{record.exercise}</TableCell>
                                    <TableCell className="text-muted-foreground">{`${record.reps} x ${record.weight} кг`}</TableCell>
                                    <TableCell className="text-center font-bold text-lg text-primary flex items-center justify-center gap-2">
                                        <Award className="h-5 w-5 text-amber-500" />
                                        {record.e1RM}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-xs">
                                        {format(new Date(record.date), 'd MMMM yyyy', { locale: ru })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
