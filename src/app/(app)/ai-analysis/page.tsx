'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { analyzeContent, type AnalyzeContentOutput } from '@/ai/flows/analyze-content-generation';
import { Loader2, Lightbulb, Smile, Frown, Meh, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AiAnalysisPage() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<AnalyzeContentOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Поле не может быть пустым.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysisResult = await analyzeContent({
        content: content,
        contentType: 'User Feedback',
      });
      setResult(analysisResult);
    } catch (e) {
      console.error(e);
      setError('Не удалось проанализировать контент. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const getSentiment = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return { icon: <Smile className="h-6 w-6 text-green-500" />, text: 'Позитивное' };
      case 'negative':
        return { icon: <Frown className="h-6 w-6 text-red-500" />, text: 'Негативное' };
      default:
        return { icon: <Meh className="h-6 w-6 text-yellow-500" />, text: 'Нейтральное' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Анализ контента с помощью ИИ</h1>
        <p className="text-muted-foreground">
          Анализируйте пользовательский контент, чтобы понять настроение, определить ключевые темы и получить рекомендации.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ввод контента</CardTitle>
            <CardDescription>Введите текст, который вы хотите проанализировать.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Например, 'Новая турнирная система великолепна, но хотелось бы больше вариантов призов.'"
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
              />
              {error && (
                 <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button onClick={handleAnalyze} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Анализ...
                  </>
                ) : (
                  'Анализировать контент'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Результаты анализа</CardTitle>
            <CardDescription>Идеи, сгенерированные ИИ-помощником.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[268px]">
            {loading && (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {!loading && !result && (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <Lightbulb className="mb-2 h-8 w-8" />
                <p>Результаты вашего анализа появятся здесь.</p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Настроение</h3>
                  <div className="flex items-center gap-2">
                    {getSentiment(result.sentiment).icon}
                    <span className="font-medium capitalize">{getSentiment(result.sentiment).text}</span>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Ключевые темы</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keyTopics.map((topic) => (
                      <Badge key={topic} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Предлагаемые улучшения</h3>
                  <p className="text-sm text-muted-foreground">{result.suggestedImprovements}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
