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
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  Loader2,
  Sparkles,
  BrainCircuit,
  AlertCircle,
  TrendingUp,
  Goal,
  Link as LinkIcon,
  HeartPulse,
} from "lucide-react";
import {
  analyzeHolisticPerformance,
  type AnalyzeHolisticPerformanceOutput,
} from "@/shared/api/genkit/flows/analyze-holistic-performance-flow";
import { getTrainingAnalytics } from "@/shared/lib/get-training-analytics";
import { AiFormCheckDialog } from "@/widgets/ai-form-check-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useTraining } from "@/shared/context/training-provider";
import type { PlayerStats } from "@/entities/user/model/types";

interface HolisticAnalysisTabProps {
  stats: PlayerStats | null;
}

export function HolisticAnalysisTab({ stats }: HolisticAnalysisTabProps) {
  const { log } = useTraining();
  // State for Holistic Analysis
  const [isHolisticLoading, setIsHolisticLoading] = useState(false);
  const [holisticError, setHolisticError] = useState<string | null>(null);
  const [holisticResult, setHolisticResult] =
    useState<AnalyzeHolisticPerformanceOutput | null>(null);

  // State for Form Check
  const { personalRecords } = getTrainingAnalytics(log);
  const uniqueExercisesWithRecords = [
    ...new Set(personalRecords.map((pr) => pr.exercise)),
  ];
  const [isFormCheckOpen, setIsFormCheckOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(
    uniqueExercisesWithRecords[0] || "",
  );

  const handleGetHolisticAnalysis = async () => {
    setIsHolisticLoading(true);
    setHolisticError(null);
    setHolisticResult(null);

    try {
      const { trainingMetrics } = getTrainingAnalytics(log);
      const physicalSummary = `
                Всего тренировок: ${trainingMetrics.totalWorkouts},
                Ежемесячный объем: ${trainingMetrics.monthlyVolume},
                Тренировочный стрик: ${trainingMetrics.workoutStreak},
                Любимое упражнение: ${trainingMetrics.favoriteExercise},
                Последняя тренировка: ${trainingMetrics.lastWorkout}.
            `;

      const esportsSummary = `
                Процент побед: ${stats?.summary.winrate}%,
                Всего матчей: ${stats?.summary.matches},
                Победная серия: ${stats?.summary.winStreak},
                Средний KDA: ${stats?.summary.kda}.
            `;

      const analysis = await analyzeHolisticPerformance({
        physicalSummary,
        esportsSummary,
      });
      setHolisticResult(analysis);
    } catch (e) {
      console.error(e);
      setHolisticError(
        "Не удалось выполнить комплексный анализ. Пожалуйста, попробуйте еще раз.",
      );
    } finally {
      setIsHolisticLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Комплексный AI-Анализ</CardTitle>
            <CardDescription>
              Откройте для себя взаимосвязи между вашей физической формой и
              игровыми результатами.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!holisticResult && !isHolisticLoading && (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-semibold mb-2">Объедините два мира</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Нажмите кнопку, чтобы AI проанализировал ваши физические и
                  игровые данные, выявил корреляции и дал уникальные
                  рекомендации.
                </p>
                <Button
                  onClick={handleGetHolisticAnalysis}
                  disabled={isHolisticLoading || !stats}
                >
                  {isHolisticLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Начать комплексный анализ
                </Button>
              </div>
            )}

            {isHolisticLoading && (
              <div className="space-y-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            )}

            {holisticError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{holisticError}</AlertDescription>
              </Alert>
            )}

            {holisticResult && (
              <div className="space-y-6 animate-in fade-in-50">
                <Alert>
                  <AlertTitle>Общая оценка</AlertTitle>
                  <AlertDescription>
                    {holisticResult.overallAssessment}
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <LinkIcon className="text-primary" />
                    Выявленные корреляции
                  </h3>
                  {holisticResult.correlations.map((item, i) => (
                    <Card key={i} className="bg-muted/50 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" /> {item.observation}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {item.explanation}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Goal className="text-primary" />
                    Рекомендации
                  </h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                    {holisticResult.recommendations.map((item, i) => (
                      <li key={`rec-${i}`}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-center pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleGetHolisticAnalysis}
                    disabled={isHolisticLoading || !stats}
                  >
                    {isHolisticLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Проанализировать заново
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mx-1 border-primary/20 bg-primary/5 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="text-primary" /> AI-Проверка техники
            </CardTitle>
            <CardDescription>
              Загрузите видео выполнения упражнения, чтобы получить детальный
              разбор вашей техники от ИИ.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Select
              value={selectedExercise}
              onValueChange={setSelectedExercise}
            >
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Выберите упражнение" />
              </SelectTrigger>
              <SelectContent>
                {uniqueExercisesWithRecords.map((ex) => (
                  <SelectItem key={ex} value={ex}>
                    {ex}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full sm:w-auto"
              onClick={() => setIsFormCheckOpen(true)}
              disabled={!selectedExercise}
            >
              Проверить технику
            </Button>
          </CardContent>
        </Card>
      </div>
      <AiFormCheckDialog
        isOpen={isFormCheckOpen}
        onOpenChange={setIsFormCheckOpen}
        exerciseName={selectedExercise}
      />
    </>
  );
}
