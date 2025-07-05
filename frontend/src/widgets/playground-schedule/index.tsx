
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Calendar, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { format } from 'date-fns';
import type { LfgLobby } from '@/shared/context/lfg-provider';

interface PlaygroundScheduleProps {
    schedule: LfgLobby[];
    onPlanClick: () => void;
}

export function PlaygroundSchedule({ schedule, onPlanClick }: PlaygroundScheduleProps) {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                 <div>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Расписание на сегодня
                    </CardTitle>
                    <CardDescription>Кто планирует играть здесь в ближайшее время.</CardDescription>
                </div>
                <Button onClick={onPlanClick}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Запланировать игру
                </Button>
            </CardHeader>
            <CardContent>
                {schedule.length > 0 ? (
                    <div className="space-y-3">
                        {schedule.map(booking => (
                            <div key={booking.id} className="flex items-center gap-4 rounded-md border p-3">
                                <div className="flex flex-col items-center w-16 text-center">
                                    <p className="font-bold">{format(booking.startTime, 'HH:mm')}</p>
                                    <p className="text-xs text-muted-foreground">до {format(booking.endTime, 'HH:mm')}</p>
                                </div>
                                <div className="h-10 w-px bg-border" />
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8"><AvatarImage src={booking.creator.avatar || ''} alt={booking.creator.name} data-ai-hint="user avatar" /><AvatarFallback>{booking.creator.name.charAt(0)}</AvatarFallback></Avatar>
                                    <p className="font-medium text-sm">{booking.creator.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>На сегодня игр не запланировано.</p>
                        <p className="text-sm">Будьте первыми!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
