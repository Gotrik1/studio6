
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import Image from 'next/image';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { MapPin, Check, Star, User, Home, Sparkles, Send, Calendar, Clock, PlusCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { useToast } from '@/shared/hooks/use-toast';
import { playgroundSchedule, type PlaygroundBooking } from '@/shared/lib/mock-data/playground-schedule';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PlanGameDialog } from '@/widgets/plan-game-dialog';

export function PlaygroundDetails({ playground }: { playground: Playground }) {
    const { toast } = useToast();
    const [schedule, setSchedule] = useState(playgroundSchedule.filter(s => s.playgroundId === playground.id));
    const [isPlanGameOpen, setIsPlanGameOpen] = useState(false);

    const handleSetHome = () => {
        toast({
            title: 'Домашняя площадка установлена!',
            description: `Площадка "${playground.name}" теперь ваша домашняя.`
        });
    };

    const handlePlanGame = (data: { date: Date, time: string, duration: number }) => {
        const [hours, minutes] = data.time.split(':').map(Number);
        const startTime = new Date(data.date);
        startTime.setHours(hours, minutes, 0, 0);
        
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

    return (
        <>
            <div className="space-y-6">
                <Card className="overflow-hidden">
                    <div className="relative h-64 w-full">
                        <Image src={playground.coverImage} alt={playground.name} fill className="object-cover" data-ai-hint={playground.coverImageHint}/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <Badge variant="secondary">{playground.type}</Badge>
                            <h1 className="font-headline text-4xl font-bold mt-1">{playground.name}</h1>
                            <p className="flex items-center gap-2 mt-1"><MapPin className="h-4 w-4" /> {playground.address}</p>
                        </div>
                    </div>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex-row items-center justify-between">
                                 <div>
                                    <CardTitle>Расписание на сегодня</CardTitle>
                                    <CardDescription>Кто планирует играть здесь в ближайшее время.</CardDescription>
                                </div>
                                <Button onClick={() => setIsPlanGameOpen(true)}>
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
                                                    <Avatar className="h-8 w-8"><AvatarImage src={booking.team.avatar} alt={booking.team.name} data-ai-hint={booking.team.avatarHint} /><AvatarFallback>{booking.team.name.charAt(0)}</AvatarFallback></Avatar>
                                                    <p className="font-medium text-sm">{booking.team.name}</p>
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
                        <Card>
                            <CardHeader><CardTitle>AI-сводка по площадке</CardTitle></CardHeader>
                            <CardContent>
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                    <p className="text-sm italic text-muted-foreground flex items-start gap-3">
                                        <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                        <span>
                                            Это популярное место для вечерних игр, особенно по выходным. Судя по отзывам, газон в хорошем состоянии, но освещение может быть неравномерным. Рекомендуем приходить со своей компанией, так как площадка часто занята.
                                        </span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card>
                           <CardHeader><CardTitle>Основная информация</CardTitle></CardHeader>
                           <CardContent className="space-y-3 text-sm">
                               <div className="flex justify-between"><span>Покрытие:</span><span className="font-semibold">{playground.surface}</span></div>
                               <div className="flex justify-between"><span>Рейтинг:</span><span className="font-semibold flex items-center gap-1">{playground.rating}/5.0 <Star className="h-4 w-4 text-amber-500"/></span></div>
                               <div className="flex justify-between"><span>Чекинов:</span><span className="font-semibold">{playground.checkIns}</span></div>
                               <div>
                                   <p>Особенности:</p>
                                   <div className="flex flex-wrap gap-2 mt-1">
                                       {playground.features.map(f => <Badge key={f}>{f}</Badge>)}
                                   </div>
                               </div>
                           </CardContent>
                        </Card>
                         <Card>
                           <CardHeader><CardTitle>Создатель</CardTitle></CardHeader>
                           <CardContent className="flex items-center gap-3">
                               <Avatar><AvatarImage src={playground.creator.avatar} /><AvatarFallback>{playground.creator.name.charAt(0)}</AvatarFallback></Avatar>
                               <p className="font-semibold">{playground.creator.name}</p>
                           </CardContent>
                         </Card>
                         <div className="space-y-2">
                           <Button className="w-full" onClick={handleSetHome}><Home className="mr-2 h-4 w-4"/> Сделать домашней</Button>
                         </div>
                    </div>
                </div>
            </div>
            <PlanGameDialog 
                isOpen={isPlanGameOpen}
                onOpenChange={setIsPlanGameOpen}
                playgroundName={playground.name}
                onPlan={handlePlanGame}
            />
        </>
    );
}
