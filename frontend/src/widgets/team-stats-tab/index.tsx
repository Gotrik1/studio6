"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { WinLossChart } from "@/widgets/analytics-charts/win-loss-chart";
import { Trophy, Shield, Target, Users } from "lucide-react";
import type { TeamDetails } from "@/entities/team/model/types";

interface TeamStatsTabProps {
  team: TeamDetails;
}

export function TeamStatsTab({ team }: TeamStatsTabProps) {
  const totalMatches = team.wins + team.losses + team.draws;
  const winrate = totalMatches > 0 ? (team.wins / totalMatches) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Всего матчей</CardDescription>
            <CardTitle className="font-headline text-4xl">
              {totalMatches}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Командный Winrate</CardDescription>
            <CardTitle className="font-headline text-4xl">
              {winrate.toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" /> Забито голов
            </CardDescription>
            <CardTitle className="font-headline text-3xl">128</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Пропущено голов
            </CardDescription>
            <CardTitle className="font-headline text-3xl">74</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Trophy className="h-4 w-4" /> Выиграно турниров
            </CardDescription>
            <CardTitle className="font-headline text-3xl">3</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Игроков в составе
            </CardDescription>
            <CardTitle className="font-headline text-3xl">
              {team.membersCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="grid grid-cols-1">
        <WinLossChart data={{ wins: team.wins, losses: team.losses }} />
      </div>
    </div>
  );
}
