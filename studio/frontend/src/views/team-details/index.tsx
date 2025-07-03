
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/shared/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Trophy, Users, Gamepad2, UserPlus, MessageCircle, Settings, Bot, BarChart3, Home, Heart } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useSession } from '@/shared/lib/session/client';
import { playgroundsList } from '@/shared/lib/mock-data/playgrounds';
import { challenges } from "@/shared/lib/mock-data/team-details";
import { DonationDialog } from '@/features/donation-dialog/index';
import { TeamChatInterface } from '@/widgets/team-chat-interface';
import { TeamStatsTab } from '@/widgets/team-stats-tab';
import { ApplyToTeamDialog } from '@/widgets/apply-to-team-dialog';
import { TeamOverviewDashboard } from '@/widgets/team-overview-dashboard';
import type { TeamDetails } from '@/entities/team/model/types';

interface TeamDetailsPageProps {
  team: TeamDetails;
}

export function TeamDetailsPage({ team }: TeamDetailsPageProps) {
    const { user: currentUser } = useSession();
    const [isDonationOpen, setIsDonationOpen] = useState(false);
    const [isApplyOpen, setIsApplyOpen] = useState(false);

    if (!team) {
        return <div>Команда не найдена.</div>;
    }

    const isCaptain = currentUser?.name === team.captainName || currentUser?.role === 'Администратор';
    const homePlayground = playgroundsList.find(p => p.id === team.homePlaygroundId);

    return (
        <>
            <div className="space-y-6 opacity-0 animate-fade-in-up">
                <Card className="overflow-hidden">
                    <div className="relative h-48 sm:h-64">
                        <Image src="https://placehold.co/2560x720.png" alt={`${team.name} banner`} fill className="object-cover" data-ai-hint="sports team banner" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 flex items-end gap-4">
                            <Avatar className="h-24 w-24 border-4 border-background">
                                <AvatarImage src={team.logo} alt={team.name} data-ai-hint={team.dataAiHint} />
                                <AvatarFallback className="text-3xl">{team.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="font-headline text-4xl font-bold text-white shadow-lg">{team.name}</h1>
                                <p className="text-lg text-white/90 shadow-md">«{team.motto}»</p>
                            </div>
                        </div>
                    </div>
                    <CardHeader className="flex-row items-center justify-between border-t p-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">Ранг: #{team.rank}</span></div>
                            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">{team.membersCount}/11 игроков</span></div>
                            <div className="flex items-center gap-2"><Gamepad2 className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">{team.game}</span></div>
                            {homePlayground && (
                                <div className="flex items-center gap-2">
                                    <Home className="h-4 w-4 text-muted-foreground" /> 
                                    <Link href={`/playgrounds/${homePlayground.id}`} className="font-semibold hover:underline">{homePlayground.name}</Link>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsDonationOpen(true)}>
                                <Heart className="mr-2 h-4 w-4 text-red-500" />Поддержать
                            </Button>
                            <Button variant="outline" onClick={() => setIsApplyOpen(true)}><UserPlus className="mr-2 h-4 w-4" />Подать заявку</Button>
                            <Button><MessageCircle className="mr-2 h-4 w-4" />Написать</Button>
                            {isCaptain && (
                                <Button asChild>
                                    <Link href={`/teams/${team.slug}/management`}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Управлять
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                </Card>

                <Tabs defaultValue="overview">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                        <TabsTrigger value="overview">Обзор</TabsTrigger>
                        <TabsTrigger value="roster">Состав</TabsTrigger>
                        <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4"/>Статистика</TabsTrigger>
                        <TabsTrigger value="chat"><Bot className="mr-2 h-4 w-4" />Чат</TabsTrigger>
                        <TabsTrigger value="challenges">Вызовы</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4">
                        <TeamOverviewDashboard />
                    </TabsContent>

                    <TabsContent value="roster" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Состав команды</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Игрок</TableHead>
                                        <TableHead>Роль</TableHead>
                                        <TableHead className="hidden md:table-cell">Рейтинг</TableHead>
                                        <TableHead className="text-right">Статус</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {team.roster.map(player => (
                                        <TableRow key={player.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={player.avatar} /><AvatarFallback>{String(player.name).charAt(0)}</AvatarFallback></Avatar>
                                                {player.name}
                                            </TableCell>
                                            <TableCell>{player.role}</TableCell>
                                            <TableCell className="hidden md:table-cell">{player.rating}</TableCell>
                                            <TableCell className="text-right"><Badge variant={player.status === 'Онлайн' ? 'default' : 'outline'}>{player.status}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="stats" className="mt-4">
                        <TeamStatsTab />
                    </TabsContent>

                    <TabsContent value="chat" className="mt-4">
                        <TeamChatInterface teamId={team.slug} />
                    </TabsContent>

                    <TabsContent value="challenges" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Входящие вызовы</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {challenges.incoming.map(challenge => (
                                        <Card key={challenge.id} className="p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8"><AvatarImage src={challenge.opponent.logo} data-ai-hint={challenge.opponent.logoHint} /></Avatar>
                                                    <p className="font-semibold">{challenge.opponent.name}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">Отклонить</Button>
                                                    <Button size="sm">Принять</Button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">{challenge.venue} @ {challenge.time}</p>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Отправленные вызовы</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                {challenges.outgoing.map(challenge => (
                                    <div key={challenge.id} className="flex items-center justify-between rounded-md border p-3">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8"><AvatarImage src={challenge.opponent.logo} data-ai-hint={challenge.opponent.logoHint} /></Avatar>
                                            <p className="font-semibold">{challenge.opponent.name}</p>
                                        </div>
                                        <Badge variant="secondary">{challenge.status}</Badge>
                                    </div>
                                ))}
                            </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <DonationDialog
                isOpen={isDonationOpen}
                onOpenChange={setIsDonationOpen}
                recipientName={team.name}
                recipientType="команде"
            />
            <ApplyToTeamDialog
                isOpen={isApplyOpen}
                onOpenChange={setIsApplyOpen}
                team={team}
            />
        </>
    );
}
