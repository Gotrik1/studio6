
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Measurement } from '@/shared/lib/mock-data/measurements';

interface MeasurementChartProps {
  history: Measurement[];
  metric: keyof Omit<Measurement, 'id' | 'date'>;
}

export function MeasurementChart({ history, metric }: MeasurementChartProps) {
    const data = history.map(entry => ({
        date: entry.date,
        value: entry[metric]
    })).filter(d => d.value != null && d.value > 0).reverse(); // reverse for chronological order in chart

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
            dataKey="date" 
            tickFormatter={(dateStr) => format(new Date(dateStr), 'dd.MM', { locale: ru })}
        />
        <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
        <Tooltip 
            labelFormatter={(label) => format(new Date(label), 'd MMMM yyyy', { locale: ru })}
            contentStyle={{
            background: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            }}
        />
        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
