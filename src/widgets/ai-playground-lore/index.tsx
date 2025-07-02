'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { generatePlaygroundLore, type GeneratePlaygroundLoreOutput } from '@/shared/api/genkit/flows/generate-playground-lore';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';

interface AiPlaygroundLoreProps {
    playground: Playground;
}

// Mock data, in a real app this would be fetched
const loreData = {
    topPlayer: 'Superuser',
    topTeam: 'Дворовые Атлеты',
};

export function AiPlaygroundLore({ playground }: AiPlaygroundLoreProps) {
    const [result, setResult] = useState<GeneratePlaygroundLoreOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLore = async () => {
            if (!playground) return;
            setIsLoading(true);
            setError(null);
            try {
                const loreResult = await generatePlaygroundLore({
                    playgroundName: playground.name,
                    checkIns: playground.checkIns,
                    ...loreData
                });
                setResult(loreResult);
            } catch (e) {
                console.error(`Failed to fetch AI lore for ${playground.name}:`, e);
                setError('Не удалось загрузить историю площадки.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLore();
    }, [playground]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Легенды площадки
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
                            <span>{result.lore}</span>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
