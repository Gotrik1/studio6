

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
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { Separator } from "@/shared/ui/separator";
import { ImageIcon, MessageSquare, Shield, BrainCircuit, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { analyzeDispute, type AnalyzeDisputeOutput } from '@/shared/api/genkit/flows/analyze-dispute-flow';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Match } from '@/entities/match/model/types';


type DisputedMatch = Match & {
    disputeReason: string;
    timestamp?: string;
};

interface DisputeResolutionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  match: DisputedMatch | null;
  onResolve: (matchId: string, resolution: string) => void;
}

const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch(confidence) {
        case 'high': return 'text-green-500';
        case 'medium': return 'text-yellow-500';
        case 'low': return 'text-orange-500';
    }
};

const getRecommendationText = (rec?: AnalyzeDisputeOutput['recommendation']) => {
    switch (rec) {
        case 'warning': return 'Выдать предупреждение';
        case 'temp_ban': return 'Временный бан';
        case 'perm_ban': return 'Постоянный бан';
        case 'no_action': return 'Нет нарушений';
        default: return rec || '...';
    }
};

const getRecommendationVariant = (rec?: AnalyzeDisputeOutput['recommendation']): "destructive" | "secondary" | "default" | "outline" | null | undefined => {
    switch (rec) {
        case 'perm_ban': return 'destructive';
        case 'temp_ban': return 'destructive';
        case 'warning': return 'secondary';
        default: return 'outline';
    }
};


export function DisputeResolutionDialog({ isOpen, onOpenChange, match, onResolve }: DisputeResolutionDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AnalyzeDisputeOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAnalyzeDispute = async () => {
      if (!match) return;

      setIsAnalyzing(true);
      setAiResult(null);
      setAiError(null);

      const mockEvidence = {
          team1Evidence: "Chat log shows team 2 player admitting to using a bug. Screenshot of final score: 9-12.",
          team2Evidence: "Player claims they were joking in chat. Provided video shows unusual lag at the time of the alleged incident."
      };

      try {
          const result = await analyzeDispute({
              team1Name: match.team1.name,
              team2Name: match.team2.name,
              disputeReason: match.disputeReason,
              ...mockEvidence,
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
    if (isOpen && match) {
        handleAnalyzeDispute();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, match]);

  const onOpenChangeHandler = (open: boolean) => {
    if (!open) {
      setAiResult(null);
      setAiError(null);
    }
    onOpenChange(open);
  };
  
  if (!match) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Рассмотрение спора: {match.team1.name} vs {match.team2.name}</DialogTitle>
          <DialogDescription>
            Турнир: {match.tournament}. Заявленный счет: {match.score}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <div>
                <h4 className="font-semibold text-sm mb-2">Причина спора</h4>
                <p className="text-sm p-3 bg-muted rounded-md">{match.disputeReason}</p>
                 {match.timestamp && <p className="text-xs text-muted-foreground pt-1">{formatDistanceToNow(new Date(match.timestamp), { addSuffix: true, locale: ru })}</p>}
            </div>
            <Separator />
             <div>
                <h4 className="font-semibold text-sm mb-2">Доказательства</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 font-medium">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={match.team1.logo} data-ai-hint={match.team1.logoHint} />
                                <AvatarFallback>{match.team1.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{match.team1.name}</span>
                        </div>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start"><ImageIcon className="mr-2 h-4 w-4" /> Скриншот конца матча</Button>
                            <Button variant="outline" className="w-full justify-start"><MessageSquare className="mr-2 h-4 w-4" /> Лог чата</Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 font-medium">
                             <Avatar className="h-6 w-6">
                                <AvatarImage src={match.team2.logo} data-ai-hint={match.team2.logoHint} />
                                <AvatarFallback>{match.team2.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{match.team2.name}</span>
                        </div>
                         <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start"><ImageIcon className="mr-2 h-4 w-4" /> Видеозапись спорного момента</Button>
                            <Button variant="outline" className="w-full justify-start"><MessageSquare className="mr-2 h-4 w-4" /> Лог чата</Button>
                        </div>
                    </div>
                </div>
            </div>
             <Separator />
             <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">Помощник судьи (AI)</h4>
                    <Button variant="outline" size="sm" onClick={handleAnalyzeDispute} disabled={isAnalyzing}>
                        {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>}
                        Проанализировать заново
                    </Button>
                </div>
                {isAnalyzing && (
                    <div className="space-y-2 p-4 border border-dashed rounded-lg">
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
                            <span>Рекомендация: {getRecommendationText(aiResult.recommendation as any)}</span>
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
                    <Button className="flex-1" onClick={() => onResolve(String(match.id), `победа присуждена ${match.team1.name}`)}>
                        <Shield className="mr-2 h-4 w-4"/>Победа {match.team1.name}
                    </Button>
                    <Button className="flex-1" onClick={() => onResolve(String(match.id), `победа присуждена ${match.team2.name}`)}>
                        <Shield className="mr-2 h-4 w-4"/>Победа {match.team2.name}
                    </Button>
                    <Button className="flex-1" variant="destructive" onClick={() => onResolve(String(match.id), 'назначена переигровка')}>
                        Переигровка
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
