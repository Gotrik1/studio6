'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';

interface KdaChartProps {
  data: { month: string; kda: number }[];
}

export function KdaChart({ data }: KdaChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Динамика KDA</CardTitle>
        <CardDescription>Изменение соотношения убийств/смертей/ассистов за последние 5 месяцев.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0.8, 2.0]} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Line type="monotone" dataKey="kda" name="KDA" stroke="hsl(var(--chart-1))" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
