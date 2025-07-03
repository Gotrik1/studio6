'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Check, X, Handshake, Calendar, BarChart3 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { JoinRequestAnalysisDialog } from '@/widgets/join-request-analysis-dialog';
import { SponsorshipPitchGenerator } from '@/widgets/sponsorship-pitch-generator';
import { AITeamAssistantTab } from '@/widgets/ai-team-assistant-tab';
import { TeamCoachTab } from '@/widgets/team-coach-tab';
import { RosterManagementTab } from '@/widgets/roster-management-tab';
import { TeamSponsorScout } from '@/widgets/team-sponsor-scout';
import { useJoinRequests, type JoinRequest } from '@/app/providers/join-request-provider';
import { TeamScheduleTab } from '@/widgets/team-schedule-tab';
import { TeamTrainingAnalytics } from '@/widgets/team-training-analytics';
import { SponsorshipOffers } from '@/widgets/sponsorship-offers';

const teamNeeds = "Мы ищем опытного защитника, который умеет хорошо контролировать поле и начинать атаки. Наш стиль игры - быстрый и комбинационный.";

export function TeamManagementPage() {
    const { toast } = useToast();
    const { requests: joinRequests, removeRequest } = useJoinRequests();
    const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

    const handleAccept = (request: JoinRequest) => {
        removeRequest(request.id);
        toast({ title: "Игрок принят!", description: `${request.applicant.name} теперь в вашей команде.` });
    };

    const handleDecline = (request: JoinRequest) => {
        removeRequest(request.id);
        toast({
            variant: 'destructive',
            title: 'Заявка отклонена',
            description: `Заявка от ${request.applicant.name} была отклонена.`,
        });
    };
    
    const handleAnalyze = (request: JoinRequest) => {
        setSelectedRequest(request);
        setIsAnalysisOpen(true);
    };
    
    const analysisDialogRequestProp = selectedRequest ? {
        name: selectedRequest.applicant.name,
        role: selectedRequest.applicant.role,
        avatar: selectedRequest.applicant.avatar,
        avatarHint: 'sports player',
        statsSummary: selectedRequest.statsSummary
    } : null;

    return (
         <>
            <div className="space-y-6 opacity-0 animate-fade-in-up">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Управление командой</h1>
                    <p className="text-muted-foreground">
                        Все инструменты для капитана в одном месте.
                    </p>
                </div>
                <Tabs defaultValue="roster">
                    <TabsList className="grid w-full grid-cols-7">
                        <TabsTrigger value="roster">Состав</TabsTrigger>
                        <TabsTrigger value="schedule"><Calendar className="mr-2 h-4 w-4"/>Расписание</TabsTrigger>
                        <TabsTrigger value="requests">Заявки</TabsTrigger>
                        <TabsTrigger value="sponsorship"><Handshake className="mr-2 h-4 w-4"/>Спонсорство</TabsTrigger>
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
                                                    <Avatar className="h-8 w-8"><AvatarImage src={request.applicant.avatar} data-ai-hint="player avatar" /><AvatarFallback>{request.applicant.name.charAt(0)}</AvatarFallback></Avatar>
                                                    {request.applicant.name}
                                                </TableCell>
                                                <TableCell>{request.applicant.role}</TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    <Button variant="outline" size="sm" onClick={() => handleAnalyze(request)}>AI-Анализ</Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDecline(request)}><X className="h-4 w-4 text-red-500" /></Button>
                                                    <Button size="icon" onClick={() => handleAccept(request)}><Check className="h-4 w-4" /></Button>
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

                    <TabsContent value="training-analytics" className="mt-4">
                        <TeamTrainingAnalytics />
                    </TabsContent>
                    
                    <TabsContent value="ai-coach" className="mt-4">
                        <TeamCoachTab />
                    </TabsContent>

                    <TabsContent value="ai-assistant" className="mt-4">
                        <AITeamAssistantTab />
                    </TabsContent>
                </Tabs>
            </div>
            <JoinRequestAnalysisDialog 
                isOpen={isAnalysisOpen}
                onOpenChange={setIsAnalysisOpen}
                request={analysisDialogRequestProp}
                teamNeeds={teamNeeds}
            />
        </>
    );
}
