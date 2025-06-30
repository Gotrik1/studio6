'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Loader2, Sparkles, BrainCircuit, AlertCircle, TrendingUp, TrendingDown, ClipboardList } from "lucide-react";
import { analyzePlayerPerformance, type AnalyzePlayerPerformanceOutput } from '@/shared/api/genkit/flows/analyze-player-performance-flow';
import type { CoachedPlayer } from "@/shared/lib/mock-data/coach-players";

interface PlayerAnalysisDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    player: CoachedPlayer | null;
}

export function PlayerAnalysisDialog({ isOpen, onOpenChange, player }: PlayerAnalysisDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzePlayerPerformanceOutput | null>(null);

  const handleAnalyze = async () => {
    if (!player) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
        const statsSummary = `Role: ${player.role}, KDA: ${player.stats.kda}, Win Rate: ${player.stats.winRate}, Favorite Map: ${player.stats.favoriteMap}`;
        const result = await analyzePlayerPerformance({
            playerStats: statsSummary,
            matchHistory: player.matchHistory,
        });
        setAnalysisResult(result);
    } catch (e) {
        console.error(e);
        setError("Не удалось получить анализ. Пожалуйста, попробуйте еще раз.");
    } finally {
        setIsLoading(false);
    }
  };
  
   const onOpenChangeHandler = (open: boolean) => {
    if (open && player) {
      handleAnalyze(); // Analyze automatically when dialog opens
    } else {
      setAnalysisResult(null);
      setError(null);
    }
    onOpenChange(open);
  };
  
  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI-Анализ: {player.name}</DialogTitle>
          <DialogDescription>
            Глубокий анализ производительности игрока.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {isLoading && (
                 <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
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
            {analysisResult && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500"/> Сильные стороны</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                            {analysisResult.strengths.map((item, i) => <li key={`str-${i}`}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><TrendingDown className="h-5 w-5 text-yellow-500"/> Точки роста</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                                {analysisResult.weaknesses.map((item, i) => <li key={`weak-${i}`}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><ClipboardList className="h-5 w-5 text-blue-500"/> Рекомендации</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                            {analysisResult.recommendations.map((item, i) => <li key={`rec-${i}`}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Закрыть</Button>
            <Button onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Проанализировать снова
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
