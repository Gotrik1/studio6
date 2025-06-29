'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Loader2, AlertCircle, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { analyzePlayerPerformance, type AnalyzePlayerPerformanceOutput } from '@/shared/api/genkit/flows/analyze-player-performance-flow';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import type { CoachedPlayer } from "@/shared/lib/mock-data/coach-players";

interface PlayerAnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  player: CoachedPlayer | null;
}

export function PlayerAnalysisDialog({ isOpen, onOpenChange, player }: PlayerAnalysisDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AnalyzePlayerPerformanceOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAnalyze = async () => {
      if (!player) return;

      setIsAnalyzing(true);
      setAiResult(null);
      setAiError(null);

      try {
          const playerStats = `
            Role: ${player.role},
            Win Rate: ${player.stats.winRate},
            KDA: ${player.stats.kda},
            Favorite Map: ${player.stats.favoriteMap}
          `;
          const result = await analyzePlayerPerformance({
              playerStats,
              matchHistory: player.matchHistory,
          });
          setAiResult(result);
      } catch (e) {
          console.error(e);
          setAiError("Не удалось получить рекомендацию от ИИ. Пожалуйста, попробуйте позже.");
      } finally {
          setIsAnalyzing(false);
      }
  };
  
  useEffect(() => {
    if (isOpen && player) {
      handleAnalyze();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, player]);


  const onOpenChangeHandler = (open: boolean) => {
    if (!open) {
      setAiResult(null);
      setAiError(null);
    }
    onOpenChange(open);
  };

  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI-анализ игрока: {player.name}</DialogTitle>
          <DialogDescription>
            Анализ производительности и рекомендации по развитию.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 min-h-[20rem]">
            {isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                    <p className="mt-2 text-sm text-muted-foreground">Анализирую данные...</p>
                </div>
            )}
            {aiError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>{aiError}</AlertDescription>
                </Alert>
            )}
            {aiResult && (
                 <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500"/> Сильные стороны</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {aiResult.strengths.map((item, i) => <li key={`str-${i}`}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><TrendingDown className="h-5 w-5 text-yellow-500"/> Точки роста</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {aiResult.weaknesses.map((item, i) => <li key={`weak-${i}`}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> Рекомендации для тренировок</h3>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {aiResult.recommendations.map((item, i) => <li key={`rec-${i}`}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChangeHandler(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
