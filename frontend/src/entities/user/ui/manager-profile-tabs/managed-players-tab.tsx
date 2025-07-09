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
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { getUsers } from "@/entities/user/api/get-users";
import { useEffect, useState } from "react";
import type { User } from "@/shared/lib/types";
import { Skeleton } from "@/shared/ui/skeleton";

interface PlayerWithSport extends User {
  mainSport: string;
}

export function ManagedPlayersTab() {
  const [players, setPlayers] = useState<PlayerWithSport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then((users) => {
      setPlayers(
        users.slice(0, 3).map((u: User) => ({ ...u, mainSport: "Valorant" })),
      ); // Add mock game
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управляемые игроки</CardTitle>
        <CardDescription>
          Список игроков, находящихся под вашим управлением.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Игрок</TableHead>
              <TableHead className="hidden md:table-cell">Дисциплина</TableHead>
              <TableHead className="text-right">Действие</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={player.avatar || undefined}
                        alt={player.name}
                      />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{player.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {player.mainSport}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/profiles/player/${player.id}`}>Профиль</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
