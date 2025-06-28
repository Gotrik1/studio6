'use client';

import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { achievementCatalog } from "@/lib/mock-data/achievements";
import { leaderboardData, teamLeaderboardData } from "@/lib/mock-data/leaderboards";
import { ArrowRight, BarChart3, Medal, Rocket, Shield, Star, Swords, Trophy, Users, Gem, Crown, Award } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ranks } from '@/config/ranks';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


const achievementIcons = {
    Trophy, Star, Shield, Gem, Crown, Rocket, Swords, Medal, Award
};

const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case "Эпическая": return "border-purple-500 bg-purple-500/10 text-purple-500";
        case "Редкая": return "border-blue-500 bg-blue-500/10 text-blue-500";
        default: return "border-gray-500 bg-gray-500/10 text-gray-500";
    }
}

const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="h-6 w-6 text-amber-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-400" />;
    return null;
}

const rankDistributionData = [
  { rank: "Возьмите меня", players: 157 },
  { rank: "Уже бегу", players: 432 },
  { rank: "Упорный", players: 689 },
  { rank: "Уличный боец", players: 521 },
  { rank: "Кто ты, воин?", players: 312 },
  { rank: "Гроза района", players: 189 },
  { rank: "Первый среди равных", players: 98 },
  { rank: "Познавший дзен", players: 45 },
  { rank: "Неоспоримый", players: 21 },
  { rank: "Первый после бога", players: 7 },
  { rank: "Анигилятор", players: 3 },
];

