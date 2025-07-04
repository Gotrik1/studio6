'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Trophy, Star, Gamepad2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import type { TeamLeaderboardItem, PlayerLeaderboardItem } from '@/entities/leaderboard/model/types';
import Link from 'next/link';

const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-amber-400 text-amber-900 border-amber-500";
    if (rank === 2) return "bg-slate-300 text-slate-800 border-slate-400";
    if (rank === 3) return "bg-orange-400 text-orange-900 border-orange-500";
    return "bg-muted";
};

const PlayerLeaderboard = ({ players }: { players: PlayerLeaderboardItem[] }) => (
     <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[50px]">Ранг</TableHead>
                <TableHead>Игрок</TableHead>
                <TableHead className="text-right">Очки</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {players.map((player) => (
                <TableRow key={player.rank}>
                    <TableCell>
                        <div className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full font-bold",
                            getRankColor(player.rank)
                        )}>
                            {player.rank === 1 ? <Star className="h-4 w-4"/> : player.rank}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.avatarHint} />
                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{player.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{player.points.toLocaleString('ru-RU')} PD</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

const TeamLeaderboard = ({ teams }: { teams: TeamLeaderboardItem[] }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[50px]">Ранг</TableHead>
                <TableHead>Команда</TableHead>
                <TableHead className="hidden sm:table-cell">Игра</TableHead>
                <TableHead className="text-center">Победы</TableHead>
                <TableHead className="text-center">Поражения</TableHead>
                <TableHead className="text-right">Ничьи</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {teams.map((team, index) => (
                <TableRow key={team.id}>
                    <TableCell>
                         <div className={cn("flex h-8 w-8 items-center justify-center rounded-full font-bold", getRankColor(index + 1))}>
                            {index + 1 === 1 ? <Trophy className="h-4 w-4"/> : index + 1}
                        </div>
                    </TableCell>
                    <TableCell>
                        <Link href={`/teams/${team.slug}`} className="flex items-center gap-4 hover:underline">
                            <Avatar>
                                <AvatarImage src={team.logo} alt={team.name} data-ai-hint={team.dataAiHint} />
                                <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{team.name}</span>
                        </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{team.game}</TableCell>
                    <TableCell className="text-center font-semibold text-green-500">{team.wins}</TableCell>
                    <TableCell className="text-center font-semibold text-red-500">{team.losses}</TableCell>
                    <TableCell className="text-right font-semibold">{team.draws}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

interface LeaderboardsClientProps {
    playerLeaderboard: PlayerLeaderboardItem[];
    teamLeaderboard: TeamLeaderboardItem[];
}

export default function LeaderboardsClient({ playerLeaderboard, teamLeaderboard }: LeaderboardsClientProps) {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Таблицы лидеров</h1>
                <p className="text-muted-foreground">
                    Сравните свои результаты с лучшими игроками и командами платформы.
                </p>
            </div>

            <Tabs defaultValue="players">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="players"><Star className="mr-2 h-4 w-4" /> Рейтинг игроков</TabsTrigger>
                    <TabsTrigger value="teams"><Gamepad2 className="mr-2 h-4 w-4" /> Рейтинг команд</TabsTrigger>
                </TabsList>
                <TabsContent value="players" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Топ игроков ProDvor</CardTitle>
                            <CardDescription>Рейтинг основан на очках, полученных в матчах и турнирах.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PlayerLeaderboard players={playerLeaderboard} />
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="teams" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Топ команд ProDvor</CardTitle>
                            <CardDescription>Рейтинг основан на количестве побед и поражений.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TeamLeaderboard teams={teamLeaderboard} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
