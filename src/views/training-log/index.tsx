
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { useTraining } from '@/app/providers/training-provider';
import type { TrainingLogEntry, ExerciseLog } from '@/shared/lib/mock-data/training-log';
import { TrainingDayCard } from '@/widgets/training-day-card';
import { Dumbbell } from 'lucide-react';
import Link from 'next/link';
import { getTrainingAnalytics } from '@/shared/lib/get-training-analytics';

export function TrainingLogPage() {
    const { toast } = useToast();
    const { currentProgram } = useTraining();
    const [logEntries, setLogEntries] = useState<TrainingLogEntry[]>([]);

    useEffect(() => {
        if (currentProgram) {
            const plannedEntries = currentProgram.weeklySplit.map((day): TrainingLogEntry => {
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
                    };
                });

                return {
                    id: `${currentProgram.id}-${day.day}`,
                    date: `День ${day.day}`,
                    workoutName: day.title,
                    status: 'planned',
                    exercises,
                };
            });
            setLogEntries(plannedEntries);
        } else {
            setLogEntries([]);
        }
    }, [currentProgram]);

    const handleUpdateEntry = (updatedEntry: TrainingLogEntry) => {
        // --- New Record Detection Logic ---
        // 1. Get analytics BEFORE the update
        const oldAnalytics = getTrainingAnalytics(logEntries.filter(e => e.status === 'completed'));
        const oldPRs = new Map(oldAnalytics.personalRecords.map(pr => [pr.exercise, pr.e1RM]));

        // 2. Prepare the updated list of entries
        const updatedEntries = logEntries.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry));
        
        // 3. Get analytics AFTER the update
        const newAnalytics = getTrainingAnalytics(updatedEntries.filter(e => e.status === 'completed'));
        
        // 4. Check for new PRs
        newAnalytics.personalRecords.forEach(newPR => {
            const oldPRValue = oldPRs.get(newPR.exercise) || 0;
            if (newPR.e1RM > oldPRValue) {
                // New PR found!
                setTimeout(() => {
                    toast({
                        title: `Новый рекорд! 🎉`,
                        description: `Вы установили новый личный рекорд в упражнении "${newPR.exercise}": ${newPR.e1RM} кг!`,
                        duration: 6000,
                    });
                }, 500); // Delay to show after main toast
            }
        });
        // --- End of New Record Detection Logic ---

        setLogEntries(prev => prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry)));
        toast({
            title: 'Тренировка завершена!',
            description: `Данные для "${updatedEntry.workoutName}" сохранены.`,
        });
    };

    const handleDelete = (id: string) => {
        toast({ title: 'Действие недоступно', description: 'Запланированные тренировки нельзя удалить.' });
    };

    const handleCopy = (id: string) => {
        toast({ title: 'Действие недоступно', description: 'Запланированные тренировки нельзя скопировать.' });
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
                            allEntries={logEntries}
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
