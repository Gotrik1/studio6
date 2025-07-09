"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/shared/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";
import type { TeamDetails } from "@/entities/team/model/types";
import { createTeamApplication } from "@/entities/team-application/api/applications";

interface ApplyToTeamDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  team: Pick<TeamDetails, "name" | "slug" | "id">;
}

export function ApplyToTeamDialog({
  isOpen,
  onOpenChange,
  team,
}: ApplyToTeamDialogProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, напишите сопроводительное сообщение.",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await createTeamApplication(team.id, message);

    if (result.success) {
      toast({
        title: "Заявка отправлена!",
        description: `Ваша заявка на вступление в команду "${team.name}" была успешно отправлена.`,
      });
      onOpenChange(false);
      setMessage("");
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Заявка на вступление в &quot;{team.name}&quot;
          </DialogTitle>
          <DialogDescription>
            Напишите короткое сообщение капитану команды, чтобы рассказать о
            себе.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="message">Сопроводительное сообщение</Label>
          <Textarea
            id="message"
            placeholder="Почему вы хотите присоединиться к этой команде?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] mt-2"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Отправка..." : "Отправить заявку"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
