'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HeartPulse, Medal, Rss, Calendar, ThumbsUp, MessageCircle } from 'lucide-react';
import { fanLeaderboard, weeklyPoll, followedTeamsFeed, followedTeamsMatches } from '@/lib/mock-data/fan-zone';
import { PollCard } from '@/components/poll-card';

export default function FanZonePage() {

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Medal className="h-5 w-5 text-amber-400" />;
        if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
        if (rank === 3) return <Medal className="h-5 w-5 text-orange-400" />;
        return `#${rank}`;
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
                    <HeartPulse className="h-8 w-8 text-primary" />
                    Фан-зона
                </h1>
                <p className="text-muted-foreground">
                    Ваш персональный центр болельщика. Следите за любимыми командами, голосуйте и соревнуйтесь с другими фанатами.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Rss className="h-5 w-5" />Моя лента</CardTitle>
                            <CardDescription>Новости от команд и игроков, на которых вы подписаны.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {followedTeamsFeed.map(post => (
                                <Card key={post.id}>
                                    <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={post.author.avatar} data-ai-hint={post.author.avatarHint} />
                                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{post.author.name}</p>
                                            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p>{post.content}</p>
                                    </CardContent>
                                    <CardFooter className="flex justify-start gap-4 p-4 pt-0">
                                        <Button variant="ghost" size="sm"><ThumbsUp className="mr-2 h-4 w-4"/>Лайк</Button>
                                        <Button variant="ghost" size="sm"><MessageCircle className="mr-2 h-4 w-4"/>Комментировать</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                    <PollCard poll={weeklyPoll} />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Ближайшие матчи</CardTitle>
                            <CardDescription>Игры ваших любимых команд.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {followedTeamsMatches.map(match => (
                                <div key={match.id} className="flex items-center justify-between rounded-md border p-3">
                                    <div>
                                        <p className="font-semibold text-sm">{match.team1} vs {match.team2}</p>
                                        <p className="text-xs text-muted-foreground">{match.time}</p>
                                    </div>
                                    <Button variant="outline" size="sm">К матчу</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Рейтинг фанатов</CardTitle>
                            <CardDescription>Самые активные болельщики недели.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ранг</TableHead>
                                        <TableHead>Фанат</TableHead>
                                        <TableHead className="text-right">Очки</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fanLeaderboard.map(fan => (
                                        <TableRow key={fan.rank}>
                                            <TableCell className="font-bold">{getRankIcon(fan.rank)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={fan.avatar} data-ai-hint={fan.avatarHint} />
                                                        <AvatarFallback>{fan.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{fan.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-primary">{fan.points.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
