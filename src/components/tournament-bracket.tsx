'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

type Team = {
  name: string;
};

type Match = {
  id: number;
  team1?: Team;
  team2?: Team;
  score?: string;
  winner?: boolean;
};

type Round = {
  name: string;
  matches: Match[];
};

interface TournamentBracketProps {
  rounds: Round[];
}

const MatchCard = ({ match, isFinalRound }: { match: Match; isFinalRound: boolean }) => (
    <div className="flex flex-col justify-center">
        <div className={cn("relative flex w-48 flex-col justify-between rounded-lg border bg-card p-2 text-xs shadow-sm", match.winner && "border-2 border-amber-400 bg-amber-400/10")}>
            {match.winner && (
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 p-1 text-white">
                    <Trophy className="h-4 w-4" />
                 </div>
            )}
            {match.team1 && (
                <div className="flex items-center justify-between">
                    <span className="font-semibold">{match.team1.name}</span>
                    <span className="font-bold">{match.score?.split('-')[0]}</span>
                </div>
            )}
            {match.score && (
                 <div className="my-1 border-t border-dashed"></div>
            )}
            {match.team2 && (
                 <div className="flex items-center justify-between">
                    <span className="font-semibold">{match.team2.name}</span>
                    <span className="font-bold">{match.score?.split('-')[1]}</span>
                </div>
            )}
             {!match.team2 && match.team1 && (
                 <div className="text-center font-bold text-lg text-amber-500 py-2">Чемпион</div>
            )}
        </div>
    </div>
);


export function TournamentBracket({ rounds }: TournamentBracketProps) {
    return (
        <div className="w-full overflow-x-auto p-4">
            <div className="flex justify-start gap-8">
                {rounds.map((round, roundIndex) => (
                    <div key={round.name} className="flex flex-col items-center">
                        <h3 className="mb-4 font-headline text-lg font-bold">{round.name}</h3>
                        <div className="flex flex-col gap-8">
                            {round.matches.map((match, matchIndex) => (
                                <div key={match.id} className="relative flex items-center">
                                    <MatchCard match={match} isFinalRound={round.name === 'Чемпион'} />

                                    {/* Линии для соединения */}
                                    {roundIndex < rounds.length - 2 && (
                                        <>
                                            {/* Горизонтальная линия от карточки */}
                                            <div className="absolute left-full top-1/2 h-px w-4 bg-border"></div>
                                            {/* Вертикальная соединительная линия */}
                                            <div className={cn(
                                                "absolute h-full w-px bg-border",
                                                "left-[calc(100%_+_1rem)]",
                                                matchIndex % 2 === 0 ? "top-1/2" : "bottom-1/2"
                                            )}></div>
                                             {/* Горизонтальная линия к следующему раунду */}
                                            {matchIndex % 2 === 0 && (
                                                <div className="absolute left-[calc(100%_+_1rem)] top-1/2 h-px w-4 bg-border"></div>
                                            )}
                                        </>
                                    )}
                                     {roundIndex === rounds.length - 2 && ( // Для полуфиналов
                                        <>
                                            <div className="absolute left-full top-1/2 h-px w-4 bg-border"></div>
                                            <div className="absolute left-[calc(100%_+_1rem)] top-1/2 h-16 w-px bg-border"></div>
                                        </>
                                     )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
