'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { BrainCircuit, AlertCircle, Sparkles } from 'lucide-react';
import { generatePlaygroundSummary, type GeneratePlaygroundSummaryOutput } from '@/shared/api/genkit/flows/generate-playground-summary-flow';
import type { Playground } from '@/entities/playground/model/types';

interface AiPlaygroundSummaryProps {
    playground: Playground;
}

export function AiPlaygroundSummary({ playground }: AiPlaygroundSummaryProps) {
    const [result, setResult] = useState<GeneratePlaygroundSummaryOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!playground) return;
            setIsLoading(true);
            setError(null);
            try {
                const summaryData = await generatePlaygroundSummary({
                    name: playground.name,
                    address: playground.address,
                    surface: playground.surface,
                    features: playground.features,
                });
                setResult(summaryData);
            } catch (e) {
                console.error(`Failed to fetch AI summary for ${playground.name}:`, e);
                setError('Не удалось загрузить сводку от AI.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [playground]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    AI-сводка по площадке
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
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
                     <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-sm italic text-muted-foreground flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <span>{result.summary}</span>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
