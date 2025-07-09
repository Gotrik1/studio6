"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
  Loader2,
  Sparkles,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Activity,
  BrainCircuit,
} from "lucide-react";
import type { AnalyzeTeamPerformanceOutput } from "@/shared/api/genkit/flows/analyze-team-performance-flow";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/shared/ui/alert";
import type { TeamDetails } from "@/entities/team/model/types";
import { useToast } from "@/shared/hooks/use-toast";
import { getTeamCoachSummary } from "@/entities/team/api/teams";

interface TeamCoachTabProps {
  team: TeamDetails | null;
}

export function TeamCoachTab({ team }: TeamCoachTabProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeTeamPerformanceOutput | null>(
    null,
  );

  const handleAnalyze = async () => {
    if (!team) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Данные команды не загружены.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await getTeamCoachSummary(team.id);
      if (analysisResult) {
        setResult(analysisResult);
      } else {
        throw new Error("Не удалось получить анализ.");
      }
    } catch (e) {
      const err = e as Error;
      console.error(e);
      setError(
        err.message ||
          "Не удалось сгенерировать анализ. Пожалуйста, попробуйте еще раз.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Продвинутый AI-Коуч</CardTitle>
            <CardDescription>
              Глубокий анализ производительности вашей команды.
            </CardDescription>
          </div>
          <Button onClick={handleAnalyze} disabled={isLoading || !team}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {result ? "Проанализировать заново" : "Начать анализ"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
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
            <p className="font-semibold mb-2">Готовы к глубокому разбору?</p>
            <p className="text-sm text-muted-foreground">
              Нажмите «Начать анализ», чтобы получить инсайты по игре команды.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity /> Фокус на неделю
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-primary">
                  {result.trainingFocus}
                </p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="text-green-500" /> Сильные стороны
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {result.teamStrengths.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="text-yellow-500" /> Точки роста
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {result.teamWeaknesses.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck /> Игрок в фокусе: {result.playerInFocus.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <span className="font-semibold">Причина:</span>{" "}
                  {result.playerInFocus.reason}
                </p>
                <p>
                  <span className="font-semibold">Рекомендация:</span>{" "}
                  {result.playerInFocus.suggestion}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
