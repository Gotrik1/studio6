
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import type { ExerciseSession } from '@/shared/lib/get-training-analytics';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Dumbbell } from 'lucide-react';

interface ExerciseHistoryTableProps {
    sessions: ExerciseSession[];
    exerciseName: string;
}

export function ExerciseHistoryTable({ sessions, exerciseName }: ExerciseHistoryTableProps) {
    if (!sessions || sessions.length === 0) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Dumbbell className="h-5 w-5 text-primary" />Полная история: {exerciseName}</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="flex h-32 items-center justify-center text-muted-foreground">
                        Нет записей для этого упражнения.
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Dumbbell className="h-5 w-5 text-primary" />Полная история: {exerciseName}</CardTitle>
                <CardDescription>Просмотрите каждую тренировку, где вы выполняли это упражнение.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ScrollArea className="h-96">
                    <Accordion type="single" collapsible className="w-full">
                        {sessions.map((session, index) => (
                            <AccordionItem value={`session-${index}`} key={index}>
                                <AccordionTrigger>
                                    <div className="flex justify-between items-center w-full pr-4">
                                        <span>{format(new Date(session.date), 'd MMMM yyyy', { locale: ru })}</span>
                                        <span className="text-sm text-muted-foreground hidden sm:inline">{session.workoutName}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-16">Сет</TableHead>
                                                <TableHead>Повторения</TableHead>
                                                <TableHead>Вес (кг)</TableHead>
                                                <TableHead>RPE</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {session.sets.map((set, setIndex) => (
                                                <TableRow key={setIndex}>
                                                    <TableCell className="font-medium">{setIndex + 1}</TableCell>
                                                    <TableCell>{set.reps}</TableCell>
                                                    <TableCell>{set.weight}</TableCell>
                                                    <TableCell>{set.rpe ?? '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                 </ScrollArea>
            </CardContent>
        </Card>
    );
}
