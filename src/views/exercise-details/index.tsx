
'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { AlertTriangle, CheckCircle, LineChart, Award, TrendingUp, Video } from 'lucide-react';
import { trainingLogData } from '@/shared/lib/mock-data/training-log';
import { getTrainingAnalytics } from '@/shared/lib/get-training-analytics';
import { PersonalRecordHistoryChart } from '@/widgets/analytics-charts/personal-record-chart';
import { ExerciseHistoryTable } from '@/widgets/exercise-history-table';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Exercise } from '@/shared/lib/mock-data/exercises';

interface ExerciseDetailsPageProps {
    exercise: Exercise;
}

export function ExerciseDetailsPage({ exercise }: ExerciseDetailsPageProps) {
    const { personalRecords, recordHistory, fullExerciseHistory } = useMemo(() => getTrainingAnalytics(trainingLogData), []);

    const record = personalRecords.find(pr => pr.exercise === exercise.name);
    const history1RM = record ? recordHistory[record.exercise] || [] : [];
    const fullHistory = record ? fullExerciseHistory[record.exercise] || [] : [];

    const firstRecord = history1RM.length > 0 ? history1RM[0] : null;
    const growth = (record && firstRecord && firstRecord.e1RM > 0)
        ? (((record.e1RM - firstRecord.e1RM) / firstRecord.e1RM) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">{exercise.name}</h1>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{exercise.muscleGroup}</Badge>
                    <Badge variant="outline">{exercise.equipment}</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardHeader className="p-0">
                             <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                <Image 
                                    src={exercise.image} 
                                    alt={exercise.name} 
                                    fill 
                                    className="object-cover"
                                    data-ai-hint={exercise.imageHint}
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <Video className="h-12 w-12 text-white/70" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        </CardContent>
                    </Card>

                    {record && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><LineChart className="h-5 w-5 text-primary" />Динамика рекорда</CardTitle>
                                <p className="text-sm text-muted-foreground">Прогресс вашего одноповторного максимума (1ПМ).</p>
                            </CardHeader>
                            <CardContent>
                                <PersonalRecordHistoryChart data={history1RM} />
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Личный рекорд</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {record ? (
                                <>
                                    <div className="p-4 bg-muted rounded-lg text-center">
                                        <p className="text-sm text-muted-foreground">Текущий рекорд (1ПМ)</p>
                                        <p className="text-3xl font-bold flex items-center justify-center gap-1">
                                            <Award className="h-6 w-6 text-amber-500" />
                                            {record.e1RM} кг
                                        </p>
                                        <p className="text-xs text-muted-foreground">({record.reps}x{record.weight}кг on {format(new Date(record.date), 'd MMM yyyy', { locale: ru })})</p>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium">Первый замер</span>
                                        <span>{firstRecord?.e1RM || '-'} кг</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium">Общий рост</span>
                                        <span className="font-bold text-green-500 flex items-center gap-1"><TrendingUp className="h-4 w-4" />{growth}%</span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center p-4">Нет данных о рекордах для этого упражнения. Начните вести дневник!</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Техника</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {exercise.techniqueTips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                             <CardTitle className="text-base font-semibold flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-500" /> Ошибки</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {exercise.commonMistakes.map((mistake, i) => <li key={i}>{mistake}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            {fullHistory.length > 0 && (
                <ExerciseHistoryTable sessions={fullHistory} exerciseName={exercise.name} />
            )}

        </div>
    );
}
