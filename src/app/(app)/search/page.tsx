'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Users, Trophy, User, Hash, Gamepad2, Skull, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { smartSearch, type SmartSearchOutput } from '@/ai/flows/smart-search-flow';
import debounce from 'lodash.debounce';

// We need the types for rendering, so let's define them or import from the flow
type UserResult = SmartSearchOutput['users'][0];
type TeamResult = SmartSearchOutput['teams'][0];
type TournamentResult = SmartSearchOutput['tournaments'][0];


export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<SmartSearchOutput>({ users: [], teams: [], tournaments: [] });

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (searchQuery: string) => {
            if (!searchQuery.trim()) {
                setResults({ users: [], teams: [], tournaments: [] });
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const searchResults = await smartSearch(searchQuery);
                setResults(searchResults);
            } catch (err) {
                console.error("AI Search failed:", err);
                setError("Не удалось выполнить поиск. Пожалуйста, попробуйте еще раз.");
            } finally {
                setIsLoading(false);
            }
        }, 500), // 500ms debounce delay
        []
    );

    useEffect(() => {
        if (query.trim()) {
            setIsLoading(true);
            debouncedSearch(query);
        } else {
            setIsLoading(false);
            setResults({ users: [], teams: [], tournaments: [] });
            debouncedSearch.cancel();
        }
        
        // Cancel the debounce on useEffect cleanup
        return () => {
            debouncedSearch.cancel();
        };
    }, [query, debouncedSearch]);

    const totalResults = results.users.length + results.teams.length + results.tournaments.length;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Интеллектуальный поиск</h1>
                <p className="text-muted-foreground">
                    Задайте вопрос или введите ключевые слова. Наш AI найдет то, что вам нужно.
                </p>
            </div>

            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Например, 'команды из Москвы по Valorant' или 'турниры с призовым фондом > $5000'"
                    className="w-full pl-10 h-12 text-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                 {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
            </div>

            {query.trim() ? (
                 <>
                    {error && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                    
                    {!isLoading && !error && (
                        <Tabs defaultValue="all" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="all">Все ({totalResults})</TabsTrigger>
                                <TabsTrigger value="users">Игроки ({results.users.length})</TabsTrigger>
                                <TabsTrigger value="teams">Команды ({results.teams.length})</TabsTrigger>
                                <TabsTrigger value="tournaments">Турниры ({results.tournaments.length})</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all" className="mt-4">
                                {totalResults > 0 ? (
                                    <div className="space-y-6">
                                        {results.users.length > 0 && <UserResults users={results.users} />}
                                        {results.teams.length > 0 && <TeamResults teams={results.teams} />}
                                        {results.tournaments.length > 0 && <TournamentResults tournaments={results.tournaments} />}
                                    </div>
                                ) : <NoResults />}
                            </TabsContent>
                            <TabsContent value="users" className="mt-4">
                                {results.users.length > 0 ? <UserResults users={results.users} /> : <NoResults />}
                            </TabsContent>
                            <TabsContent value="teams" className="mt-4">
                                {results.teams.length > 0 ? <TeamResults teams={results.teams} /> : <NoResults />}
                            </TabsContent>
                            <TabsContent value="tournaments" className="mt-4">
                                {results.tournaments.length > 0 ? <TournamentResults tournaments={results.tournaments} /> : <NoResults />}
                            </TabsContent>
                        </Tabs>
                    )}
                 </>
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 rounded-lg border-2 border-dashed">
                    <SearchIcon className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-semibold">Начните поиск</h3>
                    <p>Введите запрос, чтобы найти то, что вам нужно.</p>
                </div>
            )}
        </div>
    );
}

const NoResults = () => (
    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 rounded-lg border-2 border-dashed">
        <Skull className="h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">Ничего не найдено</h3>
        <p>По вашему запросу нет результатов. Попробуйте другие ключевые слова.</p>
    </div>
);

const UserResults = ({ users }: { users: UserResult[] }) => (
    <section className="space-y-4">
        <h2 className="font-headline text-2xl font-bold flex items-center gap-2"><User /> Игроки</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => (
                <Link key={user.id} href={user.profileUrl}>
                    <Card className="h-full transition-shadow hover:shadow-md">
                        <CardContent className="p-4 flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.role}</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </section>
);

const TeamResults = ({ teams }: { teams: TeamResult[] }) => (
    <section className="space-y-4">
        <h2 className="font-headline text-2xl font-bold flex items-center gap-2"><Users /> Команды</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => (
                <Link key={team.name} href={`/teams/${team.slug}`}>
                    <Card className="h-full transition-shadow hover:shadow-md">
                        <CardHeader className="flex-row items-center gap-4 p-4">
                            <Image src={team.logo} alt={team.name} width={48} height={48} className="rounded-full border" data-ai-hint={team.dataAiHint} />
                            <div>
                                <CardTitle className="text-lg">{team.name}</CardTitle>
                                <CardDescription className="text-xs italic">"{team.motto}"</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex justify-between text-sm">
                            <Badge variant="secondary"><Hash className="h-3 w-3 mr-1" />{team.rank}</Badge>
                            <span className="text-muted-foreground">{team.members}/5</span>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </section>
);

const TournamentResults = ({ tournaments }: { tournaments: TournamentResult[] }) => (
    <section className="space-y-4">
        <h2 className="font-headline text-2xl font-bold flex items-center gap-2"><Trophy /> Турниры</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map(tournament => (
                 <Link key={tournament.name} href={`/tournaments/${tournament.slug}`}>
                    <Card className="h-full transition-shadow hover:shadow-md overflow-hidden">
                        <div className="relative h-24">
                           <Image src={tournament.image} alt={tournament.name} fill className="object-cover" data-ai-hint={tournament.dataAiHint} />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">{tournament.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 pt-1">
                                <Badge variant="secondary"><Gamepad2 className="h-3 w-3 mr-1" />{tournament.game}</Badge>
                                <Badge variant="outline">{tournament.status}</Badge>
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>
    </section>
);
