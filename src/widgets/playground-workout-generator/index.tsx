
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { BrainCircuit, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { generatePlaygroundWorkout, type GeneratePlaygroundWorkoutOutput } from '@/shared/api/genkit/flows/generate-playground-workout-flow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';

interface PlaygroundWorkoutGeneratorProps {
    playground: Playground;
}

export function PlaygroundWorkoutGenerator({ playground }: PlaygroundWorkoutGeneratorProps) {
    const [result, setResult] = useState<GeneratePlaygroundWorkoutOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const workoutData = await generatePlaygroundWorkout({ 
                equipment: playground.features,
                playgroundType: playground.type
             });
            setResult(workoutData);
        } catch (e) {
            console.error('Failed to generate workout:', e);
            setError('Не удалось сгенерировать тренировку.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    AI-Генератор тренировок
                </CardTitle>
                 <CardDescription>Сгенерируйте тренировку или занятие, подходящее для этого места.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                    </div>
                )}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {result && (
                    <div className="space-y-4 animate-in fade-in-50">
                        <h3 className="font-bold text-lg">{result.title}</h3>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Упражнение/Дрилл</TableHead>
                                    <TableHead className="text-center">Подходы</TableHead>
                                    <TableHead className="text-center">Повторения/Время</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.exercises.map((ex, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{ex.name}</TableCell>
                                        <TableCell className="text-center">{ex.sets}</TableCell>
                                        <TableCell className="text-center">{ex.reps}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button className="w-full" onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {result ? "Сгенерировать заново" : "Сгенерировать тренировку"}
                </Button>
            </CardFooter>
        </Card>
    );
}
