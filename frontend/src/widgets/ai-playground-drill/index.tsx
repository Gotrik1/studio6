"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Target, Award, CheckCircle } from "lucide-react";
import {
  generatePlaygroundDrill,
  type GeneratePlaygroundDrillOutput,
} from "@/shared/api/genkit/flows/generate-playground-drill-flow";
import type { Playground } from "@/entities/playground/model/types";
import { useToast } from "@/shared/hooks/use-toast";
import { usePDEconomy } from "@/shared/context/pd-provider";

interface AiPlaygroundDrillProps {
  playground: Playground;
}

// Mock user data for demo
const mockUserData = {
  weakness: "Низкая точность дальних бросков",
};

export function AiPlaygroundDrill({ playground }: AiPlaygroundDrillProps) {
  const { toast } = useToast();
  const { addTransaction } = usePDEconomy();
  const [result, setResult] = useState<GeneratePlaygroundDrillOutput | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchDrill = async () => {
      if (!playground) return;
      setIsLoading(true);
      setError(null);
      setIsCompleted(false);
      try {
        const drillData = await generatePlaygroundDrill({
          playgroundType: playground.type,
          userWeakness: mockUserData.weakness,
        });
        setResult(drillData);
      } catch (e) {
        console.error(`Failed to fetch AI drill for ${playground.name}:`, e);
        setError("Не удалось загрузить персональную тренировку.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrill();
  }, [playground]);

  const handleComplete = () => {
    if (!result) return;
    setIsCompleted(true);
    addTransaction(`Выполнение челленджа: ${result.title}`, result.reward);
    toast({
      title: "Отличная работа!",
      description: `Вы выполнили челлендж и заработали ${result.reward} PD.`,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !result) {
    return null; // Don't show the card if there's an error or no result
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Персональный дрилл
        </CardTitle>
        <CardDescription>
          AI-задание для улучшения ваших навыков прямо сейчас.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-semibold text-lg">{result.title}</p>
        <p className="text-sm text-muted-foreground">{result.description}</p>
        <div className="flex items-center gap-2 text-amber-500 font-bold pt-2">
          <Award className="h-5 w-5" />
          <span>Награда: {result.reward} PD</span>
        </div>
      </CardContent>
      <CardContent>
        <Button
          className="w-full"
          onClick={handleComplete}
          disabled={isCompleted}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {isCompleted ? "Выполнено" : "Я выполнил(а) челлендж"}
        </Button>
      </CardContent>
    </Card>
  );
}
