'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { RecordHistoryPoint } from '@/shared/lib/get-training-analytics';

interface PersonalRecordHistoryChartProps {
  data: RecordHistoryPoint[];
}

export function PersonalRecordHistoryChart({ data }: PersonalRecordHistoryChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Нет данных для построения графика.</div>;
  }

  const chartData = data.map(entry => ({
      date: new Date(entry.date).getTime(),
      e1RM: entry.e1RM
  })).sort((a, b) => a.date - b.date);

  const maxRecord = Math.max(...chartData.map(d => d.e1RM));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'dd.MM.yy', { locale: ru })}
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            fontSize={12}
            tickLine={false}
            axisLine={false}
        />
        <YAxis 
            domain={['dataMin - 5', 'dataMax + 5']} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            width={40}
        />
        <Tooltip 
            labelFormatter={(label) => format(new Date(label), 'd MMMM yyyy', { locale: ru })}
            formatter={(value: number) => [`${value} кг`, '1ПМ']}
            contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
            }}
        />
        <ReferenceLine y={maxRecord} label={{ value: `Max: ${maxRecord} кг`, position: 'insideTopLeft', fill: 'hsl(var(--foreground))', fontSize: 10, dy: 10, dx: -10 }} stroke="hsl(var(--primary))" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="e1RM" name="1ПМ" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
