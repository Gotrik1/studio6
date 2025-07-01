'use client';

import type { Sport } from '@/shared/lib/mock-data/sports';
import { DynamicIcon } from '@/shared/ui/dynamic-icon';
import { icons } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { leaderboardData } from '@/shared/lib/mock-data/leaderboards';
import { allTournaments } from '@/shared/lib/mock-data/tournaments';
import { matchesList } from '@/shared/lib/mock-data/matches';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { AiSportSummary } from '@/widgets/ai-sport-summary';

interface SportDetailsPageProps {
    sport: Sport;
}

const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-amber-400 text-amber-900 border-amber-500";
    if (rank === 2) return "bg-slate-300 text-slate-800 border-slate-400";
    if (rank === 3) return "bg-orange-400 text-orange-900 border-orange-500";
    return "bg-muted";
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case "Регистрация": return "default";
        case "Идет": return "destructive";
        case "Завершен": return "outline";
        default: return "secondary";
    }
};

export function SportDetailsPage({ sport }: SportDetailsPageProps) {
    // Mock filtering, in a real app this would be an API call
    const sportTournaments = allTournaments.filter(t => t.game.toLowerCase() === sport.name.toLowerCase()).slice(0, 3);
    const sportMatches = matchesList.filter(m => m.game.toLowerCase() === sport.name.toLowerCase()).slice(0, 5);
    const topPlayers = leaderboardData.slice(0, 5); // No sport data on players, so just show top players

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-full">
                    <DynamicIcon name={sport.icon as keyof typeof icons} className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h1 className="font-headline text-4xl font-bold tracking-tight">{sport.name}</h1>
                    <Badge variant="secondary">{sport.category}</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Активные и недавние турниры</CardTitle>
                            <p className="text-sm text-muted-foreground">Главные соревнования по дисциплине {sport.name}.</p>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             {sportTournaments.length > 0 ? sportTournaments.map(t => (
                                <Link key={t.slug} href={`/tournaments/${t.slug}`}>
                                    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                        <div>
                                            <p className="font-semibold">{t.name}</p>
                                            <p className="text-xs text-muted-foreground">{t.date}</p>
                                        </div>
                                        <Badge variant={getStatusVariant(t.status)}>{t.status}</Badge>
                                    </div>
                                </Link>
                            )) : <p className="text-sm text-muted-foreground text-center p-4">Нет турниров по этой дисциплине.</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Последние матчи</CardTitle>
                        </CardHeader>
                         <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Матч</TableHead>
                                        <TableHead className="text-right">Результат</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sportMatches.length > 0 ? sportMatches.map(match => (
                                        <TableRow key={match.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6"><AvatarImage src={match.team1.logo} data-ai-hint={match.team1.logoHint} /></Avatar>
                                                    <span>{match.team1.name} vs {match.team2.name}</span>
                                                     <Avatar className="h-6 w-6"><AvatarImage src={match.team2.logo} data-ai-hint={match.team2.logoHint} /></Avatar>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">{match.score}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={2} className="text-center">Нет недавних матчей.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                         </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <AiSportSummary sportName={sport.name} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Топ-5 игроков</CardTitle>
                            <p className="text-sm text-muted-foreground">Лучшие игроки в дисциплине {sport.name}.</p>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">Ранг</TableHead>
                                        <TableHead>Игрок</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topPlayers.map((player) => (
                                        <TableRow key={player.rank}>
                                            <TableCell>
                                                <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", getRankColor(player.rank))}>
                                                    {player.rank}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.avatarHint} />
                                                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-sm">{player.name}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
