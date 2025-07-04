
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { trainingLogData } from '@/shared/lib/mock-data/training-log';
import { getTrainingAnalytics } from '@/shared/lib/get-training-analytics';
import { TrainingDayCard } from '@/widgets/training-day-card';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTraining } from '@/shared/context/training-provider';
import type { TrainingLogEntry } from '@/shared/lib/mock-data/training-log';
import { useToast } from '@/shared/hooks/use-toast';

export function TrainingLogPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { currentProgram } = useTraining();
    const [log, setLog] = useState<TrainingLogEntry[]>(trainingLogData);
    const { personalRecords, fullExerciseHistory } = getTrainingAnalytics(log);

    const handleCopy = (id: string) => {
        const entryToCopy = log.find(entry => entry.id === id);
        if (entryToCopy) {
            const newEntry: TrainingLogEntry = {
                ...entryToCopy,
                id: `log-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                status: 'planned',
                notes: '',
                mood: undefined
            };
            setLog(prev => [newEntry, ...prev]);
             toast({
                title: "Тренировка скопирована!",
                description: `Тренировка "${entryToCopy.workoutName}" была добавлена в ваш дневник.`
            });
        }
    };
    
    const handleDelete = (id: string) => {
        setLog(prev => prev.filter(entry => entry.id !== id));
        toast({
            title: "Тренировка удалена",
            variant: "destructive"
        });
    };

    const handleUpdate = (updatedEntry: TrainingLogEntry) => {
        setLog(prev => prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
        toast({
            title: "Тренировка завершена!",
            description: "Отличная работа! Данные сохранены."
        });
    }

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Дневник тренировок</h1>
                    <p className="text-muted-foreground">
                        Текущая программа: <strong className="text-primary">{currentProgram?.name || "Не выбрана"}</strong>
                    </p>
                </div>
                <Button onClick={() => router.push('/training/programs/new')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Создать новую программу
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Предстоящие и прошедшие тренировки</CardTitle>
                    <CardDescription>Записывайте результаты, чтобы отслеживать прогресс.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {log.map(entry => (
                        <TrainingDayCard
                            key={entry.id}
                            entry={entry}
                            personalRecords={personalRecords}
                            onDelete={handleDelete}
                            onCopy={handleCopy}
                            onUpdate={handleUpdate}
                            fullExerciseHistory={fullExerciseHistory}
                        />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