const chartConfig = {
  players: {
    label: "Игроки",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function LeaderboardsPage() {
    const [roleFilter, setRoleFilter] = useState('all');
    const [periodFilter, setPeriodFilter] = useState('season');

    const filteredPlayers = useMemo(() => {
        const players = [...leaderboardData].map(p => ({ ...p })); // Create a copy to avoid mutation

        // Simulate data changes based on the period filter
        if (periodFilter === 'month') {
            // Simple deterministic shuffle and ELO adjustment for "month"
            players.sort((a, b) => a.name.localeCompare(b.name));
            players.forEach(p => p.elo = Math.round(p.elo * 0.95));
        } else if (periodFilter === 'week') {
            // Different shuffle and ELO adjustment for "week"
            players.sort((a, b) => b.name.localeCompare(a.name));
            players.forEach(p => p.elo = Math.round(p.elo * 0.98));
        }
        // 'season' uses the original order and ELO

        // Filter by role
        const roleFilteredPlayers = players;
        if (roleFilter !== 'all') {
            const roleMap = {
                'player': 'Игрок',
                'captain': 'Капитан',
                'judge': 'Судья'
            };
            const targetRole = roleMap[roleFilter as keyof typeof roleMap];
            return players.filter(player => player.role === targetRole).sort((a, b) => b.elo - a.elo).map((p, index) => ({ ...p, rank: index + 1 }));
        }

        // Re-calculate ranks based on the new order and ELO
        return roleFilteredPlayers.sort((a, b) => b.elo - a.elo).map((p, index) => ({ ...p, rank: index + 1 }));

    }, [roleFilter, periodFilter]);


    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Центр Прогресса</h1>
                <p className="text-muted-foreground">
                    Отслеживайте свой путь, соревнуйтесь с другими и открывайте новые награды.
                </p>
            </div>

            <Tabs defaultValue="players">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:grid-cols-4">
                        <TabsTrigger value="players"><BarChart3 className="mr-2 h-4 w-4" />Игроки</TabsTrigger>
                        <TabsTrigger value="ranks"><Award className="mr-2 h-4 w-4"/>Ранги</TabsTrigger>
                        <TabsTrigger value="teams"><Users className="mr-2 h-4 w-4" />Команды</TabsTrigger>
                        <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4" />Достижения</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                         <Button variant="outline">Сравнить со мной</Button>
                         <Button>Мой прогресс</Button>
                    </div>
                </div>

                <TabsContent value="players" className="mt-4">
                     <Card>
                        <CardHeader>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle>Топ игроков</CardTitle>
                                    <CardDescription>Лучшие игроки платформы за текущий период.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Select defaultValue="all" onValueChange={setRoleFilter}>
                                        <SelectTrigger className="w-full sm:w-[160px]">
                                            <SelectValue placeholder="Все роли" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Все роли</SelectItem>
                                            <SelectItem value="player">Игроки</SelectItem>
                                            <SelectItem value="captain">Капитаны</SelectItem>
                                            <SelectItem value="judge">Судьи</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select defaultValue="season" onValueChange={setPeriodFilter}>
                                        <SelectTrigger className="w-full sm:w-[160px]">
                                            <SelectValue placeholder="Период" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="season">Текущий сезон</SelectItem>
                                            <SelectItem value="month">Месяц</SelectItem>
                                            <SelectItem value="week">Неделя</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">Ранг</TableHead>
                                        <TableHead>Игрок</TableHead>
                                        <TableHead className="text-center">ELO</TableHead>
                                        <TableHead className="hidden text-center sm:table-cell">Побед/Пор.</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPlayers.slice(0, 15).map((player) => (
                                        <TableRow key={player.id} className={cn(
                                            player.rank === 1 && "bg-amber-400/10 hover:bg-amber-400/20",
                                            player.rank === 2 && "bg-slate-400/10 hover:bg-slate-400/20",
                                            player.rank === 3 && "bg-orange-400/10 hover:bg-orange-400/20"
                                        )}>
                                            <TableCell className="font-headline text-lg font-bold flex items-center gap-2">
                                                {getRankIcon(player.rank)}
                                                <span>#{player.rank}</span>
                                            </TableCell>
                                            <TableCell>
                                                 <Button asChild variant="link" className="p-0 h-auto font-semibold">
                                                    <Link href={player.profileUrl} className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.avatarHint} />
                                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-semibold text-left">{player.name}</p>
                                                            <p className="text-xs text-muted-foreground text-left">{player.team}</p>
                                                        </div>
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-center font-semibold text-primary">{player.elo}</TableCell>
                                            <TableCell className="hidden text-center sm:table-cell">
                                                <span className="text-green-600">{player.wins}</span> / <span className="text-red-600">{player.losses}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ranks" className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Система рангов</CardTitle>
                                    <CardDescription>Всего {ranks.length} уровней мастерства, отражающих прогресс игрока.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <TooltipProvider>
                                        {ranks.map((rank) => (
                                            <Card key={rank.name} className="p-4 transition-shadow hover:shadow-md">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <Award className={cn("h-8 w-8 shrink-0", rank.color)} />
                                                        <div>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <p className={cn("font-headline text-lg font-bold cursor-help", rank.color)}>{rank.name}</p>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{rank.description}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                            <p className="text-sm text-muted-foreground">{rank.description}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="secondary" className="font-mono whitespace-nowrap">
                                                        {rank.minPoints.toLocaleString()} - {rank.maxPoints === Infinity ? '∞' : rank.maxPoints.toLocaleString()} PD
                                                    </Badge>
                                                </div>
                                            </Card>
                                        ))}
                                    </TooltipProvider>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-2">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Распределение по рангам</CardTitle>
                                    <CardDescription>Количество игроков на каждом уровне.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="min-h-[450px] w-full">
                                        <BarChart
                                            accessibilityLayer
                                            data={rankDistributionData}
                                            layout="vertical"
                                            margin={{ left: 10, top: 10, right: 10 }}
                                        >
                                            <CartesianGrid horizontal={false} />
                                            <YAxis
                                                dataKey="rank"
                                                type="category"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                className="text-xs"
                                                width={120}
                                            />
                                            <XAxis dataKey="players" type="number" hide />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent indicator="dot" />}
                                            />
                                            <Bar
                                                dataKey="players"
                                                layout="vertical"
                                                fill="var(--color-players)"
                                                radius={4}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="teams" className="mt-4">
                    <Card>
                        <CardHeader>
                             <CardTitle>Топ-100 команд</CardTitle>
                             <CardDescription>Самые богатые и успешные команды платформы.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">Ранг</TableHead>
                                        <TableHead>Команда</TableHead>
                                        <TableHead className="text-right">Банк PD</TableHead>
                                        <TableHead className="text-right">Профиль</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teamLeaderboardData.map((team) => (
                                        <TableRow key={team.id} className={cn(
                                            team.rank === 1 && "bg-amber-400/10 hover:bg-amber-400/20",
                                            team.rank === 2 && "bg-slate-400/10 hover:bg-slate-400/20",
                                            team.rank === 3 && "bg-orange-400/10 hover:bg-orange-400/20"
                                        )}>
                                            <TableCell className="font-headline text-lg font-bold flex items-center gap-2">
                                                {getRankIcon(team.rank)}
                                                <span>#{team.rank}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={team.avatar} alt={team.name} data-ai-hint={team.avatarHint} />
                                                        <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">{team.name}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-primary">{team.totalPd.toLocaleString()} PD</TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={team.profileUrl}>
                                                        Перейти <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="achievements" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Все достижения</CardTitle>
                            <CardDescription>Открывайте новые награды и докажите свое мастерство.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {achievementCatalog.map((ach) => {
                                const Icon = achievementIcons[ach.icon as keyof typeof achievementIcons];
                                return (
                                    <Card key={ach.name} className="p-4 transition-shadow hover:shadow-md">
                                        <div className="flex items-start gap-4">
                                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${getRarityColor(ach.rarity)}`}>
                                                {Icon && <Icon className="h-6 w-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">{ach.name}</p>
                                                <p className="text-xs text-muted-foreground">{ach.description}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Badge variant="outline" className={`${getRarityColor(ach.rarity)}`}>{ach.rarity}</Badge>
                                                    <Badge variant="secondary">+{ach.points} XP</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
