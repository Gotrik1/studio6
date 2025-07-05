'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { BrainCircuit, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { getPlaygroundReviewSummary, type ReviewSummary } from '@/entities/playground/api/review-summary';


interface PlaygroundReviewSummaryProps {
    playgroundId: string;
}

export function PlaygroundReviewSummary({ playgroundId }: PlaygroundReviewSummaryProps) {
    const [result, setResult] = useState<ReviewSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!playgroundId) {
                setIsLoading(false);
                return;
            };
            setIsLoading(true);
            setError(null);
            try {
                const summaryData = await getPlaygroundReviewSummary(playgroundId);
                setResult(summaryData);
            } catch (e) {
                console.error('Failed to fetch AI summary for reviews:', e);
                setError('Не удалось загрузить AI-сводку.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [playgroundId]);
    
    if (isLoading) {
        return (
             <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                     <Skeleton className="h-6 w-1/3" />
                     <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        );
    }
    
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }
    
    if (!result || (result.pros.length === 0 && result.cons.length === 0)) {
        return null; // Don't show the card if there's nothing to summarize
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    Вердикт сообщества (AI)
                </CardTitle>
                <CardDescription>Краткая выжимка из всех отзывов игроков.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-2xl font-bold">
                        Рейтинг: {result.averageRating.toFixed(1)} / 5.0
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5 text-green-600"><ThumbsUp className="h-4 w-4"/> Плюсы:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {result.pros.map((pro, i) => <li key={`pro-${i}`}>{pro}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5 text-red-600"><ThumbsDown className="h-4 w-4"/> Минусы:</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {result.cons.map((con, i) => <li key={`con-${i}`}>{con}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
