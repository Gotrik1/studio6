'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Textarea } from '@/shared/ui/textarea';
import { Loader2, Sparkles, Lightbulb, BarChartHorizontal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Skeleton } from '@/shared/ui/skeleton';
import { analyzeContent, type AnalyzeContentOutput } from '@/shared/api/genkit/flows/analyze-content-generation';
import { generateContent, type GenerateContentOutput } from '@/shared/api/genkit/flows/generate-content-flow';
import { Badge } from '@/shared/ui/badge';

export function AiAnalysisPage() {
    // State for Analysis
    const [analysisPrompt, setAnalysisPrompt] = useState('Наша команда вчера проиграла, но мы не сдаемся и будем тренироваться еще усерднее, чтобы победить в следующий раз!');
    const [analysisContentType, setAnalysisContentType] = useState('Комментарий');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeContentOutput | null>(null);

    // State for Generation
    const [generationPrompt, setGenerationPrompt] = useState('анонс нового турнира по Valorant');
    const [generationContentType, setGenerationContentType] = useState('Новостной пост');
    const [generationTone, setGenerationTone] = useState('Восторженный');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [generationResult, setGenerationResult] = useState<GenerateContentOutput | null>(null);


    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult(null);
        try {
            const result = await analyzeContent({ content: analysisPrompt, contentType: analysisContentType });
            setAnalysisResult(result);
        } catch (e) {
            console.error(e);
            setAnalysisError('Не удалось проанализировать контент. Пожалуйста, попробуйте еще раз.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGenerationError(null);
        setGenerationResult(null);
        try {
            const result = await generateContent({ topic: generationPrompt, contentType: generationContentType, tone: generationTone });
            setGenerationResult(result);
        } catch (e) {
            console.error(e);
            setGenerationError('Не удалось сгенерировать контент. Пожалуйста, попробуйте еще раз.');
        } finally {
            setIsGenerating(false);
        }
    };

    const getSentimentBadge = (sentiment: string) => {
        switch (sentiment.toLowerCase()) {
            case 'positive': return <Badge variant="default" className="bg-green-500">Позитивный</Badge>;
            case 'negative': return <Badge variant="destructive">Негативный</Badge>;
            case 'neutral': return <Badge variant="secondary">Нейтральный</Badge>;
            default: return <Badge variant="outline">{sentiment}</Badge>;
        }
    };


    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Анализ и генерация контента</h1>
                <p className="text-muted-foreground">
                    Используйте AI для анализа существующего текста или создания нового контента для вашей платформы.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Analysis Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChartHorizontal /> Анализ контента</CardTitle>
                        <CardDescription>Вставьте текст, чтобы AI определил его тональность, ключевые темы и дал рекомендации.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Введите текст для анализа..."
                            value={analysisPrompt}
                            onChange={(e) => setAnalysisPrompt(e.target.value)}
                            className="min-h-[150px]"
                            disabled={isAnalyzing}
                        />
                         <Select onValueChange={setAnalysisContentType} defaultValue={analysisContentType} disabled={isAnalyzing}>
                            <SelectTrigger>
                                <SelectValue placeholder="Тип контента" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Комментарий">Комментарий</SelectItem>
                                <SelectItem value="Пост">Пост</SelectItem>
                                <SelectItem value="Новость">Новость</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
                            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Проанализировать
                        </Button>
                        
                        {analysisError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{analysisError}</AlertDescription></Alert>}

                        {isAnalyzing && <Skeleton className="h-40 w-full" />}
                        
                        {analysisResult && (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">Результат анализа:</h3>
                                    {getSentimentBadge(analysisResult.sentiment)}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Ключевые темы:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.keyTopics.map((topic, i) => <Badge key={i} variant="outline">{topic}</Badge>)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Рекомендации:</p>
                                    <p className="text-sm text-muted-foreground">{analysisResult.suggestedImprovements}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Generation Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb /> Генерация контента</CardTitle>
                        <CardDescription>Опишите тему, выберите тип и тон, и AI создаст для вас текст.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Опишите тему..."
                            value={generationPrompt}
                            onChange={(e) => setGenerationPrompt(e.target.value)}
                            className="min-h-[150px]"
                             disabled={isGenerating}
                        />
                        <div className="grid grid-cols-2 gap-4">
                             <Select onValueChange={setGenerationContentType} defaultValue={generationContentType} disabled={isGenerating}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Тип контента" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Новостной пост">Новостной пост</SelectItem>
                                    <SelectItem value="Твит">Твит</SelectItem>
                                    <SelectItem value="Описание матча">Описание матча</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setGenerationTone} defaultValue={generationTone} disabled={isGenerating}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Тон" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Восторженный">Восторженный</SelectItem>
                                    <SelectItem value="Профессиональный">Профессиональный</SelectItem>
                                    <SelectItem value="Остроумный">Остроумный</SelectItem>
                                    <SelectItem value="Нейтральный">Нейтральный</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Сгенерировать
                        </Button>

                         {generationError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{generationError}</AlertDescription></Alert>}

                        {isGenerating && <Skeleton className="h-40 w-full" />}

                        {generationResult && (
                             <div className="space-y-2 pt-4 border-t">
                                <h3 className="font-semibold">Сгенерированный текст:</h3>
                                <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground whitespace-pre-wrap">
                                    {generationResult.generatedText}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
