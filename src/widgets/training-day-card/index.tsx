
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { CheckCircle2, XCircle, Clock, MoreVertical, Edit, Copy, Trash2, Smile, Meh, Frown, MessageSquare } from 'lucide-react';
import type { TrainingLogEntry } from '@/shared/lib/mock-data/training-log';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/shared/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { Separator } from '@/shared/ui/separator';

interface TrainingDayCardProps {
    entry: TrainingLogEntry;
    onDelete: (id: string) => void;
    onCopy: (id: string) => void;
}

const statusMap = {
    completed: { icon: CheckCircle2, color: 'text-green-500', label: 'Выполнено' },
    planned: { icon: Clock, color: 'text-blue-500', label: 'Запланировано' },
    skipped: { icon: XCircle, color: 'text-red-500', label: 'Пропущено' },
};

const moodMap = {
    great: { icon: Smile, color: 'text-green-500', label: 'Отлично' },
    good: { icon: Smile, color: 'text-yellow-500', label: 'Хорошо' },
    ok: { icon: Meh, color: 'text-orange-500', label: 'Нормально' },
    bad: { icon: Frown, color: 'text-red-500', label: 'Плохо' },
};

export function TrainingDayCard({ entry, onDelete, onCopy }: TrainingDayCardProps) {
    const StatusIcon = statusMap[entry.status].icon;
    const statusColor = statusMap[entry.status].color;

    return (
        <Card className={cn(
            "border-l-4",
            entry.status === 'completed' && "border-green-500",
            entry.status === 'planned' && "border-blue-500",
            entry.status === 'skipped' && "border-red-500"
        )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardDescription>{format(new Date(entry.date), 'EEEE, d MMMM yyyy', { locale: ru })}</CardDescription>
                    <CardTitle className="text-xl">{entry.workoutName}</CardTitle>
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Редактировать</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCopy(entry.id)}><Copy className="mr-2 h-4 w-4" /> Копировать</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(entry.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Упражнение</TableHead>
                            <TableHead>Подходы и повторения</TableHead>
                            <TableHead>Вес</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entry.exercises.map((ex, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{ex.name}</TableCell>
                                <TableCell>{ex.sets}</TableCell>
                                <TableCell>{ex.weight}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                {(entry.notes || entry.coachNotes) && (
                    <div className="mt-4 space-y-2">
                        <Separator />
                        {entry.notes && (
                             <div className="text-sm">
                                <p className="font-semibold">Ваши заметки:</p>
                                <p className="text-muted-foreground italic">&quot;{entry.notes}&quot;</p>
                            </div>
                        )}
                         {entry.coachNotes && (
                            <div className="text-sm p-3 bg-primary/10 rounded-md">
                                <p className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Комментарий тренера:</p>
                                <p className="text-muted-foreground italic">&quot;{entry.coachNotes}&quot;</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground bg-muted/50 p-3">
                 <div className="flex items-center gap-2">
                    <StatusIcon className={cn("h-4 w-4", statusColor)} />
                    <span>{statusMap[entry.status].label}</span>
                </div>
                {entry.mood && moodMap[entry.mood] && (
                    <div className="flex items-center gap-2">
                         <moodMap[entry.mood].icon className={cn("h-4 w-4", moodMap[entry.mood].color)} />
                         <span>Самочувствие: {moodMap[entry.mood].label}</span>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
