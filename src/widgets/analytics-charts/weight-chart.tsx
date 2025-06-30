
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface WeightChartProps {
    data: { date: string, weight?: number | null }[];
}

export function WeightChart({ data }: WeightChartProps) {
    const chartData = data
        .filter(d => d.weight != null)
        .map(d => ({...d, date: new Date(d.date).getTime() }))
        .sort((a,b) => a.date - b.date);

    return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'dd.MM')}
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis domain={['auto', 'auto']} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              labelFormatter={(label) => format(new Date(label), 'd MMMM yyyy', { locale: ru })}
              formatter={(value: number) => [`${value} кг`, 'Вес']}
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Line type="monotone" dataKey="weight" name="Вес" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
    );
}
