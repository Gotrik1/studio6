'use client';

import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { matchesList as allMatches } from "@/lib/mock-data/matches";
import { Calendar, PlusCircle, Search, Swords, Video } from "lucide-react";
import Link from "next/link";

const statusFilters = ["Все", "Идет", "Предстоящий", "Завершен"];

export default function MatchesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Все');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Завершен":
        return "outline";
      case "Идет":
        return "destructive";
      case "Предстоящий":
        return "default";
      default:
        return "secondary";
    }
  };

  const filteredMatches = useMemo(() => {
    return allMatches.filter(match => {
      const lowercasedQuery = searchQuery.toLowerCase();
      const matchesSearch = !lowercasedQuery ||
        match.team1.name.toLowerCase().includes(lowercasedQuery) ||
        match.team2.name.toLowerCase().includes(lowercasedQuery) ||
        match.tournament.toLowerCase().includes(lowercasedQuery);
      
      const matchesFilter = activeFilter === 'Все' || match.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Список матчей</h1>
          <p className="text-muted-foreground">Следите за прошедшими, текущими и будущими играми.</p>
        </div>
        <Button asChild>
          <Link href="/matches/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Создать матч
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Поиск по команде, турниру или игре..." 
                className="w-full pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {statusFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter)}
                  className="w-full md:w-auto"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <Card key={match.id} className="transition-shadow hover:shadow-md">
                  <div className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
                    <div className="flex w-full items-center justify-between sm:w-auto sm:justify-start sm:gap-4">
                      <div className="flex items-center gap-2 text-right sm:gap-4 sm:text-left">
                        <span className="hidden font-semibold sm:block">{match.team1.name}</span>
                        <Avatar>
                          <AvatarImage src={match.team1.logo} data-ai-hint={match.team1.logoHint} />
                          <AvatarFallback>{match.team1.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-center">
                        <p className="font-headline text-2xl font-bold">{match.score}</p>
                        {match.status === 'Идет' && <Badge variant="destructive" className="animate-pulse">LIVE</Badge>}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4">
                         <Avatar>
                          <AvatarImage src={match.team2.logo} data-ai-hint={match.team2.logoHint} />
                          <AvatarFallback>{match.team2.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="hidden font-semibold sm:block">{match.team2.name}</span>
                      </div>
                    </div>
                    <div className="w-full border-t sm:hidden" />
                    <div className="flex w-full items-center justify-between sm:w-auto sm:flex-col sm:items-center sm:justify-center sm:gap-1">
                       <p className="text-xs font-semibold text-muted-foreground sm:text-sm">{match.tournament}</p>
                       <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> {match.date}
                       </div>
                    </div>
                    <div className="flex w-full shrink-0 flex-row items-center justify-between gap-2 sm:w-auto sm:flex-col sm:items-end">
                       <Badge variant={getStatusVariant(match.status)} className="w-24 justify-center">{match.status}</Badge>
                      <Button asChild size="sm" variant={match.status === "Идет" ? "default" : "outline"}>
                        <Link href={match.href}>
                          {match.status === "Идет" ? <Video className="mr-2 h-4 w-4" /> : <Swords className="mr-2 h-4 w-4" />}
                          {match.status === "Идет" ? "Смотреть" : "Подробнее"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                <Search className="h-12 w-12 mb-4 text-muted-foreground" />
                <CardTitle>Матчи не найдены</CardTitle>
                <CardDescription className="mt-2">По вашему запросу ничего не найдено. Попробуйте изменить поисковый запрос.</CardDescription>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
