

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Check, X, Handshake, Calendar, BarChart3, Share2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { JoinRequestAnalysisDialog } from '@/widgets/join-request-analysis-dialog';
import { SponsorshipPitchGenerator } from '@/widgets/sponsorship-pitch-generator';
import { AITeamAssistantTab } from '@/widgets/ai-team-assistant-tab';
import { TeamCoachTab } from '@/widgets/team-coach-tab';
import { RosterManagementTab } from '@/widgets/roster-management-tab';
import { TeamSponsorScout } from '@/widgets/team-sponsor-scout';
import { TeamScheduleTab } from '@/widgets/team-schedule-tab';
import { TeamTrainingAnalytics } from '@/widgets/team-training-analytics';
import { SponsorshipOffers } from '@/widgets/sponsorship-offers';
import { AiSocialMediaPostGenerator } from '@/widgets/ai-social-media-post-generator';
import { useParams } from 'next/navigation';
import type { CoachedPlayer } from '@/entities/user/model/types';
import { getTeamBySlug, type TeamDetails } from '@/entities/team/api/teams';
import { Skeleton } from '@/shared/ui/skeleton';
import { getTeamApplications, acceptTeamApplication, declineTeamApplication } from '@/entities/team-application/api/applications';
import type { JoinRequest as TeamJoinRequest } from '@/entities/team-application/model/types';
import { TeamDashboardData } from '@/entities/team/api/get-team-dashboard';


const teamNeeds = "Мы ищем опытного защитника, который умеет хорошо контролировать поле и начинать атаки. Наш стиль игры - быстрый и комбинационный.";

