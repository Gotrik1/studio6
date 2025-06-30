
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Calendar } from '@/shared/ui/calendar';
import { trainingLogData } from '@/shared/lib/mock-data/training-log';
import type { DayContentProps } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const statusMap = {
    completed: { color: 'bg-green-500', label: 'Выполнено' },
    planned: { color: 'bg-blue-500', label: 'Запланировано' },
    skipped: { color: 'bg-red-500', label: 'Пропущено' },
};

export function TrainingCalendar() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    const workoutsByDate = trainingLogData.reduce((acc, entry) => {
        const dateStr = format(new Date(entry.date), 'yyyy-MM-dd');
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(entry);
        return acc;
    }, {} as Record<string, typeof trainingLogData>);

    function CustomDay(props: DayContentProps) {
        const dateStr = format(props.date, 'yyyy-MM-dd');
        const dayWorkouts = workoutsByDate[dateStr];
        
        if (dayWorkouts && dayWorkouts.length > 0) {
            return (
                <Popover>
                    <PopoverTrigger asChild>
                         <div className="relative flex h-full w-full items-center justify-center">
                            {props.children}
                            <div className="absolute bottom-1 flex gap-1">
                                {dayWorkouts.map(workout => (
                                     <div key={workout.id} className={cn("h-1.5 w-1.5 rounded-full", statusMap[workout.status].color)} />
                                ))}
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 space-y-2">
                         <p className="font-semibold text-sm">{format(props.date, 'd MMMM yyyy', { locale: ru })}</p>
                         {dayWorkouts.map(workout => (
                             <div key={workout.id} className="text-xs">
                                 <Badge variant={workout.status === 'completed' ? 'default' : workout.status === 'planned' ? 'secondary' : 'destructive'}>
                                     {statusMap[workout.status].label}
                                 </Badge>
                                 <p className="font-medium mt-1">{workout.workoutName}</p>
                             </div>
                         ))}
                    </PopoverContent>
                </Popover>
            );
        }

        return <div className="relative flex h-full w-full items-center justify-center">{props.children}</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ваш план тренировок</CardTitle>
                <CardDescription>Наведите курсор на дату, чтобы увидеть детали тренировки.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0"
                    components={{
                        DayContent: CustomDay
                    }}
                    locale={ru}
                />
            </CardContent>
        </Card>
    );
}
