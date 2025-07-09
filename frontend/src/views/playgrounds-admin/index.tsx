"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
import { Badge } from "@/shared/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Check, Trash2, Clock } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import Link from "next/link";
import type { Playground } from "@/entities/playground/model/types";
import { fetchWithAuth } from "@/shared/lib/api-client";
import { Skeleton } from "@/shared/ui/skeleton";

export function PlaygroundsAdminPage() {
  const { toast } = useToast();
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [statusFilter, setStatusFilter] = useState("Все");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlaygrounds = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchWithAuth("/playgrounds/admin/all");
    if (result.success && Array.isArray(result.data)) {
      setPlaygrounds(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить площадки.",
      });
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchPlaygrounds();
  }, [fetchPlaygrounds]);

  const filteredPlaygrounds = useMemo(() => {
    return playgrounds.filter((p) => {
      if (statusFilter === "Все") return true;
      if (statusFilter === "Одобренные") return p.status === "APPROVED";
      if (statusFilter === "На модерации")
        return p.status === "PENDING_MODERATION";
      return false;
    });
  }, [playgrounds, statusFilter]);

  const handleApprove = async (id: string) => {
    const result = await fetchWithAuth(`/playgrounds/admin/${id}/approve`, {
      method: "PATCH",
    });
    if (result.success) {
      toast({
        title: "Площадка одобрена",
        description: 'Статус площадки изменен на "Одобрено".',
      });
      await fetchPlaygrounds();
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error,
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await fetchWithAuth(`/playgrounds/admin/${id}`, {
      method: "DELETE",
    });
    if (result.success) {
      toast({ title: "Площадка удалена", variant: "destructive" });
      await fetchPlaygrounds();
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error,
      });
    }
  };

  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Управление площадками
        </h1>
        <p className="text-muted-foreground">
          Модерация, одобрение и удаление площадок, добавленных пользователями.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Список всех площадок</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Все">Все статусы</SelectItem>
                <SelectItem value="Одобренные">Одобренные</SelectItem>
                <SelectItem value="На модерации">На модерации</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead className="hidden md:table-cell">Адрес</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Добавил
                  </TableHead>
                  <TableHead className="text-center">Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlaygrounds.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link
                        href={`/playgrounds/${p.id}`}
                        className="font-medium hover:underline"
                      >
                        {p.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {p.address}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={p.creator.avatar || ""} />
                          <AvatarFallback>
                            {p.creator.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{p.creator.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {p.status === "APPROVED" ? (
                        <Badge
                          variant="default"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Check className="mr-1 h-3 w-3" /> Одобрено
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="bg-yellow-500 hover:bg-yellow-600"
                        >
                          <Clock className="mr-1 h-3 w-3" /> На модерации
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {p.status === "PENDING_MODERATION" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => handleApprove(p.id)}
                        >
                          <Check className="mr-1 h-4 w-4 text-green-500" />{" "}
                          Одобрить
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p.id)}
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
    </div>
  );
}