export function TeamManagementPage() {
    const { toast } = useToast();
    const params = useParams<{ slug: string }>();
    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [joinRequests, setJoinRequests] = useState<TeamJoinRequest[]>([]);
    
    const [selectedRequest, setSelectedRequest] = useState<TeamJoinRequest | null>(null);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const [isActionPending, startTransition] = useTransition();
    
    const teamPlayers: CoachedPlayer[] = team?.roster.map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        avatarHint: 'player portrait',
        role: p.role,
        adherence: p.adherence,
        // Mock the rest
        stats: { kda: '1.2', winRate: '55%', favoriteMap: 'Ascent' },
        matchHistory: 'W 13-8, L 10-13, W 13-2',
        progress: Math.floor(Math.random() * (25 - 5 + 1) + 5),
    })) || [];


    const fetchData = useCallback(async () => {
        if (params.slug) {
            setIsLoading(true);
            const teamData = await getTeamBySlug(params.slug as string);
            setTeam(teamData);
            if (teamData) {
                const appsResult = await getTeamApplications(teamData.id);
                 if (appsResult.success && Array.isArray(appsResult.data)) {
                    setJoinRequests(appsResult.data);
                } else {
                    toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить заявки на вступление.' });
                }
            }
            setIsLoading(false);
        }
    }, [params.slug, toast]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAccept = (request: TeamJoinRequest) => {
        startTransition(async () => {
            const result = await acceptTeamApplication(request.id);
            if(result.success) {
                toast({ title: "Игрок принят!", description: `${request.applicant.name} теперь в вашей команде.` });
                await fetchData();
            } else {
                 toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
            }
        });
    };

    const handleDecline = (request: TeamJoinRequest) => {
        startTransition(async () => {
             const result = await declineTeamApplication(request.id);
             if(result.success) {
                toast({
                    variant: 'destructive',
                    title: 'Заявка отклонена',
                    description: `Заявка от ${request.applicant.name} была отклонена.`,
                });
                await fetchData();
             } else {
                  toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
             }
        });
    };
    
    const handleAnalyze = (request: TeamJoinRequest) => {
        setSelectedRequest(request);
        setIsAnalysisOpen(true);
    };
    
    if (isLoading) {
        return (
            <div className="space-y-6">
                 <Skeleton className="h-10 w-1/3" />
                 <Skeleton className="h-4 w-1/2" />
                 <Skeleton className="h-12 w-full" />
                 <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    if (!team) {
        return <div>Команда не найдена или у вас нет прав на управление.</div>;
    }

    return (
         <>
            <div className="space-y-6 opacity-0 animate-fade-in-up">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Управление командой: {team.name}</h1>
                    <p className="text-muted-foreground">
                        Все инструменты для капитана в одном месте.
                    </p>
                </div>
                <Tabs defaultValue="roster">
                    <TabsList className="grid w-full grid-cols-8">
                        <TabsTrigger value="roster">Состав</TabsTrigger>
                        <TabsTrigger value="schedule"><Calendar className="mr-2 h-4 w-4"/>Расписание</TabsTrigger>
                        <TabsTrigger value="requests">Заявки</TabsTrigger>
                        <TabsTrigger value="sponsorship"><Handshake className="mr-2 h-4 w-4"/>Спонсорство</TabsTrigger>
                        <TabsTrigger value="smm"><Share2 className="mr-2 h-4 w-4"/>SMM</TabsTrigger>
                        <TabsTrigger value="training-analytics"><BarChart3 className="mr-2 h-4 w-4"/>Аналитика</TabsTrigger>
                        <TabsTrigger value="ai-coach">AI-Коуч</TabsTrigger>
                        <TabsTrigger value="ai-assistant">AI-Ассистент</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="roster" className="mt-4">
                        <RosterManagementTab />
                    </TabsContent>

                    <TabsContent value="schedule" className="mt-4">
                        <TeamScheduleTab />
                    </TabsContent>

                    <TabsContent value="requests" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Заявки на вступление</CardTitle>
                                <CardDescription>Игроки, которые хотят присоединиться к вашей команде.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Игрок</TableHead>
                                            <TableHead>Роль</TableHead>
                                            <TableHead className="text-right">Действия</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {joinRequests.map(request => (
                                            <TableRow key={request.id}>
                                                <TableCell className="font-medium flex items-center gap-2">
                                                    <Avatar className="h-8 w-8"><AvatarImage src={request.applicant.avatar || undefined} data-ai-hint="player avatar" /><AvatarFallback>{request.applicant.name.charAt(0)}</AvatarFallback></Avatar>
                                                    {request.applicant.name}
                                                </TableCell>
                                                <TableCell>{request.applicant.role}</TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    <Button variant="outline" size="sm" onClick={() => handleAnalyze(request)}>AI-Анализ</Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDecline(request)} disabled={isActionPending}><X className="h-4 w-4 text-red-500" /></Button>
                                                    <Button size="icon" onClick={() => handleAccept(request)} disabled={isActionPending}><Check className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            {joinRequests.length === 0 && (
                                <CardFooter className="text-center text-muted-foreground justify-center">
                                    Новых заявок нет.
                                </CardFooter>
                            )}
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="sponsorship" className="mt-4 space-y-6">
                        <SponsorshipOffers />
                        <TeamSponsorScout />
                        <SponsorshipPitchGenerator />
                    </TabsContent>
                    
                    <TabsContent value="smm" className="mt-4">
                        <AiSocialMediaPostGenerator />
                    </TabsContent>

                    <TabsContent value="training-analytics" className="mt-4">
                        <TeamTrainingAnalytics players={teamPlayers} />
                    </TabsContent>
                    
                    <TabsContent value="ai-coach" className="mt-4">
                        <TeamCoachTab team={team} />
                    </TabsContent>

                    <TabsContent value="ai-assistant" className="mt-4">
                        <AITeamAssistantTab teamId={team.id} />
                    </TabsContent>
                </Tabs>
            </div>
            <JoinRequestAnalysisDialog 
                isOpen={isAnalysisOpen}
                onOpenChange={setIsAnalysisOpen}
                request={selectedRequest}
                teamNeeds={teamNeeds}
            />
        </>
    );
}
