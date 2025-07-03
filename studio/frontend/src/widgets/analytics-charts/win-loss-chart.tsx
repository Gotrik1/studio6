'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';

interface WinLossChartProps {
  data: { wins: number, losses: number };
}

export function WinLossChart({ data: winLossData }: WinLossChartProps) {
    const data = [
      { name: 'Победы', value: winLossData.wins, fill: 'hsl(var(--chart-1))' },
      { name: 'Поражения', value: winLossData.losses, fill: 'hsl(var(--chart-5))' },
    ];
    const total = winLossData.wins + winLossData.losses;
    const winrate = total > 0 ? (winLossData.wins / total) * 100 : 0;
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Соотношение побед</CardTitle>
        <CardDescription>Общее количество побед и поражений.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-headline text-3xl font-bold">{winrate.toFixed(1)}%</span>
            <span className="text-sm text-muted-foreground">Winrate</span>
        </div>
      </CardContent>
    </Card>
  );
}
