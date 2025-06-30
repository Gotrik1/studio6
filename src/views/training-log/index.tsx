
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { trainingLogData as initialLog, type TrainingLogEntry } from '@/shared/lib/mock-data/training-log';
import { TrainingDayCard } from '@/widgets/training-day-card';
import { History } from 'lucide-react';

export function TrainingLogPage() {
    const { toast } = useToast();
    const [logEntries, setLogEntries] = useState<TrainingLogEntry[]>(initialLog);

    const handleCopyYesterday = () => {
        const lastCompleted = logEntries.find(entry => entry.status === 'completed');
        if (lastCompleted) {
            toast({
                title: 'Тренировка скопирована!',
                description: `Тренировка "${lastCompleted.workoutName}" добавлена на сегодня.`,
            });
            // In a real app, this would create a new entry
        } else {
            toast({
                variant: 'destructive',
                title: 'Не найдено',
                description: 'Нет завершенных тренировок для копирования.',
            });
        }
    };

    const handleDelete = (id: string) => {
        setLogEntries(prev => prev.filter(entry => entry.id !== id));
        toast({ title: 'Запись удалена' });
    };

    const handleCopy = (id: string) => {
        const entryToCopy = logEntries.find(entry => entry.id === id);
        if (entryToCopy) {
            toast({
                title: 'Запись скопирована',
                description: `Тренировка "${entryToCopy.workoutName}" готова для добавления в ваш план.`,
            });
        }
    };
    
    const handleUpdateEntry = (updatedEntry: TrainingLogEntry) => {
        setLogEntries(prev => prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
        toast({
            title: 'Тренировка завершена!',
            description: `Данные для "${updatedEntry.workoutName}" сохранены.`,
        });
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Дневник тренировок</h1>
                    <p className="text-muted-foreground">
                        Заполняйте данные, чтобы отслеживать свой прогресс. Кликните на карточку, чтобы начать.
                    </p>
                </div>
                <Button onClick={handleCopyYesterday}>
                    <History className="mr-2 h-4 w-4" />
                    Сделать как вчера
                </Button>
            </div>

            <Card>
                <CardContent className="p-4 space-y-4">
                    {logEntries.map(entry => (
                        <TrainingDayCard
                            key={entry.id}
                            entry={entry}
                            onDelete={handleDelete}
                            onCopy={handleCopy}
                            onUpdate={handleUpdateEntry}
                        />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
