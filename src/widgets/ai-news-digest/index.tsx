'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { generatePlatformNews, type GeneratePlatformNewsOutput } from '@/shared/api/genkit/flows/generate-platform-news-flow';
import Link from "next/link";
import { Sparkles, Loader2, AlertCircle, Newspaper, Users, Trophy, User } from "lucide-react";
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';
import type { LucideIcon } from 'lucide-react';

const categoryIconMap: { [key: string]: LucideIcon } = {
    match: Trophy,
    team: Users,
    player: User,
    platform: Newspaper,
};

export function AiNewsDigest() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [news, setNews] = useState<GeneratePlatformNewsOutput['news'] | null>(null);

    const handleGenerateNews = async () => {
        setIsLoading(true);
        setError(null);
        setNews(null);
        try {
            const result = await generatePlatformNews();
            setNews(result.news);
        } catch (e) {
            console.error(e);
            setError("Не удалось сгенерировать новостную сводку. Попробуйте еще раз.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Новостная сводка от AI</CardTitle>
                <CardDescription>Самые важные события на платформе, отобранные искусственным интеллектом.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                {news && (
                    <div className="space-y-4">
                        {news.map((item, index) => {
                             const Icon = categoryIconMap[item.category] || Newspaper;
                             return (
                                <Link href={item.href} key={index} className="block">
                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                                        <Icon className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-semibold">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">{item.summary}</p>
                                        </div>
                                    </div>
                                </Link>
                             )
                        })}
                    </div>
                )}

                {!isLoading && !news && !error && (
                     <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-semibold mb-2">Получите свежую сводку</p>
                        <p className="text-sm text-muted-foreground mb-4">Нажмите кнопку, чтобы AI проанализировал последние события.</p>
                        <Button onClick={handleGenerateNews}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Сгенерировать новости
                        </Button>
                    </div>
                )}

                 {news && (
                    <div className="text-center pt-4 border-t">
                        <Button onClick={handleGenerateNews} variant="outline" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                            Обновить сводку
                        </Button>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
