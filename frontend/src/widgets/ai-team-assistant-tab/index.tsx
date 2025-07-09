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
import {
  BrainCircuit,
  Loader2,
  Sparkles,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import {
  aiTeamAssistant,
  type AiTeamAssistantOutput,
} from "@/shared/api/genkit/flows/ai-team-assistant";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/shared/ui/alert";

interface AITeamAssistantTabProps {
  teamId: string;
}

export function AITeamAssistantTab({ teamId }: AITeamAssistantTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiTeamAssistantOutput | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await aiTeamAssistant({ teamId });
      setResult(analysisResult);
    } catch (e) {
      console.error(e);
      setError("Не удалось сгенерировать сводку. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>AI-Ассистент Капитана</CardTitle>
            <CardDescription>
              Получите сводку по последней активности команды и рекомендации.
            </CardDescription>
          </div>
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {result ? "Обновить сводку" : "Сгенерировать сводку"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!result && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="font-semibold mb-2">Готовы получить инсайты?</p>
            <p className="text-sm text-muted-foreground">
              Нажмите кнопку, чтобы AI проанализировал активность команды.
            </p>
          </div>
        )}
        {result && (
          <div className="space-y-6 animate-in fade-in-50">
            <Card className="mx-1 bg-muted/50 shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">Краткая сводка</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.summary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="text-primary" />
                  Рекомендации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {result.suggestions.map((suggestion: string, i: number) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
