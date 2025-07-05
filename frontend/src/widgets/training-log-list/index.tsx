
'use client';

import { getTrainingAnalytics } from '@/shared/lib/get-training-analytics';
import { TrainingDayCard } from '@/widgets/training-day-card';
import type { TrainingLogEntry } from '@/entities/training-program/model/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';


interface TrainingLogListProps {
    log: TrainingLogEntry[];
    onDelete: (id: string) => void;
    onCopy: (id: string) => void;
    onUpdate: (data: TrainingLogEntry) => void;
}

export function TrainingLogList({ log, onDelete, onCopy, onUpdate }: TrainingLogListProps) {
    const { personalRecords, fullExerciseHistory } = getTrainingAnalytics(log);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Предстоящие и прошедшие тренировки</CardTitle>
                <CardDescription>Записывайте результаты, чтобы отслеживать прогресс.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {log.length > 0 ? log.map(entry => (
                    <TrainingDayCard
                        key={entry.id}
                        entry={entry}
                        personalRecords={personalRecords}
                        onDelete={onDelete}
                        onCopy={onCopy}
                        onUpdate={onUpdate}
                        fullExerciseHistory={fullExerciseHistory}
                    />
                )) : (
                    <div className="text-center text-muted-foreground p-8">
                        <p>Ваш дневник пуст.</p>
                        <p className="text-sm">Выберите программу тренировок, чтобы начать.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
