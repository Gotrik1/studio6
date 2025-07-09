"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/shared/hooks/use-toast";
import { Loader2, Flag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { createReport } from "@/entities/report/api/reports";

interface ReportPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reportedPlayerName: string;
  reportedPlayerId: string;
}

const reportReasons = [
  "Оскорбления в чате",
  "Использование читов",
  "Спам или реклама",
  "Неспортивное поведение",
  "Другое",
];

export function ReportPlayerDialog({
  isOpen,
  onOpenChange,
  reportedPlayerName,
  reportedPlayerId,
}: ReportPlayerDialogProps) {
  const { toast } = useToast();
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!category || !details) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, выберите причину и предоставьте детали.",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await createReport({
      reportedUserId: reportedPlayerId,
      category: category,
      description: details,
    });

    if (result.success) {
      toast({
        title: "Жалоба отправлена",
        description: `Ваша жалоба на игрока ${reportedPlayerName} была отправлена на рассмотрение модераторам.`,
      });
      onOpenChange(false);
      setCategory("");
      setDetails("");
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось отправить жалобу.",
      });
    }

    setIsSubmitting(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCategory("");
      setDetails("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="text-destructive" />
            Жалоба на игрока: {reportedPlayerName}
          </DialogTitle>
          <DialogDescription>
            Помогите нам сделать платформу лучше. Все жалобы рассматриваются
            модераторами.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="reason">Причина жалобы</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Выберите причину..." />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="details">Подробности</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Опишите ситуацию как можно подробнее..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="destructive"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Отправить жалобу
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
