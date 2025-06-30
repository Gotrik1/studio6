
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { volumeByMuscleGroup } from '@/shared/lib/mock-data/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';

export function VolumeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Тренировочный объем по группам мышц</CardTitle>
        <CardDescription>Общий тоннаж за последний месяц (кг)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={volumeByMuscleGroup}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
