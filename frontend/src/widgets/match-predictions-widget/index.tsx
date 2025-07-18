"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  Award,
  BrainCircuit,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Separator } from "@/shared/ui/separator";
import {
  predictMatchOutcome,
  type PredictMatchOutcomeOutput,
} from "@/shared/api/genkit/flows/predict-match-outcome-flow";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Badge } from "@/shared/ui/badge";
import type { Match } from "@/entities/match/model/types";
import { fetchMatches } from "@/entities/match/api/get-matches";

const getWinner = (score: string): "team1" | "team2" | null => {
  const scores = score.split("-").map((s) => parseInt(s.trim(), 10));
  if (scores.length !== 2 || isNaN(scores[0]) || isNaN(scores[1])) {
    return null;
  }
  if (scores[0] > scores[1]) return "team1";
  if (scores[1] > scores[0]) return "team2";
  return null;
};

export function MatchPredictionWidget() {
  const { toast } = useToast();
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [finishedMatches, setFinishedMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pre-populate a correct prediction for the finished match for demonstration purposes
  const [predictions, setPredictions] = useState<
    Record<string, "team1" | "team2">
  >({});

  const [aiPrediction, setAiPrediction] =
    useState<PredictMatchOutcomeOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    async function loadMatches() {
      setIsLoading(true);
      try {
        const [upcoming, finished] = await Promise.all([
          fetchMatches("PLANNED"),
          fetchMatches("FINISHED"),
        ]);
        setUpcomingMatches(upcoming.slice(0, 2));
        setFinishedMatches(finished.slice(0, 1));
      } catch (error) {
        console.error("Failed to load matches for prediction widget:", error);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить матчи для прогнозов.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadMatches();
  }, [toast]);

  const handlePredict = (matchId: string, team: "team1" | "team2") => {
    setPredictions((prev) => ({ ...prev, [matchId]: team }));
    toast({
      title: "Прогноз принят!",
      description: "Ваш прогноз на матч сохранен. Удачи!",
    });
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

  const handleAiPrediction = async () => {
    if (upcomingMatches.length === 0) {
      toast({
        variant: "destructive",
        title: "Нет матчей",
        description: "Нет предстоящих матчей для анализа.",
      });
      return;
    }

    const matchToAnalyze = upcomingMatches[0];

    setIsAnalyzing(true);
    setAiPrediction(null);
    try {
      // In a real app, you'd fetch real team stats. Here we use mock stats.
      const mockInput = {
        team1: {
          name: matchToAnalyze.team1.name,
          winRate: "68%",
          recentForm: "WWLWW",
        },
        team2: {
          name: matchToAnalyze.team2.name,
          winRate: "75%",
          recentForm: "LWWWL",
        },
        matchContext: `Матч в рамках турнира: ${matchToAnalyze.tournament}`,
      };
      const prediction = await predictMatchOutcome(mockInput);
      setAiPrediction(prediction);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось получить прогноз от AI.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Центр прогнозов</CardTitle>
            <CardDescription>
              Сделайте прогноз и сравните с мнением AI-аналитика.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAiPrediction}
            disabled={isAnalyzing || upcomingMatches.length === 0}
          >
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Прогноз AI
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 ? (
          upcomingMatches.map((match) => (
            <div key={match.id} className="space-y-2 rounded-lg border p-4">
              <p className="text-sm text-center text-muted-foreground">
                {match.tournament} - {match.date}
              </p>
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant={
                    predictions[match.id] === "team1" ? "default" : "outline"
                  }
                  className="flex-1 justify-start h-12"
                  onClick={() => handlePredict(match.id, "team1")}
                  disabled={!!predictions[match.id]}
                >
                  <Image
                    src={match.team1.logo}
                    alt={match.team1.name}
                    width={32}
                    height={32}
                    className="rounded-full mr-2"
                    data-ai-hint={match.team1.logoHint || ""}
                  />
                  <span className="font-semibold">{match.team1.name}</span>
                  {predictions[match.id] === "team1" && (
                    <CheckCircle className="ml-auto h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant={
                    predictions[match.id] === "team2" ? "default" : "outline"
                  }
                  className="flex-1 justify-end h-12"
                  onClick={() => handlePredict(match.id, "team2")}
                  disabled={!!predictions[match.id]}
                >
                  {predictions[match.id] === "team2" && (
                    <CheckCircle className="mr-auto h-5 w-5" />
                  )}
                  <span className="font-semibold">{match.team2.name}</span>
                  <Image
                    src={match.team2.logo}
                    alt={match.team2.name}
                    width={32}
                    height={32}
                    className="rounded-full ml-2"
                    data-ai-hint={match.team2.logoHint || ""}
                  />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Нет предстоящих матчей для прогноза.
          </p>
        )}

        {isAnalyzing && (
          <div className="p-4 border rounded-lg">
            <Skeleton className="h-16 w-full" />
          </div>
        )}
        {aiPrediction && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle className="flex justify-between items-center">
              <span>Прогноз AI: Победа {aiPrediction.predictedWinner}</span>
              <Badge
                variant="outline"
                className={cn(getConfidenceColor(aiPrediction.confidence))}
              >
                Уверенность: {aiPrediction.confidence}
              </Badge>
            </AlertTitle>
            <AlertDescription className="mt-2">
              {aiPrediction.reasoning}
            </AlertDescription>
          </Alert>
        )}

        {upcomingMatches.length > 0 && finishedMatches.length > 0 && (
          <Separator />
        )}

        {/* Finished Matches Results */}
        {finishedMatches.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Недавние результаты
            </p>
            {finishedMatches.map((match) => {
              const winner = getWinner(match.score);
              const userPrediction = predictions[match.id];
              const isCorrect =
                userPrediction && winner && userPrediction === winner;

              return (
                <div key={match.id} className="rounded-lg border p-4">
                  <p className="text-xs text-center text-muted-foreground mb-2">
                    {match.tournament} - {match.date}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={cn(
                        "flex flex-col items-center gap-1 flex-1 transition-opacity",
                        winner !== "team1" && "opacity-50",
                      )}
                    >
                      <Image
                        src={match.team1.logo}
                        alt={match.team1.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        data-ai-hint={match.team1.logoHint || ""}
                      />
                      <p className="text-sm font-semibold">
                        {match.team1.name}
                      </p>
                    </div>
                    <p className="text-2xl font-bold">{match.score}</p>
                    <div
                      className={cn(
                        "flex flex-col items-center gap-1 flex-1 transition-opacity",
                        winner !== "team2" && "opacity-50",
                      )}
                    >
                      <Image
                        src={match.team2.logo}
                        alt={match.team2.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        data-ai-hint={match.team2.logoHint || ""}
                      />
                      <p className="text-sm font-semibold">
                        {match.team2.name}
                      </p>
                    </div>
                  </div>
                  {userPrediction && (
                    <div className="mt-3 pt-3 border-t text-center text-sm">
                      {isCorrect ? (
                        <div className="flex items-center justify-center gap-2 font-medium text-green-500">
                          <CheckCircle className="h-4 w-4" />
                          <span>Прогноз верен!</span>
                          <span className="flex items-center gap-1 font-bold">
                            <Award className="h-4 w-4 text-amber-500" />
                            +10 PD
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 font-medium text-red-500">
                          <XCircle className="h-4 w-4" />
                          <span>Прогноз неверный</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
