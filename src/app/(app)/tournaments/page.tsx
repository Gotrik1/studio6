
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, Calendar, Trophy, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { allTournaments } from '@/lib/mock-data/tournaments';

const statusFilters = ["Все", "Регистрация", "Идет", "Завершен"];

export default function TournamentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Все');

  const filteredTournaments = useMemo(() => {
    return allTournaments.filter(tournament => {
      const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tournament.game.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'Все' || tournament.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Турниры</h1>
          <p className="text-muted-foreground">Соревнуйтесь за славу и призы.</p>
        </div>
        <Button asChild>
          <Link href="/tournaments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Создать турнир
          </Link>
        </Button>
      </div>

      <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Поиск по названию или игре..." 
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                    {statusFilters.map(filter => (
                        <Button 
                            key={filter} 
                            variant={activeFilter === filter ? 'default' : 'outline'}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredTournaments.length > 0 ? (
                filteredTournaments.map((tournament) => (
                  <Link href={tournament.slug} key={tournament.name} className="flex h-full">
                    <Card className="flex w-full flex-col overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="p-0">
                        <div className="relative aspect-video w-full">
                          <Image 
                            src={tournament.image} 
                            alt={tournament.name} 
                            fill
                            className="object-cover"
                            data-ai-hint={tournament.dataAiHint}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 p-6">
                        <Badge variant="secondary" className="mb-2">{tournament.game}</Badge>
                        <CardTitle className="font-headline">{tournament.name}</CardTitle>
                        <CardDescription className="font-bold text-accent">{tournament.prize} Призовой фонд</CardDescription>
                        <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Users className="mr-1.5 h-4 w-4" />
                            <span>{tournament.participants} Команд</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1.5 h-4 w-4" />
                            <span>{tournament.date}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between bg-muted/50 p-6">
                        <Badge variant={
                            tournament.status === 'Регистрация' ? 'default' : 
                            tournament.status === 'Идет' ? 'destructive' : 'outline'
                          }>
                            {tournament.status}
                          </Badge>
                      </CardFooter>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="md:col-span-2 xl:col-span-3">
                   <Card>
                      <CardContent className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                          <Trophy className="h-12 w-12 mb-4 text-muted-foreground" />
                          <h3 className="text-xl font-semibold">Турниры не найдены</h3>
                          <p className="mt-1 text-muted-foreground">По вашему запросу ничего не найдено. Попробуйте изменить фильтры.</p>
                      </CardContent>
                  </Card>
                </div>
              )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
