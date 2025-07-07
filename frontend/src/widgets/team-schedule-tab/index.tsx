

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Calendar, PlusCircle, MapPin, Trash2 } from 'lucide-react';
import { SchedulePracticeDialog, type FormValues } from '@/widgets/schedule-practice-dialog';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getTeamPractices, createTeamPractice } from '@/entities/team/api/practices';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/shared/ui/skeleton';
import { useToast } from '@/shared/hooks/use-toast';

type BackendPractice = {
    id: string;
    title: string;
    description: string;
    date: string; // ISO string
    playground?: { name: string } | null;
    playgroundId: string;
};

type TeamPractice = {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    playgroundId: string;
};

export function TeamScheduleTab() {
    const params = useParams<{ slug: string }>();
    const teamId = params.slug; // slug is used as id in this context
    const { toast } = useToast();
    const [practices, setPractices] = useState<TeamPractice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchPractices = useCallback(async () => {
        if (!teamId) return;
        setIsLoading(true);
        const result = await getTeamPractices(teamId as string);
        if (result.success && Array.isArray(result.data)) {
            setPractices(result.data.map((p: BackendPractice) => ({
                id: p.id,
                title: p.title,
                description: p.description,
                date: new Date(p.date),
                location: p.playground?.name || 'Место не указано',
                playgroundId: p.playgroundId,
            })));
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить расписание.' });
        }
        setIsLoading(false);
    }, [teamId, toast]);

    useEffect(() => {
        if (teamId) {
            fetchPractices();
        }
    }, [teamId, fetchPractices]);

    const handleSchedule = async (data: FormValues) => {
        const [hours, minutes] = data.time.split(':').map(Number);
        const combinedDate = new Date(data.date);
        combinedDate.setHours(hours, minutes, 0, 0);

        const payload = {
            title: data.title,
            description: data.description,
            date: combinedDate,
            playgroundId: data.playgroundId,
        };
        
        const result = await createTeamPractice(teamId as string, payload);
        if (result.success) {
            toast({ title: 'Тренировка запланирована!', description: 'Новая тренировка добавлена в расписание.' });
            await fetchPractices();
            return true;
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: result.error || 'Не удалось запланировать тренировку.' });
            return false;
        }
    };

    const handleDelete = (id: string) => {
        // In real app, call API to delete
        setPractices(prev => prev.filter(p => p.id !== id));
        toast({ title: 'Тренировка отменена' });
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
                    {isLoading ? (
                         <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    ) : practices.length > 0 ? (
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
