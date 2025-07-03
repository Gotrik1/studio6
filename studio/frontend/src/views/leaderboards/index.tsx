'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { leaderboardData } from '@/shared/lib/mock-data/leaderboards';
import { powerLeaderboardData } from '@/shared/lib/mock-data/power-leaderboards';
import { Trophy, Dumbbell, Star } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-amber-400 text-amber-900 border-amber-500";
    if (rank === 2) return "bg-slate-300 text-slate-800 border-slate-400";
    if (rank === 3) return "bg-orange-400 text-orange-900 border-orange-500";
    return "bg-muted";
};

const PlayerLeaderboard = () => (
     <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[50px]">Ранг</TableHead>
                <TableHead>Игрок</TableHead>
                <TableHead className="text-right">Очки</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {leaderboardData.map((player) => (
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

const PowerLeaderboard = () => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[50px]">Ранг</TableHead>
                <TableHead>Игрок</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Жим лежа (кг)</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Присед (кг)</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Становая (кг)</TableHead>
                <TableHead className="text-right">Сумма (кг)</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
             {powerLeaderboardData.map((player) => (
                <TableRow key={player.rank}>
                    <TableCell>
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full font-bold", getRankColor(player.rank))}>
                             {player.rank === 1 ? <Trophy className="h-4 w-4"/> : player.rank}
                        </div>
                    </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={player.avatar} alt={player.name} />
                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{player.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{player.bench}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{player.squat}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{player.deadlift}</TableCell>
                    <TableCell className="text-right font-bold text-lg text-primary">{player.total}</TableCell>
                </TableRow>
             ))}
        </TableBody>
    </Table>
);

export function LeaderboardsPage() {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Таблицы лидеров</h1>
                <p className="text-muted-foreground">
                    Сравните свои результаты с лучшими игроками платформы.
                </p>
            </div>

            <Tabs defaultValue="players">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="players"><Star className="mr-2 h-4 w-4" /> Рейтинг игроков</TabsTrigger>
                    <TabsTrigger value="power"><Dumbbell className="mr-2 h-4 w-4" /> Силовые рекорды</TabsTrigger>
                </TabsList>
                <TabsContent value="players" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Топ игроков ProDvor</CardTitle>
                            <CardDescription>Рейтинг основан на очках, полученных в матчах и турнирах.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PlayerLeaderboard />
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="power" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Силовой рейтинг</CardTitle>
                            <CardDescription>Рейтинг основан на сумме лучших результатов в жиме лежа, приседе и становой тяге (1ПМ).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PowerLeaderboard />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
