"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { getTrainingAnalytics } from "@/shared/lib/get-training-analytics";
import {
  Trophy,
  Dumbbell,
  Flame,
  Star,
  HeartPulse,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { VolumeChart } from "@/widgets/analytics-charts/volume-chart";
import { PlayerPerformanceCoach } from "@/widgets/player-performance-coach";
import { useNutrition } from "@/shared/context/nutrition-provider";
import { useTraining } from "@/shared/context/training-provider";

export function PhysicalPrepTab() {
  const { log } = useTraining();
  const { personalRecords, trainingMetrics, volumeByMuscleGroupData } =
    getTrainingAnalytics(log);
  const top5Records = personalRecords.slice(0, 5);
  const { totals: nutritionTotals, targets: nutritionTargets } = useNutrition();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" /> Объем за месяц
            </CardDescription>
            <CardTitle className="font-headline text-3xl">
              {trainingMetrics.monthlyVolume}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Flame className="h-4 w-4" /> Тренировочный стрик
            </CardDescription>
            <CardTitle className="font-headline text-3xl">
              {trainingMetrics.workoutStreak}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Star className="h-4 w-4" /> Любимое упражнение
            </CardDescription>
            <CardTitle className="font-headline text-xl">
              {trainingMetrics.favoriteExercise}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4" /> Питание (сегодня)
            </CardDescription>
            <CardTitle className="font-headline text-xl">
              {nutritionTotals.calories} / {nutritionTargets.calories} ккал
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" /> Топ-5 личных
              рекордов (1ПМ)
            </CardTitle>
            <CardDescription>
              Лучшие силовые показатели, рассчитанные на основе данных из
              журнала тренировок.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Упражнение</TableHead>
                  <TableHead>Результат (1ПМ)</TableHead>
                  <TableHead className="text-right">Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top5Records.map((record) => (
                  <TableRow key={record.exercise}>
                    <TableCell className="font-medium">
                      {record.exercise}
                    </TableCell>
                    <TableCell className="font-bold text-lg">
                      {record.e1RM} кг
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {format(new Date(record.date), "d MMM yyyy", {
                        locale: ru,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Фокус по группам
              мышц
            </CardTitle>
            <CardDescription>
              Распределение тренировочного объема (тоннажа) за все время.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VolumeChart data={volumeByMuscleGroupData} />
          </CardContent>
        </Card>
      </div>

      <PlayerPerformanceCoach />
    </div>
  );
}
