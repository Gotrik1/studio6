'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { addDays, format, setHours, setMinutes, startOfDay, getDay, getHours, getMinutes, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { PlaygroundBooking } from '@/shared/lib/mock-data/playground-schedule';
import { PlanGameDialog, type FormValues } from '@/widgets/plan-game-dialog';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/shared/ui/tooltip';

interface PlaygroundScheduleTabProps {
    playground: Playground;
    initialSchedule: PlaygroundBooking[];
    setSchedule: React.Dispatch<React.SetStateAction<PlaygroundBooking[]>>;
}

const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM
const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

export function PlaygroundScheduleTab({ playground, initialSchedule: schedule, setSchedule }: PlaygroundScheduleTabProps) {
    const { toast } = useToast();
    const [isPlanGameOpen, setIsPlanGameOpen] = useState(false);
    const [dialogInitialData, setDialogInitialData] = useState<{ date: Date, time: string } | undefined>();

    const handlePlanGame = (data: FormValues) => {
        const startTime = setMinutes(setHours(data.date, parseInt(data.time.split(':')[0])), parseInt(data.time.split(':')[1]));
        
        const endTime = new Date(startTime.getTime() + data.duration * 60000);

        const newBooking: PlaygroundBooking = {
            id: `booking-${Date.now()}`,
            playgroundId: playground.id,
            team: { name: 'Ваша команда', avatar: 'https://placehold.co/100x100.png', avatarHint: 'user team logo' },
            startTime,
            endTime,
        };
        setSchedule(prev => [...prev, newBooking].sort((a,b) => a.startTime.getTime() - b.startTime.getTime()));
    };
    
    const handleCellClick = (day: Date, hour: number) => {
        setDialogInitialData({ date: day, time: `${String(hour).padStart(2, '0')}:00` });
        setIsPlanGameOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Расписание площадки на неделю</CardTitle>
                    <CardDescription>Нажмите на свободную ячейку, чтобы запланировать игру.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="w-full h-[60vh]">
                        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-px bg-border">
                            {/* Header Row */}
                            <div className="sticky top-0 z-10 p-2 bg-card text-center font-semibold">Время</div>
                            {days.map(day => (
                                <div key={day.toISOString()} className="sticky top-0 z-10 p-2 bg-card text-center font-semibold text-xs sm:text-sm">
                                    <p className="capitalize">{format(day, 'E', { locale: ru })}</p>
                                    <p className="text-muted-foreground">{format(day, 'dd.MM')}</p>
                                </div>
                            ))}
                            
                            {/* Time Slots */}
                            {hours.map(hour => (
                                <div key={hour} className="grid grid-cols-1 grid-rows-2 col-start-1 bg-card">
                                    <div className="row-span-2 flex items-center justify-center border-t border-border">
                                        <span className="text-xs text-muted-foreground">{`${hour}:00`}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Main Grid for bookings and empty cells */}
                             <div className="col-start-2 col-span-7 row-start-2 row-span-[28] grid grid-cols-7 grid-rows-28 gap-px">
                                {days.map((day) => (
                                    <div key={day.toISOString()} className="relative col-span-1 grid grid-rows-28">
                                        {hours.flatMap(hour => [0, 30].map(minute => (
                                             <div key={`${hour}-${minute}`} 
                                                className="row-span-1 border-t border-l border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                                                onClick={() => handleCellClick(day, hour)}
                                            ></div>
                                        )))}
                                        {schedule
                                            .filter(booking => isSameDay(booking.startTime, day))
                                            .map(booking => {
                                                const startHour = getHours(booking.startTime);
                                                const startMinute = getMinutes(booking.startTime);
                                                const endHour = getHours(booking.endTime);
                                                const endMinute = getMinutes(booking.endTime);

                                                const startRow = (startHour - 8) * 2 + (startMinute / 30) + 1;
                                                const endRow = (endHour - 8) * 2 + (endMinute / 30) + 1;

                                                return (
                                                    <TooltipProvider key={booking.id}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div
                                                                    className="absolute col-span-1 bg-primary/20 border-l-4 border-primary p-2 rounded-r-md overflow-hidden cursor-pointer"
                                                                    style={{ gridRowStart: startRow, gridRowEnd: endRow }}
                                                                >
                                                                    <p className="text-xs font-bold text-primary truncate">{booking.team.name}</p>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{booking.team.name}</p>
                                                                <p className="text-sm text-muted-foreground">{format(booking.startTime, 'HH:mm')} - {format(booking.endTime, 'HH:mm')}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            <PlanGameDialog 
                isOpen={isPlanGameOpen}
                onOpenChange={setIsPlanGameOpen}
                playgroundName={playground.name}
                onPlan={handlePlanGame}
                initialDate={dialogInitialData?.date}
                initialTime={dialogInitialData?.time}
            />
        </>
    );
}
