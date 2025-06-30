
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { weightDynamics } from '@/shared/lib/mock-data/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { format } from 'date-fns';

export function WeightChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Динамика веса</CardTitle>
        <CardDescription>Изменение вашего веса за последний месяц (кг)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weightDynamics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(dateStr) => format(new Date(dateStr), 'dd.MM')}
            />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip 
              labelFormatter={(label) => format(new Date(label), 'd MMMM yyyy')}
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
