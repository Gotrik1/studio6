"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useToast } from "@/shared/hooks/use-toast";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { DynamicIcon } from "@/shared/ui/dynamic-icon";
import { icons } from "lucide-react";
import {
  getSports,
  createSport,
  deleteSport,
} from "@/entities/sport/api/sports";
import type { Sport } from "@/entities/sport/model/types";
import { Skeleton } from "@/shared/ui/skeleton";

export function SportsAdminPage() {
  const { toast } = useToast();
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSport, setNewSport] = useState<{
    name: string;
    category: "Командный" | "Некомандный" | "Киберспорт";
    icon: string;
  }>({ name: "", category: "Командный", icon: "Users" });

  const fetchSports = async () => {
    setIsLoading(true);
    const data = await getSports();
    setSports(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSports();
  }, []);

  const handleAddSport = async () => {
    if (!newSport.name || !newSport.icon) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля.",
      });
      return;
    }

    if (!(newSport.icon in icons)) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: `Иконка с именем "${newSport.icon}" не найдена в lucide-react.`,
      });
      return;
    }

    setIsSubmitting(true);
    const result = await createSport(newSport);

    if (result.success) {
      await fetchSports();
      setNewSport({ name: "", category: "Командный", icon: "Users" });
      toast({
        title: "Дисциплина добавлена!",
        description: `Новая дисциплина "${newSport.name}" была успешно добавлена.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось добавить дисциплину.",
      });
    }
    setIsSubmitting(false);
  };

  const handleDeleteSport = async (sportId: string) => {
    const result = await deleteSport(sportId);
    if (result.success) {
      await fetchSports();
      toast({
        title: "Дисциплина удалена",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось удалить дисциплину.",
      });
    }
  };

  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Управление видами спорта
        </h1>
        <p className="text-muted-foreground">
          Добавляйте, редактируйте и удаляйте спортивные дисциплины, доступные
          на платформе.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Список дисциплин</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Иконка</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sports.map((sport) => (
                    <TableRow key={sport.id}>
                      <TableCell>
                        <DynamicIcon
                          name={sport.icon as keyof typeof icons}
                          className="h-5 w-5 text-muted-foreground"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {sport.name}
                      </TableCell>
                      <TableCell>{sport.category}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSport(sport.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Добавить дисциплину</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sport-name">Название</Label>
              <Input
                id="sport-name"
                placeholder="Например, Футбол"
                value={newSport.name}
                onChange={(e) =>
                  setNewSport((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sport-type">Категория</Label>
              <Select
                value={newSport.category}
                onValueChange={(
                  value: "Командный" | "Некомандный" | "Киберспорт",
                ) => setNewSport((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="sport-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Командный">Командный</SelectItem>
                  <SelectItem value="Некомандный">Некомандный</SelectItem>
                  <SelectItem value="Киберспорт">Киберспорт</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sport-icon">Название иконки (Lucide)</Label>
              <Input
                id="sport-icon"
                placeholder="Например, Futbol"
                value={newSport.icon}
                onChange={(e) =>
                  setNewSport((prev) => ({ ...prev, icon: e.target.value }))
                }
              />
            </div>
            <Button
              className="w-full"
              onClick={handleAddSport}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              Добавить
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
