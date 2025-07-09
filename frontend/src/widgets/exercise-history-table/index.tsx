"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import type { ExerciseSession } from "@/entities/training-program/model/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ExerciseHistoryTableProps {
  sessions: ExerciseSession[];
  limit?: number; // Optional limit for number of sessions to show
}

export function ExerciseHistoryTable({
  sessions,
  limit,
}: ExerciseHistoryTableProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Нет истории по этому упражнению.
      </div>
    );
  }

  const sessionsToShow = limit ? sessions.slice(0, limit) : sessions;

  return (
    <div className="space-y-4">
      {sessionsToShow.map((session, index) => (
        <div key={index}>
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            {format(new Date(session.date), "d MMMM yyyy", { locale: ru })} -{" "}
            <span className="italic">{session.workoutName}</span>
          </p>
          <Table className="bg-muted/50">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 h-8">Сет</TableHead>
                <TableHead className="h-8">Повторения</TableHead>
                <TableHead className="h-8">Вес (кг)</TableHead>
                <TableHead className="h-8">RPE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.sets.map((set, setIndex) => (
                <TableRow key={setIndex}>
                  <TableCell className="font-medium py-1">
                    {setIndex + 1}
                  </TableCell>
                  <TableCell className="py-1">{set.reps}</TableCell>
                  <TableCell className="py-1">{set.weight}</TableCell>
                  <TableCell className="py-1">{set.rpe ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
