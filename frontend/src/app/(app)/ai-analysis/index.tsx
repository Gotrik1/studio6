"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Textarea } from "@/shared/ui/textarea";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Loader2,
  Sparkles,
  Lightbulb,
  BarChartHorizontal,
  Mic,
  Users,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  User as UserIcon,
  Gavel,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

// Import Genkit flows
import {
  analyzeContent,
  type AnalyzeContentOutput,
} from "@/shared/api/genkit/flows/analyze-content-generation";
import {
  generateContent,
  type GenerateContentOutput,
} from "@/shared/api/genkit/flows/generate-content-flow";
import {
  textToSpeech,
  type TextToSpeechOutput,
} from "@/shared/api/genkit/flows/tts-flow";
import {
  generateDialogue,
  type GenerateDialogueOutput,
} from "@/shared/api/genkit/flows/dialogue-generation-flow";
import {
  multiSpeakerTts,
  type MultiSpeakerTtsOutput,
} from "@/shared/api/genkit/flows/multi-speaker-tts-flow";
import {
  analyzeEsportsPerformance,
  type AnalyzeEsportsPerformanceOutput,
} from "@/shared/api/genkit/flows/analyze-esports-performance-flow";
import {
  analyzeTeamPerformance,
  type AnalyzeTeamPerformanceOutput,
} from "@/shared/api/genkit/flows/analyze-team-performance-flow";
import {
  analyzeDispute,
  type AnalyzeDisputeOutput,
} from "@/shared/api/genkit/flows/analyze-dispute-flow";
import { cn } from "@/shared/lib/utils";

