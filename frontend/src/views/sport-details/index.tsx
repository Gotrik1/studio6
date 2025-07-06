
'use client';

import { useMemo, useEffect, useState } from 'react';
import type { Sport } from '@/entities/sport/model/types';
import { DynamicIcon } from '@/shared/ui/dynamic-icon';
import { icons } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { LfgCard } from '@/widgets/lfg-card';
import { useLfg } from '@/app/providers/lfg-provider';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { AiSportSummary } from '@/widgets/ai-sport-summary';
import { Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useToast } from '@/shared/hooks/use-toast';
import { getPlayerLeaderboard, type PlayerLeaderboardItem } from '@/entities/leaderboard/api/get-player-leaderboard';
import { getTeamLeaderboard } from '@/entities/team/api/get-leaderboard';
import type { TeamLeaderboardItem } from '@/entities/leaderboard/model/types';
import { fetchTournaments, type Tournament } from '@/entities/tournament/api/get-tournaments';
import { Skeleton } from '@/shared/ui/skeleton';

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
    const { toast } = useToast();
    const { joinLobby: joinLfgLobby, lobbies } = useLfg();
    const [isLoading, setIsLoading] = useState(true);
    const [sportTournaments, setSportTournaments] = useState<Tournament[]>([]);
    const [topTeams, setTopTeams] = useState<TeamLeaderboardItem[]>([]);
    const [topPlayers, setTopPlayers] = useState<PlayerLeaderboardItem[]>([]);

    useEffect(() => {
      async function loadData() {
        setIsLoading(true);
        try {
          const [allTournaments, allTeams, allPlayers] = await Promise.all([
            fetchTournaments(sport.name),
            getTeamLeaderboard(sport.name),
            getPlayerLeaderboard()
          ]);
          setSportTournaments(allTournaments.slice(0, 3));
          setTopTeams(allTeams.slice(0, 5));
          setTopPlayers(allPlayers.slice(0, 10)); // Assuming a global player leaderboard for now
        } catch(e) {
            console.error(e);
            toast({variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить данные для этой дисциплины.'});
        } finally {
            setIsLoading(false);
        }
      }
      loadData();
    }, [sport.name, toast]);

    const sportLobbies = useMemo(() => lobbies.filter(l => l.sport.toLowerCase().includes(sport.name.toLowerCase())), [sport.name, lobbies]);

    const handleJoinLobby = (lobbyId: string) => {
        joinLfgLobby(lobbyId);
    };

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

            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="overview">Обзор</TabsTrigger>
                    <TabsTrigger value="leaders">Лидеры</TabsTrigger>
                    <TabsTrigger value="teams">Команды</TabsTrigger>
                    <TabsTrigger value="lfg">Поиск игры</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-6">
                    <AiSportSummary sportName={sport.name} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Активные и недавние турниры</CardTitle>
                            <CardDescription>Главные соревнования по дисциплине {sport.name}.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             {isLoading ? <Skeleton className="h-24 w-full" /> : 
                             sportTournaments.length > 0 ? sportTournaments.map(t => (
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
                </TabsContent>

                <TabsContent value="leaders" className="mt-4">
                    <Card>
                         <CardHeader>
                            <CardTitle>Таблица лидеров</CardTitle>
                            <CardDescription>Лучшие игроки в дисциплине {sport.name}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {isLoading ? <Skeleton className="h-96 w-full" /> : 
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">Ранг</TableHead>
                                            <TableHead>Игрок</TableHead>
                                            <TableHead className="text-right">Очки</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topPlayers.map((player) => (
                                            <TableRow key={player.rank}>
                                                <TableCell>
                                                    <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", getRankColor(player.rank))}>
                                                        {player.rank === 1 ? <Star className="h-4 w-4"/> : player.rank}
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
                                                <TableCell className="text-right font-semibold">{player.points.toLocaleString('ru-RU')} PD</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                             }
                         </CardContent>
                    </Card>
                </TabsContent>
                
                 <TabsContent value="teams" className="mt-4">
                    <Card>
                         <CardHeader>
                            <CardTitle>Топ команд</CardTitle>
                            <CardDescription>Лучшие команды в дисциплине {sport.name}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-64 w-full" /> : 
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                               {topTeams.map(team => (
                                   <Link key={team.slug} href={`/teams/${team.slug}`} className="block">
                                        <Card className="p-4 flex items-center gap-3 hover:bg-muted transition-colors">
                                            <Avatar>
                                                <AvatarImage src={team.logo || ''} data-ai-hint={team.dataAiHint} />
                                                <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{team.name}</p>
                                                <Badge variant="secondary" className="mt-1">Ранг #{team.rank}</Badge>
                                            </div>
                                        </Card>
                                   </Link>
                               ))}
                            </div>
                            }
                            {!isLoading && topTeams.length === 0 && <p className="text-sm text-center p-4 text-muted-foreground">Пока нет команд в этой дисциплине.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="lfg" className="mt-4">
                    <Card>
                         <CardHeader>
                            <CardTitle>Поиск игры (LFG)</CardTitle>
                            <CardDescription>Открытые лобби для игры в {sport.name}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sportLobbies.map(lobby => (
                                    <LfgCard key={lobby.id} lobby={lobby} onJoin={handleJoinLobby} />
                                ))}
                            </div>
                            {sportLobbies.length === 0 && <p className="text-sm text-center p-4 text-muted-foreground">Нет открытых лобби. Создайте свое!</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
