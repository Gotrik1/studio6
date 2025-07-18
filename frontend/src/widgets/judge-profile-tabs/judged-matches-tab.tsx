"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import type { JudgedMatch } from "@/entities/user/model/types";

interface JudgedMatchesTabProps {
  matches: JudgedMatch[];
}

export function JudgedMatchesTab({ matches }: JudgedMatchesTabProps) {
  if (!matches || matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>История решений</CardTitle>
          <CardDescription>Этот судья еще не обслуживал матчи.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>История решений</CardTitle>
        <CardDescription>
          Архив рассмотренных споров и вынесенных вердиктов.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Матч</TableHead>
              <TableHead className="hidden md:table-cell">Решение</TableHead>
              <TableHead className="text-right">Дата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">
                  {match.team1.name} vs {match.team2.name}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {match.resolution}
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-xs">
                  {match.timestamp
                    ? formatDistanceToNow(new Date(match.timestamp), {
                        addSuffix: true,
                        locale: ru,
                      })
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
