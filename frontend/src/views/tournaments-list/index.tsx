
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Search, PlusCircle, Gamepad2, Calendar } from "lucide-react";
import { Skeleton } from '@/shared/ui/skeleton';
import { fetchTournaments } from '@/entities/tournament/api/get-tournaments';
import type { Tournament } from '@/entities/tournament/model/types';


export function TournamentsListPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [gameFilter, setGameFilter] = useState('all');

    useEffect(() => {
        async function loadTournaments() {
            try {
                const fetchedTournaments = await fetchTournaments();
                setTournaments(fetchedTournaments);
            } catch (error) {
                console.error("Failed to fetch tournaments:", error);
            } finally {
                setLoading(false);
            }
        }
        loadTournaments();
    }, []);

    const uniqueGames = useMemo(() => {
        if (loading) return ['all'];
        return ['all', ...Array.from(new Set(tournaments.map(t => t.game)))];
    }, [tournaments, loading]);

    const filteredTournaments = useMemo(() => {
        return tournaments.filter(tournament => {
            const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGame = gameFilter === 'all' || tournament.game === gameFilter;
            return matchesSearch && matchesGame;
        });
    }, [tournaments, searchQuery, gameFilter]);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Регистрация": return "default";
            case "Идет": return "destructive";
            case "Завершен": return "outline";
            default: return "secondary";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-fade-in-up">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Турниры</h1>
                    <p className="text-muted-foreground">
                        Найдите подходящий турнир и примите участие в битве за славу и призы.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/tournaments/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать турнир
                    </Link>
                </Button>
            </div>

            <Card className="opacity-0 animate-fade-in-up animation-delay-300">
                <CardHeader className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Поиск турниров..." 
                            className="w-full pl-10" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {uniqueGames.map(game => (
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
                        <Skeleton key={i} className="h-[284px] w-full" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 opacity-0 animate-fade-in-up animation-delay-600">
                    {filteredTournaments.map((tournament) => (
                        <Link key={tournament.name} href={`/tournaments/${tournament.slug}`} className="block h-full">
                            <Card className="flex flex-col overflow-hidden transition-all hover:shadow-2xl hover:border-primary h-full cursor-pointer">
                                <CardHeader className="relative h-40 w-full p-0">
                                    <Image 
                                        src={tournament.image} 
                                        alt={tournament.name} 
                                        fill 
                                        className="object-cover"
                                        data-ai-hint={tournament.dataAiHint}
                                    />
                                    <Badge variant={getStatusVariant(tournament.status)} className="absolute right-2 top-2">{tournament.status}</Badge>
                                </CardHeader>
                                <CardContent className="flex-1 p-6">
                                    <CardTitle className="font-headline">{tournament.name}</CardTitle>
                                    <CardDescription className="mt-2 flex items-center space-x-4 text-sm">
                                        <span className="flex items-center"><Gamepad2 className="mr-1.5 h-4 w-4" />{tournament.game}</span>
                                        <span className="flex items-center"><Calendar className="mr-1.5 h-4 w-4" />{tournament.date}</span>
                                    </CardDescription>
                                    <div className="mt-4 flex items-baseline gap-2">
                                        <span className="text-sm text-muted-foreground">Призовой фонд:</span>
                                        <span className="text-lg font-bold text-primary">{tournament.prize}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
            {!loading && filteredTournaments.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>Турниры не найдены. Попробуйте изменить фильтры.</p>
                </div>
            )}
        </div>
    );
}
