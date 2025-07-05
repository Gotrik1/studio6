

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Eye, BrainCircuit } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import Link from "next/link";
import { PlayerAnalysisDialog } from "@/entities/player/ui/player-analysis-dialog";
import type { CoachedPlayer } from '@/widgets/team-training-analytics';


interface MyPlayersTabProps {
    players: CoachedPlayer[];
}

export function MyPlayersTab({ players }: MyPlayersTabProps) {
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<CoachedPlayer | null>(null);

    const handleAnalyze = (player: CoachedPlayer) => {
        setSelectedPlayer(player);
        setIsAnalysisOpen(true);
    };

    return (
        <>
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
                                 <Button size="sm" variant="outline" onClick={() => handleAnalyze(player)}>
                                    <BrainCircuit className="mr-2 h-4 w-4" />
                                    AI-Анализ
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/administration/player">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Профиль
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
            <PlayerAnalysisDialog 
                isOpen={isAnalysisOpen}
                onOpenChange={setIsAnalysisOpen}
                player={selectedPlayer}
            />
        </>
    );
}
