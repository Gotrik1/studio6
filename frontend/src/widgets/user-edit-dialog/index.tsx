"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { BrainCircuit, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { User } from "@/shared/lib/types";
import {
  analyzeRoleChange,
  type AnalyzeRoleChangeOutput,
} from "@/shared/api/genkit/flows/analyze-role-change-flow";

interface UserEditDialogProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUserUpdate: (userId: string, newRole: string) => void;
}

const allRoles = [
  "Администратор",
  "Модератор",
  "Капитан",
  "Игрок",
  "Судья",
  "Менеджер",
  "Организатор",
  "Спонсор",
  "Болельщик",
  "Тренер",
];

const getConfidenceColor = (confidence: "high" | "medium" | "low") => {
  switch (confidence) {
    case "high":
      return "text-green-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-orange-500";
    default:
      return "text-muted-foreground";
  }
};

const getRecommendationText = (
  rec?: AnalyzeRoleChangeOutput["recommendation"],
) => {
  switch (rec) {
    case "approve":
      return "Одобрить";
    case "deny":
      return "Отклонить";
    case "caution":
      return "Рассмотреть с осторожностью";
    default:
      return rec || "...";
  }
};

export function UserEditDialog({
  user,
  isOpen,
  onOpenChange,
  onUserUpdate,
}: UserEditDialogProps) {
  const [selectedRole, setSelectedRole] = useState(user?.role || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AnalyzeRoleChangeOutput | null>(
    null,
  );
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setSelectedRole(user.role);
    }
    if (!isOpen) {
      setAiResult(null);
      setAiError(null);
    }
  }, [user, isOpen]);

  const handleSave = () => {
    if (user) {
      onUserUpdate(user.id, selectedRole);
    }
    onOpenChange(false);
  };

  const handleAnalyze = async () => {
    if (!user) return;

    if (user.role === selectedRole) {
      setAiError("Новая роль совпадает с текущей. Анализ не требуется.");
      return;
    }

    setIsAnalyzing(true);
    setAiResult(null);
    setAiError(null);

    try {
      const result = await analyzeRoleChange({
        userName: user.name,
        currentRole: user.role,
        requestedRole: selectedRole,
        activitySummary: user.activitySummary || "Нет данных об активности",
      });
      setAiResult(result);
    } catch (e) {
      console.error(e);
      setAiError("Не удалось получить рекомендацию от ИИ.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать пользователя</DialogTitle>
          <DialogDescription>
            Изменение данных для пользователя {user.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="user-name">Имя</Label>
            <Input id="user-name" value={user.name} disabled />
          </div>
          <div>
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" value={user.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-role">Роль</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="user-role">
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                {allRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="border-t pt-4 space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
              )}
              Анализ AI для роли «{selectedRole}»
            </Button>
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
                  <span>
                    Рекомендация:{" "}
                    {getRecommendationText(aiResult.recommendation)}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(getConfidenceColor(aiResult.confidence))}
                  >
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
