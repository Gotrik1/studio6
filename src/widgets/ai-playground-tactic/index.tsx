
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { BrainCircuit, AlertCircle, Sparkles, Loader2, ListChecks } from 'lucide-react';
import { generatePlaygroundTactic, type GeneratePlaygroundTacticOutput } from '@/shared/api/genkit/flows/generate-playground-tactic-flow';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';

interface AiPlaygroundTacticProps {
    playground: Playground;
}

// Mock team data for demo
const mockTeamData = {
    playstyle: 'Быстрые контратаки, игра в пас',
};

export function AiPlaygroundTactic({ playground }: AiPlaygroundTacticProps) {
    const [result, setResult] = useState<GeneratePlaygroundTacticOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const tacticData = await generatePlaygroundTactic({
                playgroundType: playground.type,
                playgroundFeatures: playground.features,
                teamPlaystyle: mockTeamData.playstyle,
            });
            setResult(tacticData);
        } catch (e) {
            console.error('Failed to generate tactic:', e);
            setError('Не удалось сгенерировать тактику.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    AI-Тактик
                </CardTitle>
                 <CardDescription>Сгенерируйте тактическую схему для вашей команды с учетом особенностей этой площадки.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && <Skeleton className="h-24 w-full" />}
                {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                {result && (
                    <div className="space-y-4 animate-in fade-in-50">
                        <h3 className="font-bold text-lg">{result.tacticName}</h3>
                        <p className="text-sm text-muted-foreground italic">&quot;{result.tacticDescription}&quot;</p>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm flex items-center gap-1.5"><ListChecks className="h-4 w-4" />Ключевые моменты:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {result.keyPoints.map((point, i) => <li key={`point-${i}`}>{point}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button className="w-full" onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {result ? "Сгенерировать другую" : "Сгенерировать тактику"}
                </Button>
            </CardFooter>
        </Card>
    );
}
