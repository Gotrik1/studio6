'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Loader2, Sparkles, Mic, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

// Import Genkit flows
import { textToSpeech, type TextToSpeechOutput } from '@/shared/api/genkit/flows/tts-flow';
import { generateDialogue, type GenerateDialogueOutput } from '@/shared/api/genkit/flows/dialogue-generation-flow';
import { multiSpeakerTts, type MultiSpeakerTtsOutput } from '@/shared/api/genkit/flows/multi-speaker-tts-flow';

export function AudioGenerationPage() {
    // State for simple TTS
    const [ttsText, setTtsText] = useState('Привет, мир! Это демонстрация генерации речи.');
    const [isGeneratingTts, setIsGeneratingTts] = useState(false);
    const [ttsError, setTtsError] = useState<string | null>(null);
    const [ttsResult, setTtsResult] = useState<TextToSpeechOutput | null>(null);

    // State for dialogue generation
    const [dialogueTopic, setDialogueTopic] = useState('спор о лучшей команде в Valorant');
    const [isGeneratingDialogue, setIsGeneratingDialogue] = useState(false);
    const [dialogueError, setDialogueError] = useState<string | null>(null);
    const [dialogueResult, setDialogueResult] = useState<GenerateDialogueOutput | null>(null);

    // State for multi-speaker TTS
    const [isGeneratingDialogueAudio, setIsGeneratingDialogueAudio] = useState(false);
    const [dialogueAudioError, setDialogueAudioError] = useState<string | null>(null);
    const [dialogueAudioResult, setDialogueAudioResult] = useState<MultiSpeakerTtsOutput | null>(null);

    const handleGenerateTts = async () => {
        setIsGeneratingTts(true);
        setTtsError(null);
        setTtsResult(null);
        try {
            const result = await textToSpeech(ttsText);
            setTtsResult(result);
        } catch (e) {
            console.error(e);
            setTtsError('Не удалось сгенерировать аудио. Попробуйте еще раз.');
        } finally {
            setIsGeneratingTts(false);
        }
    };
    
    const handleGenerateDialogue = async () => {
        setIsGeneratingDialogue(true);
        setDialogueError(null);
        setDialogueResult(null);
        setDialogueAudioResult(null);
        setDialogueAudioError(null);
        try {
            const result = await generateDialogue(dialogueTopic);
            setDialogueResult(result);
        } catch (e) {
            console.error(e);
            setDialogueError('Не удалось сгенерировать диалог. Попробуйте еще раз.');
        } finally {
            setIsGeneratingDialogue(false);
        }
    };
    
    const handleGenerateDialogueAudio = async () => {
        if (!dialogueResult?.dialogue) return;
        setIsGeneratingDialogueAudio(true);
        setDialogueAudioError(null);
        setDialogueAudioResult(null);
        try {
            const result = await multiSpeakerTts(dialogueResult.dialogue);
            setDialogueAudioResult(result);
        } catch (e) {
            console.error(e);
            setDialogueAudioError('Не удалось сгенерировать аудио для диалога. Попробуйте еще раз.');
        } finally {
            setIsGeneratingDialogueAudio(false);
        }
    };

    return (
        <div className="space-y-6">
             <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Генерация аудио</h1>
                <p className="text-muted-foreground">
                    Превратите текст в речь с помощью AI. Создавайте озвучку для новостей, интервью или объявлений.
                </p>
            </div>
            
            <Tabs defaultValue="single">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single"><Mic className="mr-2 h-4 w-4" />Один голос (TTS)</TabsTrigger>
                    <TabsTrigger value="multi"><Users className="mr-2 h-4 w-4" />Диалог (Multi-speaker)</TabsTrigger>
                </TabsList>
                
                {/* Single Speaker Tab */}
                <TabsContent value="single" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Текст в речь</CardTitle>
                            <CardDescription>Введите текст, чтобы преобразовать его в аудиофайл.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Textarea
                                placeholder="Введите текст..."
                                value={ttsText}
                                onChange={(e) => setTtsText(e.target.value)}
                                className="min-h-[150px]"
                                disabled={isGeneratingTts}
                            />
                             <Button onClick={handleGenerateTts} disabled={isGeneratingTts} className="w-full">
                                {isGeneratingTts ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Озвучить
                            </Button>
                            {isGeneratingTts && <Skeleton className="h-12 w-full" />}
                            {ttsError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{ttsError}</AlertDescription></Alert>}
                            {ttsResult?.audioDataUri && (
                                <audio controls src={ttsResult.audioDataUri} className="w-full mt-4" />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Multi Speaker Tab */}
                <TabsContent value="multi" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Генератор диалогов</CardTitle>
                            <CardDescription>Создайте и озвучьте диалог между двумя спикерами на заданную тему.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="dialogue-topic">Тема диалога</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="dialogue-topic"
                                        placeholder="Например, спор о лучшей команде"
                                        value={dialogueTopic}
                                        onChange={(e) => setDialogueTopic(e.target.value)}
                                        disabled={isGeneratingDialogue || isGeneratingDialogueAudio}
                                    />
                                    <Button onClick={handleGenerateDialogue} disabled={isGeneratingDialogue || isGeneratingDialogueAudio}>
                                        {isGeneratingDialogue ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        Создать скрипт
                                    </Button>
                                </div>
                            </div>
                            
                            {isGeneratingDialogue && <Skeleton className="h-24 w-full" />}
                            {dialogueError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{dialogueError}</AlertDescription></Alert>}
                            
                            {dialogueResult?.dialogue && (
                                <div className="space-y-4 pt-4 border-t">
                                     <Textarea
                                        readOnly
                                        value={dialogueResult.dialogue}
                                        className="min-h-[150px] bg-muted"
                                    />
                                     <Button onClick={handleGenerateDialogueAudio} disabled={isGeneratingDialogueAudio} className="w-full">
                                        {isGeneratingDialogueAudio ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic className="mr-2 h-4 w-4" />}
                                        Озвучить диалог
                                    </Button>
                                     {isGeneratingDialogueAudio && <Skeleton className="h-12 w-full" />}
                                     {dialogueAudioError && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{dialogueAudioError}</AlertDescription></Alert>}
                                     {dialogueAudioResult?.audioDataUri && (
                                        <audio controls src={dialogueAudioResult.audioDataUri} className="w-full mt-4" />
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
