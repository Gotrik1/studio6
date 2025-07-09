"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { Measurement } from "@/entities/user/model/types";

const metricLabels: Record<keyof Omit<Measurement, "id" | "date">, string> = {
  weight: "Вес",
  bodyFat: "Жир (%)",
  chest: "Грудь (см)",
  waist: "Талия (см)",
  hips: "Бедра (см)",
  biceps: "Бицепс (см)",
  thigh: "Бедро (см)",
};

interface MeasurementChartProps {
  history: Measurement[];
  metric: keyof Omit<Measurement, "id" | "date">;
}

export function MeasurementChart({ history, metric }: MeasurementChartProps) {
  const data = history
    .map((entry) => ({
      date: new Date(entry.date).getTime(),
      value: entry[metric],
    }))
    .filter((d) => d.value != null && d.value > 0)
    .sort((a, b) => a.date - b.date);

  const metricLabel = metricLabels[metric] || "Значение";

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => format(new Date(date), "dd.MM")}
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={["dataMin - 1", "dataMax + 1"]}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          labelFormatter={(label) =>
            format(new Date(label), "d MMMM yyyy", { locale: ru })
          }
          formatter={(value: number) => [`${value}`, metricLabel]}
          contentStyle={{
            background: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          name={metricLabel}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
