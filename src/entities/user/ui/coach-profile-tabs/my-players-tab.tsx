
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import type { CoachedPlayer } from "@/shared/lib/mock-data/coach-players";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { BrainCircuit } from "lucide-react";
import { Badge } from "@/shared/ui/badge";

interface MyPlayersTabProps {
    players: CoachedPlayer[];
    onAnalyzePlayer: (player: CoachedPlayer) => void;
}

export function MyPlayersTab({ players, onAnalyzePlayer }: MyPlayersTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Мои игроки</CardTitle>
                <CardDescription>Список игроков под вашим руководством.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {players.map(player => (
                    <Card key={player.id} className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
                        <div className="flex items-center gap-4 self-start">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.avatarHint} />
                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{player.name}</p>
                                <p className="text-sm text-muted-foreground">{player.role}</p>
                            </div>
                        </div>
                        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
                            <Badge variant="secondary">KDA: {player.stats.kda}</Badge>
                            <Badge variant="outline">WR: {player.stats.winRate}</Badge>
                            <Button size="sm" onClick={() => onAnalyzePlayer(player)}>
                                <BrainCircuit className="mr-2 h-4 w-4" />
                                AI-Анализ
                            </Button>
                        </div>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}
