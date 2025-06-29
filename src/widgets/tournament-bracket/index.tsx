
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { Trophy } from "lucide-react";

type Team = {
  name: string;
  logo?: string;
  dataAiHint?: string;
};

type Match = {
  id: number;
  team1?: Team;
  team2?: Team;
  score?: string;
  winner?: boolean;
  href?: string;
};

type Round = {
  name: string;
  matches: Match[];
};

interface TournamentBracketProps {
  rounds: Round[];
}

const MatchCard = ({ match }: { match: Match }) => {
    const scores = match.score?.split('-').map(s => parseInt(s, 10));
    const score1 = scores?.[0] ?? 0;
    const score2 = scores?.[1] ?? 0;
    const team1Wins = match.score ? score1 > score2 : false;
    const team2Wins = match.score ? score2 > score1 : false;

    if (match.winner && match.team1) {
        return (
            <div className="relative flex flex-col items-center gap-2 rounded-lg border-2 border-amber-400 bg-amber-400/10 p-4 shadow-lg w-52">
                <div className="absolute -top-4 rounded-full bg-amber-400 p-2 text-white shadow-md">
                    <Trophy className="h-5 w-5" />
                </div>
                <Avatar className="h-12 w-12">
                    <AvatarImage src={match.team1.logo} alt={match.team1.name} data-ai-hint={match.team1.dataAiHint} />
                    <AvatarFallback>{match.team1.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <p className="font-headline text-lg font-bold text-amber-500">ЧЕМПИОН</p>
                    <p className="font-semibold">{match.team1.name}</p>
                </div>
            </div>
        );
    }
    
    const cardContent = (
        <div className={cn("relative flex w-52 flex-col gap-2 rounded-lg border bg-card p-2 text-sm shadow-sm transition-all", match.href && "cursor-pointer hover:border-primary hover:shadow-md")}>
            {match.team1 && (
                <div className={cn("flex items-center justify-between transition-opacity", match.score && !team1Wins && "opacity-50")}>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={match.team1.logo} alt={match.team1.name} data-ai-hint={match.team1.dataAiHint}/>
                            <AvatarFallback>{match.team1.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className={cn("font-medium", team1Wins && "font-bold")}>{match.team1.name}</span>
                    </div>
                    <span className="font-bold">{score1 || ''}</span>
                </div>
            )}
            {match.score && (
                 <div className="my-1 border-t border-dashed"></div>
            )}
            {match.team2 && (
                 <div className={cn("flex items-center justify-between transition-opacity", match.score && !team2Wins && "opacity-50")}>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={match.team2.logo} alt={match.team2.name} data-ai-hint={match.team2.dataAiHint}/>
                            <AvatarFallback>{match.team2.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className={cn("font-medium", team2Wins && "font-bold")}>{match.team2.name}</span>
                    </div>
                    <span className="font-bold">{score2 || ''}</span>
                </div>
            )}
        </div>
    );

    if (match.href) {
        return (
            <Link href={match.href} className="focus:outline-none focus:ring-2 focus:ring-ring rounded-lg">
                {cardContent}
            </Link>
        )
    }

    return cardContent;
};


export function TournamentBracket({ rounds }: TournamentBracketProps) {
    return (
        <div className="w-full overflow-x-auto p-4">
            <div className="flex items-center justify-start gap-12">
                {rounds.map((round, roundIndex) => (
                    <div key={round.name} className="flex flex-col items-center flex-shrink-0">
                        <h3 className="mb-6 font-headline text-lg font-bold">{round.name}</h3>
                        <div className={cn("flex flex-col", roundIndex === 0 ? "gap-4" : roundIndex === 1 ? "gap-[5.5rem]" : "gap-[14.5rem]")}>
                            {round.matches.map((match, matchIndex) => (
                                <div key={match.id} className="relative flex items-center">
                                    <MatchCard match={match} />

                                    {/* Линии для соединения */}
                                    {roundIndex < rounds.length - 2 && (
                                        <>
                                            {/* Горизонтальная линия от карточки */}
                                            <div className="absolute left-full top-1/2 h-px w-6 bg-border"></div>
                                            {/* Вертикальная соединительная линия */}
                                            <div className={cn(
                                                "absolute h-full w-px bg-border",
                                                "left-[calc(100%_+_1.5rem)]",
                                                matchIndex % 2 === 0 ? "top-1/2" : "bottom-1/2"
                                            )}></div>
                                             {/* Горизонтальная линия к следующему раунду */}
                                            {matchIndex % 2 === 0 && (
                                                <div className="absolute left-[calc(100%_+_1.5rem)] top-1/2 h-px w-6 bg-border"></div>
                                            )}
                                        </>
                                    )}
                                     {roundIndex === rounds.length - 2 && ( // Для полуфиналов
                                        <>
                                            <div className="absolute left-full top-1/2 h-px w-6 bg-border"></div>
                                            <div className={cn(
                                                "absolute w-px bg-border",
                                                "left-[calc(100%_+_1.5rem)]",
                                                "h-[calc(100%_+_5.5rem)]",
                                                matchIndex % 2 === 0 ? "top-1/2" : "bottom-1/2"
                                             )}></div>
                                             <div className="absolute left-[calc(100%_+_1.5rem)] top-1/2 h-px w-6 bg-border"></div>
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
