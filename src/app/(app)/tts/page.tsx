'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Mic, AlertCircle, Volume2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { textToSpeech, type TextToSpeechOutput } from '@/ai/flows/tts-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function TextToSpeechPage() {
    const { toast } = useToast();
    const [inputText, setInputText] = useState("Привет, мир! Это демонстрация генерации речи с помощью искусственного интеллекта. Я могу озвучивать новости, анонсы матчей или даже комментарии болельщиков.");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioResult, setAudioResult] = useState<TextToSpeechOutput | null>(null);

    const handleGenerateAudio = async () => {
        if (!inputText.trim()) {
            setError("Пожалуйста, введите текст для озвучивания.");
            return;
        }

        setLoading(true);
        setError(null);
        setAudioResult(null);

        try {
            const result = await textToSpeech(inputText);
            setAudioResult(result);
            toast({
                title: "Аудио сгенерировано!",
                description: "Теперь вы можете прослушать результат.",
            });
        } catch (e) {
            console.error(e);
            setError("Не удалось сгенерировать аудио. Пожалуйста, попробуйте еще раз.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Генерация речи (TTS)</h1>
                <p className="text-muted-foreground">
                    Превратите любой текст в реалистичную речь с помощью AI.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Введите текст</CardTitle>
                    <CardDescription>Напишите или вставьте текст, который вы хотите озвучить.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="tts-input">Текст для озвучивания</Label>
                        <Textarea
                            id="tts-input"
                            placeholder="Например, 'Команда Кибер Орлы одержала уверенную победу...'"
                            className="min-h-[150px]"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button onClick={handleGenerateAudio} disabled={loading} className="w-full sm:w-auto">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Генерация...
                            </>
                        ) : (
                            <>
                                <Mic className="mr-2 h-4 w-4" />
                                Озвучить текст
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Результат</CardTitle>
                    <CardDescription>Прослушайте сгенерированный аудиофайл здесь.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[100px] flex items-center justify-center">
                    {loading && (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p>Создаем аудио...</p>
                        </div>
                    )}
                    {!loading && !audioResult && (
                        <div className="text-center text-muted-foreground">
                            <Volume2 className="h-10 w-10 mx-auto mb-2" />
                            <p>Аудиоплеер появится здесь после генерации.</p>
                        </div>
                    )}
                    {audioResult && audioResult.audioDataUri && (
                        <audio controls src={audioResult.audioDataUri} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
