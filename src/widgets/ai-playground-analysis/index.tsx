'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { BrainCircuit, AlertCircle, Sparkles, ThumbsUp, ThumbsDown, Target } from 'lucide-react';
import { analyzePlaygroundDetails, type AnalyzePlaygroundDetailsOutput } from '@/shared/api/genkit/flows/analyze-playground-details-flow';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';

interface AiPlaygroundAnalysisProps {
    playground: Playground;
}

export function AiPlaygroundAnalysis({ playground }: AiPlaygroundAnalysisProps) {
    const [result, setResult] = useState<AnalyzePlaygroundDetailsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!playground) return;
            setIsLoading(true);
            setError(null);
            try {
                const summaryData = await analyzePlaygroundDetails({
                    name: playground.name,
                    type: playground.type,
                    surface: playground.surface,
                    features: playground.features,
                    rating: playground.rating,
                });
                setResult(summaryData);
            } catch (e) {
                console.error(`Failed to fetch AI analysis for ${playground.name}:`, e);
                setError('Не удалось загрузить AI-анализ.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [playground]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        );
    }
    
    if (error || !result) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error || 'Не удалось загрузить AI-анализ.'}</AlertDescription>
            </Alert>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    AI-Анализ площадки
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                    <p className="font-bold text-lg">{result.title}</p>
                    <p className="text-sm italic text-muted-foreground">&quot;{result.vibe}&quot;</p>
                </div>

                 <div className="space-y-1">
                    <h4 className="font-semibold text-sm flex items-center gap-1.5"><Target className="h-4 w-4"/> Идеально для:</h4>
                    <p className="text-sm text-muted-foreground">{result.bestFor}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-1.5 text-green-600"><ThumbsUp className="h-4 w-4"/> Плюсы:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {result.pros.map((pro, i) => <li key={`pro-${i}`}>{pro}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-1.5 text-red-600"><ThumbsDown className="h-4 w-4"/> Минусы:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {result.cons.map((con, i) => <li key={`con-${i}`}>{con}</li>)}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
