
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, SlidersHorizontal, Map } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";
import { fetchTeams, type Team } from "@/lib/api/teams";
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTeams() {
      try {
        const fetchedTeams = await fetchTeams();
        setTeams(fetchedTeams);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      } finally {
        setLoading(false);
      }
    }
    getTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    if (!searchQuery) return teams;
    return teams.filter(team =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.motto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.captain.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teams, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Каталог команд</h1>
        <p className="text-muted-foreground">
          Найди команду своей мечты или создай новую. На платформе уже {loading ? '...' : `${teams.length}`} команд!
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Поиск по названию, девизу или капитану..." 
                  className="w-full pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="w-full md:w-auto">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Фильтры
                </Button>
                 <Button variant="outline" className="w-full md:w-auto">
                  <Map className="mr-2 h-4 w-4" />
                  Показать на карте
                </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
            <Separator className="mb-6" />
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed bg-muted/50 p-6 text-center transition-colors hover:border-primary">
                    <CardTitle className="font-headline">Создай свою команду</CardTitle>
                    <CardDescription>Собери друзей, выбери название и начни свой путь к славе.</CardDescription>
                    <Button asChild>
                        <Link href="/teams/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Создать команду
                        </Link>
                    </Button>
                </Card>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="flex-row items-start gap-4 bg-muted/30 p-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 p-4">
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                      <CardFooter className="flex justify-between bg-muted/20 p-4">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-6 w-1/3" />
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  filteredTeams.map((team) => (
                    <Link href={team.slug === "#" ? "#" : `/teams/${team.slug}`} key={team.name} className="flex h-full">
                      <Card className="flex w-full flex-col overflow-hidden transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-start gap-4 bg-muted/30 p-4">
                          <Image 
                            src={team.logo} 
                            alt={`Логотип ${team.name}`} 
                            width={64} 
                            height={64} 
                            className="rounded-full border-2 border-background"
                            data-ai-hint={team.dataAiHint}
                          />
                          <div className="flex-1">
                              <CardTitle className="font-headline text-lg">{team.name}</CardTitle>
                              <CardDescription className="line-clamp-2 text-xs italic">"{team.motto}"</CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-4">
                          <div className="text-xs text-muted-foreground">Капитан: <span className="font-medium text-foreground">{team.captain}</span></div>
                        </CardContent>
                        <CardFooter className="flex justify-between bg-muted/20 p-4 text-sm">
                          <Badge variant="secondary">Ранг #{team.rank}</Badge>
                          <div className="text-muted-foreground">{team.members}/5 Участников</div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
