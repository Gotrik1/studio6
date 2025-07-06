





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
import { Separator } from "@/shared/ui/separator";
import { Loader2, AlertCircle, Sparkles, MessageSquare, Clock, Flag, UserX, BrainCircuit, Shield } from "lucide-react";
import { analyzeReport, type AnalyzeReportOutput } from '@/shared/api/genkit/flows/analyze-report-flow';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Report } from '@/entities/report/model/types';


interface ReportAnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  report: Report | null;
  onResolve: (reportId: string, action: string) => void;
}

const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch(confidence) {
        case 'high': return 'text-green-500';
        case 'medium': return 'text-yellow-500';
        case 'low': return 'text-orange-500';
    }
};

const getRecommendationText = (rec?: AnalyzeReportOutput['recommendation']) => {
    switch (rec) {
        case 'warning': return 'Выдать предупреждение';
        case 'temp_ban': return 'Временный бан';
        case 'perm_ban': return 'Постоянный бан';
        case 'no_action': return 'Нет нарушений';
        default: return rec || '...';
    }
};

const getRecommendationVariant = (rec?: AnalyzeReportOutput['recommendation']): "destructive" | "secondary" | "default" | "outline" | null | undefined => {
    switch (rec) {
        case 'perm_ban': return 'destructive';
        case 'temp_ban': return 'destructive';
        case 'warning': return 'secondary';
        default: return 'outline';
    }
};


export function ReportAnalysisDialog({ isOpen, onOpenChange, report, onResolve }: ReportAnalysisDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AnalyzeReportOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAnalyzeReport = async () => {
      if (!report) return;

      setIsAnalyzing(true);
      setAiResult(null);
      setAiError(null);

      const mockUserHistory = "Пользователь ToxicPlayer123 имеет 2 предыдущих предупреждения за токсичное поведение в чате.";

      try {
          const result = await analyzeReport({
              reportReason: report.category,
              evidenceContext: report.description || '',
              reportedUserActivity: mockUserHistory,
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
    if (isOpen && report) {
        handleAnalyzeReport();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, report]);

  const onOpenChangeHandler = (open: boolean) => {
    if (!open) {
      setAiResult(null);
      setAiError(null);
    }
    onOpenChange(open);
  };
  
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Разбор жалобы</DialogTitle>
          <DialogDescription>
            Жалоба от <strong>{report.reporter.name}</strong> на <strong>{report.reportedUser.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="space-y-1">
                <h4 className="font-semibold text-sm flex items-center gap-2"><Flag className="h-4 w-4"/>Причина</h4>
                <p className="text-sm p-2 bg-muted rounded-md">{report.category}</p>
            </div>
            <div className="space-y-1">
                <h4 className="font-semibold text-sm flex items-center gap-2"><MessageSquare className="h-4 w-4"/>Контекст</h4>
                <p className="text-sm p-2 bg-muted rounded-md whitespace-pre-wrap">{report.description}</p>
                 <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: ru })}</p>
            </div>
            <div className="space-y-1">
                <h4 className="font-semibold text-sm flex items-center gap-2"><UserX className="h-4 w-4"/>История нарушителя</h4>
                <p className="text-sm p-2 bg-muted rounded-md">Пользователь ToxicPlayer123 имеет 2 предыдущих предупреждения за токсичное поведение в чате.</p>
            </div>
             <Separator />
             <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">Помощник модератора (AI)</h4>
                    <Button variant="outline" size="sm" onClick={handleAnalyzeReport} disabled={isAnalyzing}>
                        {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>}
                        Проанализировать заново
                    </Button>
                </div>
                {isAnalyzing && (
                    <div className="p-4 border border-dashed rounded-lg">
                        <div className="flex items-center justify-center h-20">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                        </div>
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
             <Separator />
            <div>
                <h4 className="font-semibold text-sm mb-2">Вынести решение</h4>
                 <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="flex-1" onClick={() => onResolve(String(report.id), `победа присуждена ${report.reporter.name}`)}>
                        <Shield className="mr-2 h-4 w-4"/>Правота за {report.reporter.name}
                    </Button>
                    <Button className="flex-1" variant="destructive" onClick={() => onResolve(String(report.id), 'отклонена')}>
                        Отклонить жалобу
                    </Button>
                 </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChangeHandler(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
