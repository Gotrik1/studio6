

'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/shared/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Trophy, Users, Gamepad2, UserPlus, MessageCircle, Settings, Bot, BarChart3, Home, Heart, Loader2 } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useSession } from '@/shared/lib/session/client';
import { DonationDialog } from '@/features/donation-dialog/index';
import { TeamChatInterface } from '@/widgets/team-chat-interface';
import { TeamStatsTab } from '@/widgets/team-stats-tab';
import type { TeamDetails } from '@/entities/team/model/types';
import { useToast } from '@/shared/hooks/use-toast';
import { joinTeamAction } from '@/entities/team/api/join-team';
import type { Playground } from '@/entities/playground/model/types';
import { getPlaygroundById } from '@/entities/playground/api/playgrounds';
import { TeamOverviewDashboard } from '@/widgets/team-overview-dashboard';
import type { Match } from '@/entities/match/model/types';
import { getTeamDashboardData, type TeamDashboardData } from '@/entities/team/api/get-team-dashboard';


interface TeamDetailsPageProps {
  team: TeamDetails;
}

export function TeamDetailsPage({ team }: TeamDetailsPageProps) {
    const { user: currentUser } = useSession();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isDonationOpen, setIsDonationOpen] = useState(false);
    const [homePlayground, setHomePlayground] = useState<Playground | null>(null);
    const [dashboardData, setDashboardData] = useState<TeamDashboardData | null>(null);

    useEffect(() => {
        if (team.homePlaygroundId) {
            getPlaygroundById(team.homePlaygroundId).then(setHomePlayground);
        }
        getTeamDashboardData(team.id).then(setDashboardData);
    }, [team.id, team.homePlaygroundId]);

    if (!team) {
        return <div>Команда не найдена.</div>;
    }

    const isCaptain = currentUser?.id === team.captainId;
    const isMember = team.roster.some(member => member.id === currentUser?.id);

    const handleJoinTeam = () => {
        startTransition(async () => {
            const result = await joinTeamAction(team.id, team.slug); 
            if(result.success) {
                toast({ title: "Вы присоединились к команде!", description: `Добро пожаловать в ${team.name}!` });
            } else {
                toast({ variant: 'destructive', title: "Ошибка", description: result.error });
            }
        });
    };

    return (
        <>
            <div className="space-y-6 opacity-0 animate-fade-in-up">
                <Card className="overflow-hidden">
                    <div className="relative h-48 sm:h-64">
                        <Image src="https://placehold.co/2560x720.png" alt={`${team.name} banner`} fill className="object-cover" data-ai-hint="sports team banner" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 flex items-end gap-4">
                            <Avatar className="h-24 w-24 border-4 border-background">
                                <AvatarImage src={team.logo || ''} alt={team.name} data-ai-hint={team.dataAiHint || ''} />
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
                            {!isMember && (
                                 <Button onClick={handleJoinTeam} disabled={isPending}>
                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <UserPlus className="mr-2 h-4 w-4" />}
                                    Вступить в команду
                                </Button>
                            )}
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
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                        <TabsTrigger value="overview">Обзор</TabsTrigger>
                        <TabsTrigger value="roster">Состав</TabsTrigger>
                        <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4"/>Статистика</TabsTrigger>
                        <TabsTrigger value="chat"><Bot className="mr-2 h-4 w-4" />Чат</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4">
                        <TeamOverviewDashboard team={team} upcomingMatch={dashboardData?.upcomingMatch || null} recentResults={dashboardData?.recentResults || []} />
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
                                                <Avatar className="h-8 w-8"><AvatarImage src={player.avatar || ''} /><AvatarFallback>{String(player.name).charAt(0)}</AvatarFallback></Avatar>
                                                {player.name}
                                            </TableCell>
                                            <TableCell>{player.id === team.captainId ? 'Капитан' : player.role}</TableCell>
                                            <TableCell className="hidden md:table-cell">{player.rating}</TableCell>
                                            <TableCell className="text-right"><Badge variant={player.status === 'Активен' ? 'default' : 'outline'}>{player.status}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="stats" className="mt-4">
                        <TeamStatsTab team={team} />
                    </TabsContent>

                    <TabsContent value="chat" className="mt-4">
                        <TeamChatInterface teamId={team.id} />
                    </TabsContent>

                </Tabs>
            </div>
            <DonationDialog
                isOpen={isDonationOpen}
                onOpenChange={setIsDonationOpen}
                recipientName={team.name}
                recipientType="команде"
            />
        </>
    );
}
