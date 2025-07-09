"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import type { Playground } from "@/entities/playground/model/types";
import { MapPin, Shield, CheckCircle2 } from "lucide-react";
import { AiPlaygroundAnalysis } from "@/widgets/ai-playground-analysis";
import { PlaygroundWorkoutGenerator } from "@/widgets/playground-workout-generator";
import { AiPlaygroundTactic } from "@/widgets/ai-playground-tactic";
import { AiPlaygroundLore } from "@/widgets/ai-playground-lore";
import { PlaygroundConditionStatus } from "@/widgets/playground-condition-status";
import type { PlaygroundConditionReport } from "@/entities/playground/api/condition";
import { AiPlaygroundSummary } from "@/widgets/ai-playground-summary";
import { KingOfTheCourtWidget } from "@/widgets/playground-home-team";

interface PlaygroundInfoTabProps {
  playground: Playground;
  issueReport?: PlaygroundConditionReport | null;
}

export function PlaygroundInfoTab({
  playground,
  issueReport,
}: PlaygroundInfoTabProps) {
  const isTeamSport = [
    "Футбол",
    "Баскетбол",
    "Стритбол",
    "Волейбол",
    "Хоккей",
  ].includes(playground.type);
  const isWorkout = ["Воркаут", "Фитнес-зал"].includes(playground.type);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <KingOfTheCourtWidget
          homeTeamData={playground.kingOfTheCourt || null}
          isLoading={false}
        />
        <AiPlaygroundAnalysis playground={playground} />
        <AiPlaygroundSummary playground={playground} />
        <AiPlaygroundLore playground={playground} />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <PlaygroundConditionStatus
          status={issueReport ? "issue" : "ok"}
          report={issueReport || undefined}
        />
        <Card>
          <CardHeader>
            <CardTitle>Факты</CardTitle>
            <CardDescription>Ключевая информация о площадке.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
              <span className="font-medium">{playground.address}</span>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium">Покрытие</p>
                <p className="text-sm text-muted-foreground">
                  {playground.surface}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium">Удобства</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {playground.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {isWorkout && <PlaygroundWorkoutGenerator playground={playground} />}
        {isTeamSport && <AiPlaygroundTactic playground={playground} />}
      </div>
    </div>
  );
}
