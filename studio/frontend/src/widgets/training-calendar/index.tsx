
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Calendar } from '@/shared/ui/calendar';
import { trainingLogData } from '@/shared/lib/mock-data/training-log';
import { matchesList } from '@/shared/lib/mock-data/matches';
import type { DayContentProps } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Trophy } from 'lucide-react';

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

    const matchesByDate = matchesList.reduce((acc, entry) => {
        const dateStr = format(new Date(entry.date), 'yyyy-MM-dd');
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(entry);
        return acc;
    }, {} as Record<string, typeof matchesList>);


    function CustomDay(props: DayContentProps) {
        const dateStr = format(props.date, 'yyyy-MM-dd');
        const dayWorkouts = workoutsByDate[dateStr];
        const dayMatches = matchesByDate[dateStr];
        
        if ((dayWorkouts && dayWorkouts.length > 0) || (dayMatches && dayMatches.length > 0)) {
            return (
                <Popover>
                    <PopoverTrigger asChild>
                         <div className="relative flex h-full w-full items-center justify-center">
                            {format(props.date, 'd')}
                            <div className="absolute bottom-1 flex gap-1">
                                {dayWorkouts?.map(workout => (
                                     <div key={`w-${workout.id}`} className={cn("h-1.5 w-1.5 rounded-full", statusMap[workout.status].color)} />
                                ))}
                                {dayMatches?.map(match => (
                                     <Trophy key={`m-${match.id}`} className="h-2 w-2 text-amber-500" />
                                ))}
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4 space-y-3">
                         <p className="font-semibold text-sm">{format(props.date, 'd MMMM yyyy', { locale: ru })}</p>
                         {dayWorkouts?.map(workout => (
                             <div key={workout.id} className="text-xs">
                                 <Badge variant={workout.status === 'completed' ? 'default' : workout.status === 'planned' ? 'secondary' : 'destructive'}>
                                     {statusMap[workout.status].label}
                                 </Badge>
                                 <p className="font-medium mt-1">{workout.workoutName}</p>
                             </div>
                         ))}
                         {dayMatches?.map(match => (
                              <div key={match.id} className="text-xs pt-2 border-t mt-2">
                                  <Badge variant="outline" className="border-amber-500/50 text-amber-600">
                                      {match.status}
                                  </Badge>
                                 <p className="font-medium mt-1">{match.team1.name} vs {match.team2.name}</p>
                                 <p className="text-muted-foreground">{match.tournament}</p>
                             </div>
                         ))}
                    </PopoverContent>
                </Popover>
            );
        }

        return <div className="relative flex h-full w-full items-center justify-center">{format(props.date, 'd')}</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ваш календарь</CardTitle>
                <CardDescription>Наведите курсор на дату, чтобы увидеть детали тренировок и матчей.</CardDescription>
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
