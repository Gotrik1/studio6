
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { analyzeContent, type AnalyzeContentOutput } from '@/ai/flows/analyze-content-generation';
import { generateContent, type GenerateContentOutput } from '@/ai/flows/generate-content-flow';
import { Loader2, Lightbulb, Smile, Frown, Meh, AlertCircle, Pencil, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

function ContentAnalysis() {
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
  );
}

function ContentGeneration() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('enthusiastic');
  const [contentType, setContentType] = useState('news post');
  const [result, setResult] = useState<GenerateContentOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Пожалуйста, укажите тему или ключевые слова.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generationResult = await generateContent({
        topic,
        tone,
        contentType,
      });
      setResult(generationResult);
    } catch (e) {
      console.error(e);
      setError('Не удалось сгенерировать контент. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.generatedText) {
      navigator.clipboard.writeText(result.generatedText);
      toast({
        title: "Скопировано!",
        description: "Сгенерированный текст скопирован в буфер обмена.",
      });
    }
  };

  return (
     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Параметры генерации</CardTitle>
            <CardDescription>Задайте параметры для создания контента.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Тема или ключевые слова</Label>
                <Input 
                  id="topic"
                  placeholder="Например, 'победа Кибер Орлов в финале'"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={loading}
                />
              </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Тон</Label>
                    <Select value={tone} onValueChange={setTone} disabled={loading}>
                      <SelectTrigger id="tone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enthusiastic">Восторженный</SelectItem>
                        <SelectItem value="professional">Профессиональный</SelectItem>
                        <SelectItem value="witty">Остроумный</SelectItem>
                        <SelectItem value="neutral">Нейтральный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content-type">Тип контента</Label>
                     <Select value={contentType} onValueChange={setContentType} disabled={loading}>
                      <SelectTrigger id="content-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="news post">Новостной пост</SelectItem>
                        <SelectItem value="match announcement">Анонс матча</SelectItem>
                        <SelectItem value="tweet">Твит</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>
              {error && (
                 <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Сгенерировать
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Сгенерированный контент</CardTitle>
            <CardDescription>Результат работы AI-генератора.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[268px] flex flex-col">
            {loading && (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {!loading && !result && (
              <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
                <Pencil className="mb-2 h-8 w-8" />
                <p>Результаты генерации появятся здесь.</p>
              </div>
            )}
            {result && (
              <div className="flex-1 flex flex-col gap-4">
                <Textarea
                  readOnly
                  value={result.generatedText}
                  className="flex-1 min-h-[200px]"
                />
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  Копировать текст
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}


export default function AiAnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Инструменты ИИ</h1>
        <p className="text-muted-foreground">
          Используйте искусственный интеллект для анализа и создания контента.
        </p>
      </div>

      <Tabs defaultValue="analysis">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis">Анализ контента</TabsTrigger>
            <TabsTrigger value="generation">Генерация контента</TabsTrigger>
        </TabsList>
        <TabsContent value="analysis" className="mt-4">
            <ContentAnalysis />
        </TabsContent>
        <TabsContent value="generation" className="mt-4">
            <ContentGeneration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