// --- Text Analysis & Generation Component ---
function TextTools() {
  // State for Analysis
  const [analysisPrompt, setAnalysisPrompt] = useState(
    "Наша команда вчера проиграла, но мы не сдаемся и будем тренироваться еще усерднее, чтобы победить в следующий раз!",
  );
  const [analysisContentType, setAnalysisContentType] = useState("Комментарий");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeContentOutput | null>(null);

  // State for Generation
  const [generationPrompt, setGenerationPrompt] = useState(
    "анонс нового турнира по Valorant",
  );
  const [generationContentType, setGenerationContentType] =
    useState("Новостной пост");
  const [generationTone, setGenerationTone] = useState("Восторженный");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationResult, setGenerationResult] =
    useState<GenerateContentOutput | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeContent({
        content: analysisPrompt,
        contentType: analysisContentType,
      });
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setAnalysisError(
        "Не удалось проанализировать контент. Пожалуйста, попробуйте еще раз.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationResult(null);
    try {
      const result = await generateContent({
        topic: generationPrompt,
        contentType: generationContentType,
        tone: generationTone,
      });
      setGenerationResult(result);
    } catch (e) {
      console.error(e);
      setGenerationError(
        "Не удалось сгенерировать контент. Пожалуйста, попробуйте еще раз.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return (
          <Badge variant="default" className="bg-green-500">
            Позитивный
          </Badge>
        );
      case "negative":
        return <Badge variant="destructive">Негативный</Badge>;
      case "neutral":
        return <Badge variant="secondary">Нейтральный</Badge>;
      default:
        return <Badge variant="outline">{sentiment}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChartHorizontal /> Анализ контента
          </CardTitle>
          <CardDescription>
            Вставьте текст, чтобы AI определил его тональность, ключевые темы и
            дал рекомендации.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Введите текст для анализа..."
            value={analysisPrompt}
            onChange={(e) => setAnalysisPrompt(e.target.value)}
            className="min-h-[150px]"
            disabled={isAnalyzing}
          />
          <Select
            onValueChange={setAnalysisContentType}
            defaultValue={analysisContentType}
            disabled={isAnalyzing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Тип контента" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Комментарий">Комментарий</SelectItem>
              <SelectItem value="Пост">Пост</SelectItem>
              <SelectItem value="Новость">Новость</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Проанализировать
          </Button>

          {analysisError && (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{analysisError}</AlertDescription>
            </Alert>
          )}

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
                  {analysisResult.keyTopics.map((topic: string, i: number) => (
                    <Badge key={i} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Рекомендации:</p>
                <p className="text-sm text-muted-foreground">
                  {analysisResult.suggestedImprovements}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb /> Генерация контента
          </CardTitle>
          <CardDescription>
            Опишите тему, выберите тип и тон, и AI создаст для вас текст.
          </CardDescription>
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
            <Select
              onValueChange={setGenerationContentType}
              defaultValue={generationContentType}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Тип контента" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Новостной пост">Новостной пост</SelectItem>
                <SelectItem value="Твит">Твит</SelectItem>
                <SelectItem value="Описание матча">Описание матча</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={setGenerationTone}
              defaultValue={generationTone}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Тон" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Восторженный">Восторженный</SelectItem>
                <SelectItem value="Профессиональный">
                  Профессиональный
                </SelectItem>
                <SelectItem value="Остроумный">Остроумный</SelectItem>
                <SelectItem value="Нейтральный">Нейтральный</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Сгенерировать
          </Button>

          {generationError && (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{generationError}</AlertDescription>
            </Alert>
          )}

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
  );
}

// --- Audio Generation Component ---
function AudioTools() {
  // State for simple TTS
  const [ttsText, setTtsText] = useState(
    "Привет, мир! Это демонстрация генерации речи.",
  );
  const [isGeneratingTts, setIsGeneratingTts] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [ttsResult, setTtsResult] = useState<TextToSpeechOutput | null>(null);

  // State for dialogue generation
  const [dialogueTopic, setDialogueTopic] = useState(
    "спор о лучшей команде в Valorant",
  );
  const [isGeneratingDialogue, setIsGeneratingDialogue] = useState(false);
  const [dialogueError, setDialogueError] = useState<string | null>(null);
  const [dialogueResult, setDialogueResult] =
    useState<GenerateDialogueOutput | null>(null);

  // State for multi-speaker TTS
  const [isGeneratingDialogueAudio, setIsGeneratingDialogueAudio] =
    useState(false);
  const [dialogueAudioError, setDialogueAudioError] = useState<string | null>(
    null,
  );
  const [dialogueAudioResult, setDialogueAudioResult] =
    useState<MultiSpeakerTtsOutput | null>(null);

  const handleGenerateTts = async () => {
    setIsGeneratingTts(true);
    setTtsError(null);
    setTtsResult(null);
    try {
      const result = await textToSpeech(ttsText);
      setTtsResult(result);
    } catch (e) {
      console.error(e);
      setTtsError("Не удалось сгенерировать аудио. Попробуйте еще раз.");
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
      setDialogueError("Не удалось сгенерировать диалог. Попробуйте еще раз.");
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
      setDialogueAudioError(
        "Не удалось сгенерировать аудио для диалога. Попробуйте еще раз.",
      );
    } finally {
      setIsGeneratingDialogueAudio(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic /> Один голос (TTS)
          </CardTitle>
          <CardDescription>
            Введите текст, чтобы преобразовать его в аудиофайл.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Введите текст..."
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            className="min-h-[150px]"
            disabled={isGeneratingTts}
          />
          <Button
            onClick={handleGenerateTts}
            disabled={isGeneratingTts}
            className="w-full"
          >
            {isGeneratingTts ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Озвучить
          </Button>
          {isGeneratingTts && <Skeleton className="h-12 w-full" />}
          {ttsError && (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{ttsError}</AlertDescription>
            </Alert>
          )}
          {ttsResult?.audioDataUri && (
            <audio
              controls
              src={ttsResult.audioDataUri}
              className="w-full mt-4"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users /> Диалог (Multi-speaker)
          </CardTitle>
          <CardDescription>
            Создайте и озвучьте диалог между двумя спикерами на заданную тему.
          </CardDescription>
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
              <Button
                onClick={handleGenerateDialogue}
                disabled={isGeneratingDialogue || isGeneratingDialogueAudio}
              >
                {isGeneratingDialogue ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Скрипт
              </Button>
            </div>
          </div>

          {isGeneratingDialogue && <Skeleton className="h-24 w-full" />}
          {dialogueError && (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{dialogueError}</AlertDescription>
            </Alert>
          )}

          {dialogueResult?.dialogue && (
            <div className="space-y-4 pt-4 border-t">
              <Textarea
                readOnly
                value={dialogueResult.dialogue}
                className="min-h-[150px] bg-muted"
              />
              <Button
                onClick={handleGenerateDialogueAudio}
                disabled={isGeneratingDialogueAudio}
                className="w-full"
              >
                {isGeneratingDialogueAudio ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mic className="mr-2 h-4 w-4" />
                )}
                Озвучить диалог
              </Button>
              {isGeneratingDialogueAudio && (
                <Skeleton className="h-12 w-full" />
              )}
              {dialogueAudioError && (
                <Alert variant="destructive">
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>{dialogueAudioError}</AlertDescription>
                </Alert>
              )}
              {dialogueAudioResult?.audioDataUri && (
                <audio
                  controls
                  src={dialogueAudioResult.audioDataUri}
                  className="w-full mt-4"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Analysis & Coaching Component ---
const mockEsportsPlayerData = {
  playerStats: "Role: Duelist, KDA: 1.4, Win Rate: 62%",
  matchHistory: "vs Team A: W 13-5\nvs Team B: W 13-10\nvs Team C: L 8-13",
};

const mockTeamData = {
  teamName: "Кибер Орлы",
  recentMatches:
    "Победа 13-5 против 'Стальные Титаны', Поражение 10-13 против 'Ледяные Волки'",
  playerStats: [
    {
      name: "Superuser",
      kda: "1.2",
      winRate: "65%",
      recentPerformanceTrend: "stable" as const,
    },
    {
      name: "Echo",
      kda: "1.5",
      winRate: "68%",
      recentPerformanceTrend: "up" as const,
    },
    {
      name: "Reaper",
      kda: "0.9",
      winRate: "59%",
      recentPerformanceTrend: "down" as const,
    },
  ],
};

const mockDisputeData = {
  team1Name: "Теневые Лисы",
  team2Name: "Стальные Титаны",
  disputeReason:
    "Команда 'Теневые Лисы' обвиняет игрока 'TheWall' в использовании бага карты для получения преимущества.",
  team1Evidence: "Chat log shows team 2 player admitting to using a bug.",
  team2Evidence:
    "Player claims they were joking in chat. Provided video shows unusual lag at the time of the alleged incident.",
};

function AnalysisTools() {
  // Player Analysis State
  const [isPlayerAnalyzing, setIsPlayerAnalyzing] = useState(false);
  const [playerAnalysisError, setPlayerAnalysisError] = useState<string | null>(
    null,
  );
  const [playerAnalysisResult, setPlayerAnalysisResult] =
    useState<AnalyzeEsportsPerformanceOutput | null>(null);

  // Team Analysis State
  const [isTeamAnalyzing, setIsTeamAnalyzing] = useState(false);
  const [teamAnalysisError, setTeamAnalysisError] = useState<string | null>(
    null,
  );
  const [teamAnalysisResult, setTeamAnalysisResult] =
    useState<AnalyzeTeamPerformanceOutput | null>(null);

  // Dispute Analysis State
  const [isDisputeAnalyzing, setIsDisputeAnalyzing] = useState(false);
  const [disputeAnalysisError, setDisputeAnalysisError] = useState<
    string | null
  >(null);
  const [disputeAnalysisResult, setDisputeAnalysisResult] =
    useState<AnalyzeDisputeOutput | null>(null);

  const handlePlayerAnalyze = async () => {
    setIsPlayerAnalyzing(true);
    setPlayerAnalysisError(null);
    setPlayerAnalysisResult(null);
    try {
      const result = await analyzeEsportsPerformance(mockEsportsPlayerData);
      setPlayerAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setPlayerAnalysisError("Не удалось выполнить анализ игрока.");
    } finally {
      setIsPlayerAnalyzing(false);
    }
  };

  const handleTeamAnalyze = async () => {
    setIsTeamAnalyzing(true);
    setTeamAnalysisError(null);
    setTeamAnalysisResult(null);
    try {
      const result = await analyzeTeamPerformance(mockTeamData);
      setTeamAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setTeamAnalysisError("Не удалось выполнить анализ команды.");
    } finally {
      setIsTeamAnalyzing(false);
    }
  };

  const handleDisputeAnalyze = async () => {
    setIsDisputeAnalyzing(true);
    setDisputeAnalysisError(null);
    setDisputeAnalysisResult(null);
    try {
      const result = await analyzeDispute(mockDisputeData);
      setDisputeAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setDisputeAnalysisError("Не удалось выполнить анализ спора.");
    } finally {
      setIsDisputeAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence?: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-orange-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon /> Анализ игрока
          </CardTitle>
          <CardDescription>
            Оценка сильных и слабых сторон киберспортсмена.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          <Button
            onClick={handlePlayerAnalyze}
            disabled={isPlayerAnalyzing}
            className="w-full"
          >
            {isPlayerAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Проанализировать (моковые данные)
          </Button>
          {isPlayerAnalyzing && <Skeleton className="h-40 w-full" />}
          {playerAnalysisError && (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{playerAnalysisError}</AlertDescription>
            </Alert>
          )}
          {playerAnalysisResult && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <TrendingUp className="text-green-500" /> Сильные стороны
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {playerAnalysisResult.strengths.map(
                    (s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ),
                  )}
                </ul>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <TrendingDown className="text-yellow-500" /> Точки роста
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {playerAnalysisResult.weaknesses.map(
                    (s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ),
                  )}
                </ul>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <ClipboardList className="text-blue-500" /> Рекомендации
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {playerAnalysisResult.recommendations.map(
                    (s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users /> Анализ команды
          </CardTitle>
          <CardDescription>
            Комплексный разбор производительности всей команды.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          <Button
            onClick={handleTeamAnalyze}
            disabled={isTeamAnalyzing}
            className="w-full"
          >
            {isTeamAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Проанализировать (моковые данные)
          </Button>
          {isTeamAnalyzing && <Skeleton className="h-40 w-full" />}
          {teamAnalysisError && (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{teamAnalysisError}</AlertDescription>
            </Alert>
          )}
          {teamAnalysisResult && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Фокус на неделю:</h4>
                <p className="font-bold text-primary">
                  {teamAnalysisResult.trainingFocus}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">
                  Игрок в фокусе:{" "}
                  <span className="font-bold">
                    {teamAnalysisResult.playerInFocus.name}
                  </span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  {teamAnalysisResult.playerInFocus.suggestion}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel /> Анализ спора
          </CardTitle>
          <CardDescription>
            AI-помощник для судей и модераторов.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          <Button
            onClick={handleDisputeAnalyze}
            disabled={isDisputeAnalyzing}
            className="w-full"
          >
            {isDisputeAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Проанализировать (моковые данные)
          </Button>
          {isDisputeAnalyzing && <Skeleton className="h-40 w-full" />}
          {disputeAnalysisError && (
            <Alert variant="destructive">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{disputeAnalysisError}</AlertDescription>
            </Alert>
          )}
          {disputeAnalysisResult && (
            <div className="space-y-2 pt-4 border-t">
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle className="flex justify-between items-center">
                  <span>Вердикт: {disputeAnalysisResult.recommendation}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      getConfidenceColor(disputeAnalysisResult.confidence),
                    )}
                  >
                    Уверенность: {disputeAnalysisResult.confidence}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  {disputeAnalysisResult.reasoning}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Page Component ---
export function AiAnalysisPage() {
  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Песочница AI-инструментов
        </h1>
        <p className="text-muted-foreground">
          Демонстрация работы различных генеративных AI-функций платформы.
        </p>
      </div>
      <Tabs defaultValue="text">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">Текст и контент</TabsTrigger>
          <TabsTrigger value="audio">Аудио и голос</TabsTrigger>
          <TabsTrigger value="analysis">Анализ и Коучинг</TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="mt-6">
          <TextTools />
        </TabsContent>
        <TabsContent value="audio" className="mt-6">
          <AudioTools />
        </TabsContent>
        <TabsContent value="analysis" className="mt-6">
          <AnalysisTools />
        </TabsContent>
      </Tabs>
    </div>
  );
}
