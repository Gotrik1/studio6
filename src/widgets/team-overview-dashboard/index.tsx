

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Trophy, Shield, Target } from 'lucide-react';
import { matchesList } from '@/shared/lib/mock-data/matches';
import { teamRoster } from '@/shared/lib/mock-data/team-details';
import Link from 'next/link';

const teamStats = {
    matches: 65,
    winrate: 69.2,
    tournamentsWon: 3,
};

const upcomingMatch = matchesList.find(m => m.status === 'Предстоящий' && (m.team1.name === 'Дворовые Атлеты' || m.team2.name === 'Дворовые Атлеты'));
const recentResults = matchesList.filter(m => m.status === 'Завершен' && (m.team1.name === 'Дворовые Атлеты' || m.team2.name === 'Дворовые Атлеты')).slice(0, 2);

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export function TeamOverviewDashboard() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard title="Процент побед" value={`${teamStats.winrate}%`} icon={Trophy} />
                    <StatCard title="Сыграно матчей" value={String(teamStats.matches)} icon={Shield} />
                    <StatCard title="Выиграно турниров" value={String(teamStats.tournamentsWon)} icon={Target} />
                </div>
                {upcomingMatch && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Следующий матч</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <Avatar>
                                        <AvatarImage src={upcomingMatch.team1.logo} data-ai-hint={upcomingMatch.team1.logoHint} />
                                        <AvatarFallback>{upcomingMatch.team1.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold">{upcomingMatch.team1.name}</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-lg">VS</p>
                                    <p className="text-xs text-muted-foreground">{upcomingMatch.date}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <p className="font-semibold">{upcomingMatch.team2.name}</p>
                                     <Avatar>
                                        <AvatarImage src={upcomingMatch.team2.logo} data-ai-hint={upcomingMatch.team2.logoHint} />
                                        <AvatarFallback>{upcomingMatch.team2.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={upcomingMatch.href || '#'}>К матчу</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )}
                 <Card>
                    <CardHeader>
                        <CardTitle>Последние результаты</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentResults.map(match => (
                            <div key={match.id} className="flex items-center justify-between text-sm">
                                <p className="text-muted-foreground">{match.tournament}</p>
                                <p>
                                    <span className="font-semibold">{match.team1.name}</span>
                                    <span className="mx-2 font-bold">{match.score}</span>
                                    <span className="font-semibold">{match.team2.name}</span>
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Состав команды</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {teamRoster.map(player => (
                            <div key={player.id} className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={player.avatar} />
                                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{player.name}</p>
                                    <p className="text-xs text-muted-foreground">{player.role}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                     <CardFooter>
                        <Button variant="outline" className="w-full" disabled>Полный состав</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
