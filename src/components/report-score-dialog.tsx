'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ReportScoreDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onReportSubmit: () => void;
  matchName: string;
}

export function ReportScoreDialog({ isOpen, onOpenChange, onReportSubmit, matchName }: ReportScoreDialogProps) {
  const { toast } = useToast();
  const [score, setScore] = useState('');
  const [evidence, setEvidence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!score || !evidence) {
        toast({ variant: 'destructive', title: 'Ошибка', description: 'Пожалуйста, заполните все поля.' });
        return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({ title: 'Отчет отправлен!', description: `Результат матча "${matchName}" отправлен на проверку судье.` });
    onReportSubmit();
    onOpenChange(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Сообщить результат матча</DialogTitle>
          <DialogDescription>
            Введите итоговый счет и предоставьте доказательства.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="score">Итоговый счет</Label>
            <Input id="score" value={score} onChange={(e) => setScore(e.target.value)} placeholder="e.g., 13-9" />
          </div>
          <div>
            <Label htmlFor="evidence">Доказательства</Label>
            <Textarea id="evidence" value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="Например, ссылка на скриншот, описание видео и т.д." />
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Отправить
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
