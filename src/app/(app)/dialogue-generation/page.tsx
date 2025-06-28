'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Radio, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { generateDialogue } from '@/ai/flows/dialogue-generation-flow';
import { multiSpeakerTts, type MultiSpeakerTtsOutput } from '@/ai/flows/multi-speaker-tts-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

export default function DialogueGenerationPage() {
    const { toast } = useToast();
    const [topic, setTopic] = useState("Интервью после победы в финале");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dialogue, setDialogue] = useState<string | null>(null);
    const [audioResult, setAudioResult] = useState<MultiSpeakerTtsOutput | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Пожалуйста, введите тему для диалога.");
            return;
        }

        setLoading(true);
        setError(null);
        setDialogue(null);
        setAudioResult(null);

        try {
            // Step 1: Generate dialogue script
            toast({ title: "Шаг 1: Создание сценария..." });
            const dialogueResult = await generateDialogue(topic);
            setDialogue(dialogueResult.dialogue);

            // Step 2: Generate audio from script
            toast({ title: "Шаг 2: Генерация аудио...", description: "Это может занять некоторое время." });
            const ttsResult = await multiSpeakerTts(dialogueResult.dialogue);
            setAudioResult(ttsResult);

            toast({
                title: "Готово!",
                description: "Диалог и аудио успешно сгенерированы.",
            });
        } catch (e) {
            console.error(e);
            setError("Не удалось сгенерировать диалог. Пожалуйста, попробуйте еще раз.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Генератор диалогов</h1>
                <p className="text-muted-foreground">
                    Создайте сценарий и озвучьте его с помощью AI с двумя разными голосами.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Создание диалога</CardTitle>
                    <CardDescription>Введите тему, и ИИ создаст короткий диалог и озвучит его.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="dialogue-topic">Тема диалога</Label>
                        <Input
                            id="dialogue-topic"
                            placeholder="Например, 'Обсуждение тактики на следующую игру'"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
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
                    <Button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Генерация...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Создать и озвучить
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Сценарий</CardTitle>
                        <CardDescription>Сгенерированный ИИ текст диалога.</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[150px]">
                        {loading && !dialogue && (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        )}
                         {!loading && !dialogue && (
                            <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                                <p>Сценарий появится здесь.</p>
                            </div>
                        )}
                        {dialogue && (
                            <Textarea
                                readOnly
                                value={dialogue}
                                className="min-h-[150px] bg-muted"
                            />
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Аудио</CardTitle>
                        <CardDescription>Прослушайте результат озвучки.</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[150px] flex items-center justify-center">
                        {loading && dialogue && (
                             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <p>Создаем аудио...</p>
                            </div>
                        )}
                        {!loading && !audioResult && (
                            <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                                <Radio className="h-10 w-10 mx-auto mb-2" />
                                <p>Аудиоплеер появится здесь.</p>
                            </div>
                        )}
                        {audioResult && audioResult.audioDataUri && (
                            <audio controls src={audioResult.audioDataUri} className="w-full">
                                Ваш браузер не поддерживает аудио элемент.
                            </audio>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
