"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import type { Measurement } from "@/entities/user/model/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface MeasurementsHistoryTableProps {
  history: Measurement[];
}

export function MeasurementsHistoryTable({
  history,
}: MeasurementsHistoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Дата</TableHead>
          <TableHead className="text-center">Вес (кг)</TableHead>
          <TableHead className="text-center">Жир (%)</TableHead>
          <TableHead className="text-center">Грудь</TableHead>
          <TableHead className="text-center">Талия</TableHead>
          <TableHead className="text-center">Бедра</TableHead>
          <TableHead className="text-center">Бицепс</TableHead>
          <TableHead className="text-center">Бедро</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">
              {format(new Date(entry.date), "d MMMM yyyy", { locale: ru })}
            </TableCell>
            <TableCell className="text-center font-bold">
              {entry.weight}
            </TableCell>
            <TableCell className="text-center">
              {entry.bodyFat ?? "-"}
            </TableCell>
            <TableCell className="text-center">{entry.chest ?? "-"}</TableCell>
            <TableCell className="text-center">{entry.waist ?? "-"}</TableCell>
            <TableCell className="text-center">{entry.hips ?? "-"}</TableCell>
            <TableCell className="text-center">{entry.biceps ?? "-"}</TableCell>
            <TableCell className="text-center">{entry.thigh ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
