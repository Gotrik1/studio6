"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import {
  Terminal,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from "lucide-react";
import {
  analyzePlaygroundDetails,
  type AnalyzePlaygroundDetailsOutput,
} from "@/shared/api/genkit/flows/analyze-playground-details-flow";
import type { Playground } from "@/entities/playground/model/types";

interface AiPlaygroundAnalysisProps {
  playground: Playground;
}

const SkeletonLoader = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-16 w-full" />
    </CardContent>
  </Card>
);

export function AiPlaygroundAnalysis({
  playground,
}: AiPlaygroundAnalysisProps) {
  const [analysis, setAnalysis] =
    useState<AnalyzePlaygroundDetailsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await analyzePlaygroundDetails({
          name: playground.name,
          type: playground.type,
          surface: playground.surface,
          features: playground.features,
          rating: playground.rating,
        });
        setAnalysis(result);
      } catch (e) {
        console.error(e);
        setError(
          "Не удалось загрузить AI-анализ. Попробуйте обновить страницу.",
        );
      } finally {
        setLoading(false);
      }
    };
    getAnalysis();
  }, [playground]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Sparkles className="h-6 w-6 text-primary" />
          {analysis.title}
        </CardTitle>
        <CardDescription>{analysis.vibe}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card/50">
            <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
              <ThumbsUp className="h-6 w-6 text-green-500" />
              <CardTitle className="text-lg">Плюсы</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {analysis.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
              <ThumbsDown className="h-6 w-6 text-red-500" />
              <CardTitle className="text-lg">Минусы</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {analysis.cons.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Идеально для</AlertTitle>
          <AlertDescription>{analysis.bestFor}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
