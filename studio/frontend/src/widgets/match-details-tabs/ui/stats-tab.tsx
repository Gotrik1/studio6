'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import type { MatchDetails } from "@/entities/match/model/types";

interface StatsTabProps {
    stats: MatchDetails['teamStats'];
}

export function StatsTab({ stats }: StatsTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Статистика команд</CardTitle>
                <CardDescription>Сравнительные показатели эффективности.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {Object.values(stats).map((value) => (
                    <div key={value.label} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>{value.team1}</span>
                            <span className="capitalize text-muted-foreground">{value.label}</span>
                            <span>{value.team2}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Progress value={value.team1 / (value.team1 + value.team2) * 100} className="h-3 [&>div]:bg-primary" />
                            <Progress value={value.team2 / (value.team1 + value.team2) * 100} className="h-3 scale-x-[-1] [&>div]:bg-destructive" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
