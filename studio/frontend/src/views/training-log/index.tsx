
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { useTraining } from '@/shared/context/training-provider';
import { trainingLogData as initialLogData, type TrainingLogEntry, type ExerciseLog } from '@/shared/lib/mock-data/training-log';
import { TrainingDayCard } from '@/widgets/training-day-card';
import { Dumbbell } from 'lucide-react';
import Link from 'next/link';
import { getTrainingAnalytics } from '@/shared/lib/get-training-analytics';

export function TrainingLogPage() {
    const { toast } = useToast();
    const { currentProgram } = useTraining();
    const [logEntries, setLogEntries] = useState<TrainingLogEntry[]>(initialLogData);

    const { personalRecords, fullExerciseHistory } = useMemo(() => getTrainingAnalytics(logEntries.filter(e => e.status === 'completed')), [logEntries]);

    useEffect(() => {
        if (currentProgram) {
            const today = new Date();
            const plannedEntries = currentProgram.weeklySplit.map((day, index): TrainingLogEntry => {
                const exercises: ExerciseLog[] = day.exercises.map(ex => {
                    const numSets = parseInt(ex.sets.split('-')[0], 10) || 3;
                    return {
                        name: ex.name,
                        notes: '',
                        sets: Array.from({ length: numSets }, () => ({
                            plannedReps: ex.reps,
                            plannedWeight: ex.plannedWeight || '',
                            isCompleted: false,
                        })),
                        isSupersetWithPrevious: ex.isSupersetWithPrevious,
                        technique: ex.technique,
                    };
                });
                
                const workoutDate = new Date(today);
                workoutDate.setDate(today.getDate() + index);

                return {
                    id: `${currentProgram.id}-${day.day}`,
                    date: workoutDate.toISOString().split('T')[0],
                    workoutName: day.title,
                    status: 'planned',
                    exercises,
                };
            });
            
            const historicalEntries = initialLogData.filter(e => e.status !== 'planned');
            setLogEntries([...historicalEntries, ...plannedEntries].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        } else {
            setLogEntries(initialLogData.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        }
    }, [currentProgram]);

    const handleUpdateEntry = (updatedEntry: TrainingLogEntry) => {
        const oldAnalytics = getTrainingAnalytics(logEntries.filter(e => e.status === 'completed'));
        const oldPRs = new Map(oldAnalytics.personalRecords.map(pr => [pr.exercise, pr.e1RM]));

        const updatedEntries = logEntries.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry));
        
        const newAnalytics = getTrainingAnalytics(updatedEntries.filter(e => e.status === 'completed'));
        
        newAnalytics.personalRecords.forEach(newPR => {
            const oldPRValue = oldPRs.get(newPR.exercise) || 0;
            if (newPR.e1RM > oldPRValue) {
                setTimeout(() => {
                    toast({
                        title: `Новый рекорд! 🎉`,
                        description: `Вы установили новый личный рекорд в упражнении "${newPR.exercise}": ${newPR.e1RM} кг!`,
                        duration: 6000,
                    });
                }, 500); 
            }
        });

        setLogEntries(prev => prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry)));
        toast({
            title: 'Тренировка завершена!',
            description: `Данные для "${updatedEntry.workoutName}" сохранены.`,
        });
    };

    const handleDelete = (id: string) => {
        setLogEntries(prev => prev.filter(e => e.id !== id));
        toast({ title: 'Запись удалена' });
    };

    const handleCopy = (id: string) => {
        const entryToCopy = logEntries.find(e => e.id === id);
        if (entryToCopy) {
            const newEntry = {
                ...JSON.parse(JSON.stringify(entryToCopy)),
                id: `copy-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                status: 'planned' as const
            };
            setLogEntries(prev => [...prev, newEntry].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            toast({ title: 'Тренировка скопирована' });
        }
    };

    if (!currentProgram) {
        return (
            <div className="flex items-center justify-center h-[50vh] opacity-0 animate-fade-in-up">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="p-8">
                        <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">Нет активной программы</h3>
                        <p className="text-muted-foreground mt-2 mb-4">
                            Чтобы начать вести дневник, пожалуйста, выберите программу тренировок.
                        </p>
                        <Button asChild>
                            <Link href="/training/programs">Выбрать программу</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Дневник тренировок</h1>
                <p className="text-muted-foreground">
                    Ваш план на неделю. Выполняйте тренировки и записывайте результаты.
                </p>
            </div>

            <Card>
                <CardContent className="p-4 space-y-4">
                    {logEntries.map(entry => (
                        <TrainingDayCard
                            key={entry.id}
                            entry={entry}
                            personalRecords={personalRecords}
                            fullExerciseHistory={fullExerciseHistory}
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
