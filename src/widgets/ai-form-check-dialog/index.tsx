
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
import { Loader2, BrainCircuit, AlertCircle, Upload, CheckCircle, XCircle } from "lucide-react";
import { analyzeExerciseForm, type AnalyzeExerciseFormOutput } from '@/shared/api/genkit/flows/analyze-exercise-form-flow';

interface AiFormCheckDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    exerciseName: string;
}

export function AiFormCheckDialog({ isOpen, onOpenChange, exerciseName }: AiFormCheckDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeExerciseFormOutput | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
        setError("Пожалуйста, выберите видео для анализа.");
        return;
    };

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    // In a real app, you would read the file as a data URI.
    // For this prototype, we'll just use a mock data URI.
    const mockVideoDataUri = 'data:video/mp4;base64,mock-video-data';

    try {
        const result = await analyzeExerciseForm({
            videoDataUri: mockVideoDataUri,
            exerciseName: exerciseName,
        });
        setAnalysisResult(result);
    } catch (e) {
        console.error(e);
        setError("Не удалось выполнить анализ. Пожалуйста, попробуйте еще раз.");
    } finally {
        setIsLoading(false);
    }
  };
  
  const onOpenChangeHandler = (open: boolean) => {
    if (!open) {
      setFile(null);
      setAnalysisResult(null);
      setError(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI-Проверка Техники: {exerciseName}</DialogTitle>
          <DialogDescription>
            Загрузите короткое видео (до 15 сек), чтобы AI проанализировал вашу технику выполнения.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
                <label htmlFor="video-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                            {file ? `Выбран файл: ${file.name}` : "Нажмите, чтобы загрузить видео"}
                        </p>
                    </div>
                    <input id="video-upload" type="file" className="hidden" accept="video/mp4,video/quicktime" onChange={handleFileChange} />
                </label>
                <Button onClick={handleAnalyze} disabled={isLoading || !file} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                    Проанализировать
                </Button>
            </div>

            {isLoading && (
                 <div className="space-y-4 pt-4 border-t">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
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
                <div className="space-y-4 pt-4 border-t animate-in fade-in-50">
                     <Alert>
                        <AlertTitle>Общая оценка</AlertTitle>
                        <AlertDescription>{analysisResult.overallAssessment}</AlertDescription>
                     </Alert>
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><XCircle className="h-5 w-5 text-destructive"/> Точки для исправления</h3>
                        <ul className="space-y-2">
                            {analysisResult.corrections.map((item, i) => (
                                <li key={`correction-${i}`} className="text-sm p-2 bg-muted rounded-md">
                                    <strong>{item.part}:</strong> {item.correction}
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500"/> Что сделано хорошо</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                            {analysisResult.positivePoints.map((item, i) => <li key={`positive-${i}`}>{item}</li>)}
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
