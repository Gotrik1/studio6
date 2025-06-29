'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useTeams } from '@/app/providers/team-provider';
import type { Team } from "@/entities/team/model/types";
import { Search, PlusCircle, Gamepad2, Users } from "lucide-react";
import { Skeleton } from '@/shared/ui/skeleton';

export function TeamsListPage() {
    const { teams, loading } = useTeams();
    const [searchQuery, setSearchQuery] = useState('');
    const [gameFilter, setGameFilter] = useState('all');

    const uniqueGames = useMemo(() => {
        if (loading) return ['all'];
        return ['all', ...Array.from(new Set(teams.map(t => t.game)))];
    }, [teams, loading]);

    const filteredTeams = useMemo(() => {
        return teams.filter(team => {
            const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) || team.motto.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGame = gameFilter === 'all' || team.game === gameFilter;
            return matchesSearch && matchesGame;
        });
    }, [teams, searchQuery, gameFilter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Команды</h1>
                    <p className="text-muted-foreground">
                        Найдите свою команду или создайте новую, чтобы покорять вершины.
                    </p>
                </div>
                 <Button asChild>
                    <Link href="/teams/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать команду
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Поиск команд..." 
                            className="w-full pl-10" 
                            value={searchQuery}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {uniqueGames.map((game: string) => (
                            <Button 
                                key={game} 
                                variant={gameFilter === game ? "default" : "outline"}
                                onClick={() => setGameFilter(game)}
                            >
                                {game === 'all' ? 'Все игры' : game}
                            </Button>
                        ))}
                    </div>
                </CardHeader>
            </Card>

            {loading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}><Skeleton className="h-48 w-full" /></Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredTeams.map((team: Team) => (
                        <Card key={team.slug} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center gap-4 p-4">
                                <Image 
                                  src={team.logo} 
                                  alt={`Логотип ${team.name}`} 
                                  width={64} 
                                  height={64} 
                                  className="rounded-full border"
                                  data-ai-hint={team.dataAiHint}
                                />
                                <div>
                                    <CardTitle className="font-headline">{team.name}</CardTitle>
                                    <CardDescription>&quot;{team.motto}&quot;</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-4 pt-0">
                               <div className="flex justify-between text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><Gamepad2 className="h-4 w-4"/> {team.game}</span>
                                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4"/> {team.members}/5</span>
                               </div>
                               <div className="mt-2 text-center">
                                    <Badge variant="secondary">Ранг: #{team.rank}</Badge>
                               </div>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4">
                                <Button className="w-full" asChild>
                                    <Link href={`/teams/${team.slug}`}>Профиль команды</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
             {!loading && filteredTeams.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>Команды не найдены. Попробуйте изменить фильтры.</p>
                </div>
            )}
        </div>
    );
}
