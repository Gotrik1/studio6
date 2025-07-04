'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Bot, AlertCircle, RefreshCw, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';
import type { NewsWithAudio } from '@/shared/api/genkit/flows/schemas/generate-platform-news-schema';

async function fetchDashboardNews(): Promise<NewsWithAudio> {
    const response = await fetch('/api/ai/dashboard-news', {
        cache: 'no-store'
    });
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard news');
    }
    return response.json();
}


export function AiNewsDigest() {
    const [data, setData] = useState<NewsWithAudio | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleFetchNews = async () => {
        setIsLoading(true);
        setError(null);
        setData(null);
        try {
            const newsData = await fetchDashboardNews();
            setData(newsData);
        } catch (e) {
            console.error('Failed to fetch AI news:', e);
            setError('Не удалось загрузить новостную сводку.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleFetchNews();
    }, []);

    if (isLoading) {
        return <Skeleton className="w-full h-[320px]" />;
    }

    if (error) {
        return (
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot /> AI-Дайджест</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                        <div className="mt-4">
                            <Button variant="outline" size="sm" onClick={handleFetchNews}>Попробовать снова</Button>
                        </div>
                    </Alert>
                </CardContent>
            </Card>
        );
    }
    
    if (!data) return null;

    return (
        <Card className="mx-1 border-primary/20 bg-primary/5 shadow-none">
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-6 w-6 text-primary" />
                        AI-Дайджест
                    </CardTitle>
                    <CardDescription>Свежая сводка событий на платформе.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={handleFetchNews} disabled={isLoading}>
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-3">
                    {data.news.map((item, index) => (
                        <Link key={index} href={item.href} className="block p-3 rounded-lg hover:bg-background/50 transition-colors">
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.summary}</p>
                                </div>
                                <Badge variant="secondary">{item.category}</Badge>
                            </div>
                        </Link>
                    ))}
                 </div>
                 {data.audioDataUri && (
                    <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-3 sm:flex-row">
                        <Volume2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">Аудио-версия:</span>
                        <audio controls src={data.audioDataUri} className="w-full flex-1" />
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
