
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { MatchDetails } from "@/lib/mock-data/match-details";

interface LineupsTabProps {
    match: MatchDetails;
}

export function LineupsTab({ match }: LineupsTabProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
                <CardHeader><CardTitle>{match.team1.name}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {match.lineups.team1.map((player) => (
                        <div key={player.name} className="flex items-center gap-3">
                            <Avatar><AvatarImage src={player.avatar} data-ai-hint={player.avatarHint} /><AvatarFallback>{player.name.charAt(0)}</AvatarFallback></Avatar>
                            <div>
                                <p className="font-semibold">{player.name}</p>
                                <p className="text-sm text-muted-foreground">{player.role}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>{match.team2.name}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {match.lineups.team2.map((player) => (
                        <div key={player.name} className="flex items-center gap-3">
                            <Avatar><AvatarImage src={player.avatar} data-ai-hint={player.avatarHint} /><AvatarFallback>{player.name.charAt(0)}</AvatarFallback></Avatar>
                            <div>
                                <p className="font-semibold">{player.name}</p>
                                <p className="text-sm text-muted-foreground">{player.role}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
