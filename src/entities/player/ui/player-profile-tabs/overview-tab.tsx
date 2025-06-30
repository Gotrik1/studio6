
'use client';

import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import type { recentMatches } from "@/shared/lib/mock-data/profiles";

type Match = (typeof recentMatches)[0];

interface OverviewTabProps {
    recentMatches: Match[];
    isCurrentUser: boolean;
}

export function OverviewTab({ recentMatches, isCurrentUser }: OverviewTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Последние матчи</CardTitle>
                <CardDescription>{isCurrentUser ? "Результаты ваших недавних игр." : "Результаты недавних игр."}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentMatches.map((match) => (
                        <div key={match.id} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex flex-col gap-1 text-center">
                                <p className="font-semibold">{match.teamA}</p>
                                <p className={`font-bold text-2xl ${match.scoreA > match.scoreB ? 'text-primary' : 'text-destructive'}`}>{match.scoreA}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">{match.game}</p>
                                <p className="font-bold">VS</p>
                                <Badge variant="outline">{match.map}</Badge>
                            </div>
                            <div className="flex flex-col gap-1 text-center">
                                <p className="font-semibold">{match.teamB}</p>
                                <p className={`font-bold text-2xl ${match.scoreB > match.scoreA ? 'text-primary' : 'text-destructive'}`}>{match.scoreB}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
