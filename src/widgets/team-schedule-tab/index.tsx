'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Calendar, PlusCircle, MapPin, Trash2 } from 'lucide-react';
import { teamPractices as initialPractices, type TeamPractice } from '@/shared/lib/mock-data/team-practices';
import { SchedulePracticeDialog } from '@/widgets/schedule-practice-dialog';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { playgroundsList } from '@/shared/lib/mock-data/playgrounds';

export function TeamScheduleTab() {
    const [practices, setPractices] = useState<TeamPractice[]>(initialPractices);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSchedule = (data: Omit<TeamPractice, 'id' | 'location' | 'date'> & { date: Date }) => {
        const playground = playgroundsList.find(p => p.id === data.playgroundId);
        const newPractice: TeamPractice = {
            id: `practice-${Date.now()}`,
            ...data,
            location: playground?.name || 'Неизвестная площадка',
        };
        setPractices(prev => [...prev, newPractice].sort((a,b) => a.date.getTime() - b.date.getTime()));
    };

    const handleDelete = (id: string) => {
        setPractices(prev => prev.filter(p => p.id !== id));
    };

    return (
        <>
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Расписание тренировок</CardTitle>
                        <CardDescription>Планируйте и отслеживайте командные тренировки.</CardDescription>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Запланировать
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {practices.length > 0 ? (
                        practices.map(practice => (
                            <Card key={practice.id} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-bold">{practice.title}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> {format(practice.date, 'd MMMM yyyy, HH:mm', { locale: ru })}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> {practice.location}</p>
                                        <p className="text-sm text-muted-foreground pt-2">{practice.description}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(practice.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>У команды нет запланированных тренировок.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <SchedulePracticeDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSchedule={handleSchedule}
            />
        </>
    );
}
