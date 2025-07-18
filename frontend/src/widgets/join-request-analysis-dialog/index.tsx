"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { BrainCircuit, Loader2, AlertCircle, Sparkles } from "lucide-react";
import {
  analyzeJoinRequest,
  type AnalyzeJoinRequestOutput,
} from "@/shared/api/genkit/flows/analyze-join-request-flow";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Badge } from "@/shared/ui/badge";
import type { JoinRequest } from "@/entities/team-application/model/types";

const getConfidenceColor = (confidence: "high" | "medium" | "low") => {
  switch (confidence) {
    case "high":
      return "text-green-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-orange-500";
  }
};

interface JoinRequestAnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  request: JoinRequest | null;
  teamNeeds: string;
}

export function JoinRequestAnalysisDialog({
  isOpen,
  onOpenChange,
  request,
  teamNeeds,
}: JoinRequestAnalysisDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AnalyzeJoinRequestOutput | null>(
    null,
  );
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!request) return;

    setIsAnalyzing(true);
    setAiResult(null);
    setAiError(null);

    const playerProfile = `
        Player: ${request.user.name}
        Role: ${request.user.role}
        Profile Summary: ${request.statsSummary}
      `;

    try {
      const result = await analyzeJoinRequest({
        teamNeeds,
        playerProfile,
      });
      setAiResult(result);
    } catch (e) {
      console.error(e);
      setAiError(
        "Не удалось получить рекомендацию от ИИ. Пожалуйста, попробуйте позже.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (isOpen && request) {
      handleAnalyze(); // Analyze automatically when dialog opens
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, request]);

  const onOpenChangeHandler = (open: boolean) => {
    if (!open) {
      setAiResult(null);
      setAiError(null);
    }
    onOpenChange(open);
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI-анализ заявки</DialogTitle>
          <DialogDescription>
            Анализ кандидата {request.user.name} для команды.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Анализирую профиль...
              </p>
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
            <div className="space-y-4">
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle className="flex justify-between items-center">
                  <span>
                    Рекомендация:{" "}
                    {
                      {
                        accept: "Принять",
                        consider: "Рассмотреть",
                        decline: "Отклонить",
                      }[aiResult.recommendation]
                    }
                  </span>
                  <Badge
                    variant="outline"
                    className={getConfidenceColor(aiResult.confidence)}
                  >
                    Уверенность: {aiResult.confidence}
                  </Badge>
                </AlertTitle>
                <AlertDescription>{aiResult.reasoning}</AlertDescription>
              </Alert>
              <Button className="w-full" onClick={handleAnalyze}>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Проанализировать снова
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChangeHandler(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
