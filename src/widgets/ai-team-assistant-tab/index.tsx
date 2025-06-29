
'use client';

import { useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useToast } from "@/shared/hooks/use-toast";
import { BrainCircuit, Loader2, Sparkles, Lightbulb, BarChart3, AlertCircle } from "lucide-react";
import { aiTeamAssistant, type AiTeamAssistantOutput } from '@/shared/api/genkit/flows/ai-team-assistant';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';

const mockTeamActivity = "Последние матчи: победа 13-5, поражение 10-13. Обсуждение в чате: низкая координация при выходе на точку А. Игрок 'Beast' показал низкий KDA в последних играх.";
const mockTeamGoals = "Наша главная цель - выйти в финал осеннего турнира. Нужно улучшить командную игру и подтянуть индивидуальный скилл игроков на роли стража.";

export function AITeamAssistantTab() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AiTeamAssistantOutput | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const assistantResult = await aiTeamAssistant({
                teamActivity: mockTeamActivity,
                teamGoals: mockTeamGoals,
            });
            setResult(assistantResult);
            toast({ title: 'Сводка сгенерирована!', description: 'AI-ассистент проанализировал данные вашей команды.' });
        } catch (e) {
            console.error(e);
            setError('Не удалось получить данные от AI-ассистента.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI-Ассистент Команды</CardTitle>
                <CardDescription>Получите автоматическую сводку и рекомендации по развитию команды на основе последних данных.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {!result && !isLoading && (
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="font-semibold mb-2">Готовы получить инсайты?</p>
                        <p className="text-sm text-muted-foreground mb-4">Нажмите на кнопку, чтобы ИИ проанализировал активность команды.</p>
                        <Button onClick={handleGenerate}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Сгенерировать сводку
                        </Button>
                    </div>
                )}
                
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
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
                     <div className="space-y-6">
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Сводка активности</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{result.summary}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary" /> Рекомендации</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-line">{result.suggestions}</p>
                            </CardContent>
                        </Card>
                         <div className="text-center">
                            <Button variant="outline" onClick={handleGenerate} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                Сгенерировать заново
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
