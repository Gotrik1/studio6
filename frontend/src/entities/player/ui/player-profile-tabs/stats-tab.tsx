"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/ui/card";
import {
  Swords,
  Trophy,
  Shield,
  Flame,
  Map,
  LineChart as LineChartIcon,
} from "lucide-react";
import { WinLossChart } from "@/widgets/analytics-charts/win-loss-chart";
import { WinrateByMapChart } from "@/widgets/analytics-charts/winrate-by-map-chart";
import { KdaChart } from "@/widgets/analytics-charts/kda-chart";
import type { PlayerStats } from "@/entities/user/model/types";
import { Skeleton } from "@/shared/ui/skeleton";

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function StatsTab({ stats }: { stats: PlayerStats | null }) {
  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-1" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Всего матчей"
          value={String(stats.summary.matches)}
          icon={Trophy}
        />
        <StatCard
          title="Процент побед"
          value={`${stats.summary.winrate}%`}
          icon={Shield}
        />
        <StatCard
          title="Победная серия"
          value={String(stats.summary.winStreak)}
          icon={Flame}
        />
        <StatCard
          title="KDA (Valorant)"
          value={String(stats.summary.kda)}
          icon={Swords}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WinLossChart data={stats.winLossData} />
        </div>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" /> Винрейт по картам
              (Valorant)
            </CardTitle>
            <CardDescription>
              Процент побед на различных картах.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WinrateByMapChart data={stats.winrateByMapData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-primary" /> Динамика KDA
            (Valorant)
          </CardTitle>
          <CardDescription>
            Изменение вашего KDA за последние месяцы.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KdaChart data={stats.kdaByMonthData} />
        </CardContent>
      </Card>
    </div>
  );
}
