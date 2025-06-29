
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
import type { Report } from "@/shared/lib/mock-data/moderation";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import { analyzeReport, type AnalyzeReportOutput } from '@/shared/api/genkit/flows/analyze-report-flow';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';

interface ReportAnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  report: Report | null;
  onResolve: (reportId: string, action: string) => void;
}

const getConfidenceColor = (confidence?: 'high' | 'medium' | 'low') => {
    switch(confidence) {
        case 'high': return 'text-green-500';
        case 'medium': return 'text-yellow-500';
        case 'low': return 'text-orange-500';
        default: return 'text-muted-foreground';
    }
}

const getRecommendationText = (rec?: AnalyzeReportOutput['recommendation']) => {
    switch (rec) {
        case 'warning': return 'Предупреждение';
        case 'temp_ban': return 'Временный бан';
        case 'perm_ban': return 'Постоянный бан';
        case 'no_action': return 'Нет нарушений';
        default: return '...';
    }
};

export function ReportAnalysisDialog({ isOpen, onOpenChange, report, onResolve }: ReportAnalysisDialogProps) {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AnalyzeReportOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAnalyze = async () => {
      if (!report) return;

      setIsAnalyzing(true);
      setAiResult(null);
      setAiError(null);

      try {
          // In a real app, this would be fetched from a user service.
          const mockUserHistory = "Пользователь Maria 'Shadow' Petrova имеет 2 предыдущих предупреждения за токсичность. В остальном активность в рамках нормы.";
          const result = await analyzeReport({
              reportReason: report.reason,
              evidenceContext: report.context,
              reportedUserActivity: mockUserHistory,
          });
          setAiResult(result);
      } catch (e) {
          console.error(e);
          setAiError("Не удалось получить рекомендацию от ИИ.");
      } finally {
          setIsAnalyzing(false);
      }
  };

  const onOpenChangeHandler = (open: boolean) => {
    if (open && report) {
      handleAnalyze(); // Analyze automatically when dialog opens
    } else {
      setAiResult(null);
      setAiError(null);
    }
    onOpenChange(open);
  };
  
  const handleModeratorAction = (action: string) => {
    if (!report) return;
    onResolve(report.id, action);
    toast({
        title: "Решение принято",
        description: `Вы вынесли решение по жалобе на ${report.reportedUser.name}.`
    });
  }

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Разбор жалобы</DialogTitle>
          <DialogDescription>
            Жалоба от <strong>{report.reportedBy.name}</strong> на <strong>{report.reportedUser.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
                <h4 className="font-semibold text-sm mb-1">Причина</h4>
                <p className="text-sm p-3 bg-muted rounded-md">{report.reason}</p>
            </div>
            <div>
                <h4 className="font-semibold text-sm mb-1">Контекст/Доказательства</h4>
                <p className="text-sm p-3 bg-muted rounded-md whitespace-pre-wrap font-mono text-xs">{report.context}</p>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-2">AI-Ассистент модератора</h4>
                 {isAnalyzing && (
                    <div className="flex flex-col items-center justify-center h-24">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                        <p className="mt-2 text-sm text-muted-foreground">Анализирую...</p>
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
                    <Alert>
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle className="flex justify-between items-center">
                            <span>Рекомендация: {getRecommendationText(aiResult.recommendation)}</span>
                             <Badge variant="outline" className={cn(getConfidenceColor(aiResult.confidence))}>
                                Уверенность: {aiResult.confidence}
                            </Badge>
                        </AlertTitle>
                        <AlertDescription className="mt-2">
                           {aiResult.reasoning}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
        <DialogFooter className="border-t pt-4">
          <Button variant="secondary" onClick={() => handleModeratorAction('Отклонить жалобу')}>Отклонить жалобу</Button>
          <Button variant="outline" onClick={() => handleModeratorAction('Выдать предупреждение')}>Предупреждение</Button>
          <Button variant="destructive" onClick={() => handleModeratorAction('Забанить пользователя')}>Забанить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
