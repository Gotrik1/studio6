'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Trophy, Calendar, Users } from 'lucide-react';
import type { LeagueDetails } from '@/entities/league/model/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Image from 'next/image';

interface LeagueDetailsPageProps {
  league: LeagueDetails;
}

export function LeagueDetailsPage({ league }: LeagueDetailsPageProps) {
  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
        <Card className="overflow-hidden">
            <div className="relative h-48 sm:h-64">
                <Image src={league.image || 'https://placehold.co/2560x720.png'} alt={league.name} fill className="object-cover" data-ai-hint={league.imageHint || 'league banner'} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <h1 className="font-headline text-2xl sm:text-4xl font-bold text-white shadow-lg">{league.name}</h1>
                </div>
            </div>
        </Card>
        
        <Tabs defaultValue="standings">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="standings"><Trophy className="mr-2 h-4 w-4"/>Таблица</TabsTrigger>
                <TabsTrigger value="matches"><Calendar className="mr-2 h-4 w-4"/>Матчи</TabsTrigger>
                <TabsTrigger value="teams"><Users className="mr-2 h-4 w-4"/>Команды</TabsTrigger>
            </TabsList>
            <TabsContent value="standings" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Турнирная таблица</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead>Команда</TableHead>
                                    <TableHead className="text-center">И</TableHead>
                                    <TableHead className="text-center">В</TableHead>
                                    <TableHead className="text-center">Н</TableHead>
                                    <TableHead className="text-center">П</TableHead>
                                    <TableHead className="text-right">Очки</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {league.teams.sort((a, b) => b.points - a.points).map((team, index) => (
                                    <TableRow key={team.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8"><AvatarImage src={team.logo || ''} data-ai-hint={team.logoHint}/><AvatarFallback>{team.name.charAt(0)}</AvatarFallback></Avatar>
                                                <span className="font-semibold">{team.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{team.played}</TableCell>
                                        <TableCell className="text-center text-green-500">{team.wins}</TableCell>
                                        <TableCell className="text-center text-muted-foreground">{team.draws}</TableCell>
                                        <TableCell className="text-center text-red-500">{team.losses}</TableCell>
                                        <TableCell className="text-right font-bold">{team.points}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="matches" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Расписание и результаты</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {league.matches.map(match => (
                            <div key={match.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <p className="text-sm text-muted-foreground">{format(new Date(match.date), "d MMM, EEE", {locale: ru})}</p>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <span>{match.team1.name}</span>
                                    <Avatar className="h-6 w-6"><AvatarImage src={match.team1.logo || ''} data-ai-hint={match.team1.logoHint}/></Avatar>
                                    <span className="font-bold text-lg">{match.score}</span>
                                    <Avatar className="h-6 w-6"><AvatarImage src={match.team2.logo || ''} data-ai-hint={match.team2.logoHint}/></Avatar>
                                    <span>{match.team2.name}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="teams" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Команды-участницы</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {league.teams.map(team => (
                           <div key={team.id} className="flex items-center gap-3 p-2 border rounded-md">
                                <Avatar className="h-10 w-10"><AvatarImage src={team.logo || ''} data-ai-hint={team.logoHint}/><AvatarFallback>{team.name.charAt(0)}</AvatarFallback></Avatar>
                                <p className="font-semibold">{team.name}</p>
                           </div>
                       ))}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
