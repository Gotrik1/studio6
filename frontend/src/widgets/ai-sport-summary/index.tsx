
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { BrainCircuit, AlertCircle, Lightbulb } from 'lucide-react';
import { generateSportSummary, type GenerateSportSummaryOutput } from '@/shared/api/genkit/flows/generate-sport-summary-flow';

interface AiSportSummaryProps {
    sportName: string;
}

export function AiSportSummary({ sportName }: AiSportSummaryProps) {
    const [result, setResult] = useState<GenerateSportSummaryOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const summaryData = await generateSportSummary({ sportName });
                setResult(summaryData);
            } catch (e) {
                console.error(`Failed to fetch AI summary for ${sportName}:`, e);
                setError('Не удалось загрузить сводку от AI.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [sportName]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
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
    
    if (!result) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    AI-Справка
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{result.summary}</p>
                <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Знаете ли вы?</AlertTitle>
                    <AlertDescription>
                       {result.funFact}
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}
