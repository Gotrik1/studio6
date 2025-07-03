'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/shared/ui/input';
import { smartSearch, type SmartSearchOutput } from '@/shared/api/genkit/flows/smart-search-flow';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { Trophy, Loader2, Search, Users, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import Link from 'next/link';

export function GlobalSearchWidget() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SmartSearchOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const searchResults = await smartSearch(searchQuery);
        setResults(searchResults);
      } catch (err) {
        console.error("Global search failed:", err);
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (query) {
      setLoading(true);
      debouncedSearch(query);
    } else {
      setResults(null);
      setLoading(false);
    }
  }, [query, debouncedSearch]);

  const onSelect = (path: string) => {
    router.push(path);
  };
  
  const hasResults = results && (results.users.length > 0 || results.teams.length > 0 || results.tournaments.length > 0);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Общий поиск</CardTitle>
            <CardDescription>Поиск по командам, игрокам, турнирам и многому другому.</CardDescription>
             <div className="relative pt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-[-4px] h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Введите ваш запрос..."
                    className="w-full pl-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
             {loading && <div className="p-4 flex justify-center items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/></div>}
             
             {!loading && !query && (
                 <div className="text-center text-muted-foreground p-8">Начните вводить запрос для поиска.</div>
            )}

            {!loading && query && !hasResults && (
                <div className="text-center text-muted-foreground p-8">Ничего не найдено.</div>
            )}

            {hasResults && (
                <div className="space-y-6">
                    {results.teams.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm px-2 flex items-center gap-2"><Shield className="h-4 w-4" /> Команды</h4>
                            {results.teams.map((team) => (
                                <Button key={team.slug} variant="ghost" className="w-full justify-start h-auto p-2" onClick={() => onSelect(`/teams/${team.slug}`)}>
                                    <Avatar className="mr-3 h-8 w-8"><AvatarImage src={team.logo} data-ai-hint={team.dataAiHint} /><AvatarFallback>{team.name.charAt(0)}</AvatarFallback></Avatar>
                                    <span>{team.name}</span>
                                </Button>
                            ))}
                        </div>
                    )}
                     {results.users.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm px-2 flex items-center gap-2"><Users className="h-4 w-4" /> Игроки</h4>
                            {results.users.map((user) => (
                                <Button key={user.id} variant="ghost" className="w-full justify-start h-auto p-2" onClick={() => onSelect(user.profileUrl)}>
                                    <Avatar className="mr-3 h-8 w-8"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>
                                    <span>{user.name}</span>
                                </Button>
                            ))}
                        </div>
                    )}
                     {results.tournaments.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm px-2 flex items-center gap-2"><Trophy className="h-4 w-4" /> Турниры</h4>
                            {results.tournaments.map((tournament) => (
                                <Button key={tournament.slug} variant="ghost" className="w-full justify-start h-auto p-2" onClick={() => onSelect(`/tournaments/${tournament.slug}`)}>
                                    <div className="h-8 w-8 mr-3 flex items-center justify-center bg-muted rounded-sm">
                                        <Trophy className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <span>{tournament.name}</span>
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </CardContent>
    </Card>
  );
}
