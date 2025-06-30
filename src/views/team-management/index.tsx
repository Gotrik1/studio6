
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Check, X, Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { JoinRequestAnalysisDialog } from '@/widgets/join-request-analysis-dialog';
import { SponsorshipPitchGenerator } from '@/widgets/sponsorship-pitch-generator';
import { AITeamAssistantTab } from '@/widgets/ai-team-assistant-tab';
import { TeamCoachTab } from '@/widgets/team-coach-tab';
import { RosterManagementTab } from '@/widgets/roster-management-tab';


const initialJoinRequests = [
    { name: "ShadowStriker", role: "Нападающий", avatar: 'https://placehold.co/100x100.png', avatarHint: 'sports player' },
    { name: "Foxy", role: "Полузащитник", avatar: 'https://placehold.co/100x100.png', avatarHint: 'sports player' },
];

const teamNeeds = "Мы ищем опытного защитника, который умеет хорошо контролировать поле и начинать атаки. Наш стиль игры - быстрый и комбинационный.";

export function TeamManagementPage() {
    const { toast } = useToast();
    const [joinRequests, setJoinRequests] = useState(initialJoinRequests);
    const [selectedRequest, setSelectedRequest] = useState<(typeof initialJoinRequests)[0] | null>(null);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

    const handleAccept = (name: string) => {
        setJoinRequests(prev => prev.filter(r => r.name !== name));
        toast({ title: "Игрок принят!", description: `${name} теперь в вашей команде.` });
    };

    const handleDecline = (name: string) => {
        setJoinRequests(prev => prev.filter(r => r.name !== name));
        toast({ title: "Заявка отклонена", description: `Заявка от ${name} была отклонена.` });
    };
    
    const handleAnalyze = (request: (typeof initialJoinRequests)[0]) => {
        setSelectedRequest(request);
        setIsAnalysisOpen(true);
    };

    return (
         <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление командой</h1>
                <p className="text-muted-foreground">
                    Все инструменты для капитана в одном месте.
                </p>
            </div>
             <Tabs defaultValue="roster">
                 <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="roster">Состав</TabsTrigger>
                    <TabsTrigger value="requests">Заявки</TabsTrigger>
                    <TabsTrigger value="sponsorship">Спонсорство</TabsTrigger>
                    <TabsTrigger value="ai-coach">AI-Коуч</TabsTrigger>
                    <TabsTrigger value="ai-assistant">AI-Ассистент</TabsTrigger>
                </TabsList>
                
                <TabsContent value="roster" className="mt-4">
                    <RosterManagementTab />
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
                                        <TableRow key={request.name}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={request.avatar} data-ai-hint={request.avatarHint} /><AvatarFallback>{request.name.charAt(0)}</AvatarFallback></Avatar>
                                                {request.name}
                                            </TableCell>
                                            <TableCell>{request.role}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                 <Button variant="outline" size="sm" onClick={() => handleAnalyze(request)}>AI-Анализ</Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDecline(request.name)}><X className="h-4 w-4 text-red-500" /></Button>
                                                <Button size="icon" onClick={() => handleAccept(request.name)}><Check className="h-4 w-4" /></Button>
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
                
                <TabsContent value="sponsorship" className="mt-4">
                    <SponsorshipPitchGenerator />
                </TabsContent>
                
                <TabsContent value="ai-coach" className="mt-4">
                    <TeamCoachTab />
                </TabsContent>

                <TabsContent value="ai-assistant" className="mt-4">
                    <AITeamAssistantTab />
                </TabsContent>
            </Tabs>
             <JoinRequestAnalysisDialog 
                isOpen={isAnalysisOpen}
                onOpenChange={setIsAnalysisOpen}
                request={selectedRequest}
                teamNeeds={teamNeeds}
            />
        </div>
    );
}
