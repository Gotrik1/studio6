'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Coins, Upload, Shield, Users, Settings, BrainCircuit } from 'lucide-react';
import { teams } from '@/lib/mock-data/teams';
import { teamPdHistory } from '@/lib/mock-data/team-details';
import { teamRoster, joinRequests as initialJoinRequests } from '@/lib/mock-data/team-details';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { JoinRequestAnalysisDialog } from '@/components/join-request-analysis-dialog';

const team = teams.find(t => t.slug === 'cyber-eagles');

type JoinRequest = (typeof initialJoinRequests)[0];

export default function TeamManagementPage() {
    const { toast } = useToast();
    const [joinRequests, setJoinRequests] = useState(initialJoinRequests);

    // State for AI Analysis Dialog
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);


    if (!team) {
        return <div>Команда не найдена</div>;
    }
    
    const handleSaveChanges = () => {
        toast({
            title: "Изменения сохранены!",
            description: "Профиль команды был успешно обновлен.",
        })
    }
    
    const handleAcceptRequest = (id: string) => {
        const req = joinRequests.find(r => r.id === id);
        if (!req) return;

        setJoinRequests(prev => prev.filter(r => r.id !== id));
        // In a real app, you would add this user to the team roster
        toast({
            title: "Игрок принят",
            description: `${req.name} был добавлен в состав команды.`,
        })
    }
    
     const handleDeclineRequest = (id: string) => {
        const req = joinRequests.find(r => r.id === id);
        if (!req) return;

        setJoinRequests(prev => prev.filter(r => r.id !== id));
        toast({
            variant: 'destructive',
            title: "Заявка отклонена",
            description: `Заявка от ${req.name} была отклонена.`,
        })
    }

    const handleOpenAnalysisDialog = (request: JoinRequest) => {
        setSelectedRequest(request);
        setIsAnalysisOpen(true);
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Управление командой: {team.name}</h1>
                    <p className="text-muted-foreground">Здесь вы можете редактировать информацию о команде, управлять составом и финансами.</p>
                </div>
                 <Button asChild variant="outline">
                    <Link href={`/teams/${team.slug}`}>
                        <Shield className="mr-2 h-4 w-4" />
                        Вернуться к профилю команды
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview"><Settings className="mr-2 h-4 w-4"/>Основное</TabsTrigger>
                    <TabsTrigger value="roster"><Users className="mr-2 h-4 w-4"/>Состав</TabsTrigger>
                    <TabsTrigger value="requests"><UserPlus className="mr-2 h-4 w-4"/>Заявки</TabsTrigger>
                    <TabsTrigger value="finances"><Coins className="mr-2 h-4 w-4"/>Финансы</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Общая информация</CardTitle>
                            <CardDescription>Измените название, девиз или логотип вашей команды.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={team.logo} alt={team.name} />
                                    <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Button variant="outline"><Upload className="mr-2 h-4 w-4"/>Загрузить новый логотип</Button>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="team-name">Название команды</Label>
                                <Input id="team-name" defaultValue={team.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="team-motto">Девиз</Label>
                                <Textarea id="team-motto" defaultValue={team.motto} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveChanges}>Сохранить изменения</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                
                <TabsContent value="roster" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Управление составом</CardTitle>
                            <CardDescription>Просмотр текущего состава и управление игроками.</CardDescription>
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
                                   {teamRoster.map(player => (
                                       <TableRow key={player.id}>
                                           <TableCell className="font-medium flex items-center gap-2">
                                               <Avatar className="h-8 w-8"><AvatarImage src={player.avatar} /><AvatarFallback>{player.name.charAt(0)}</AvatarFallback></Avatar>
                                               {player.name}
                                           </TableCell>
                                           <TableCell><Badge variant={player.role === 'Капитан' ? 'default' : 'secondary'}>{player.role}</Badge></TableCell>
                                           <TableCell className="text-right">
                                               <Button variant="destructive" size="sm" disabled={player.role === 'Капитан'}>
                                                   <Trash2 className="mr-2 h-4 w-4"/>Исключить
                                               </Button>
                                           </TableCell>
                                       </TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="requests" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Заявки на вступление</CardTitle>
                            <CardDescription>Игроки, которые хотят присоединиться к вашей команде.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {joinRequests.length > 0 ? joinRequests.map(req => (
                                <Card key={req.id} className="p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 self-start sm:self-center">
                                        <Avatar><AvatarImage src={req.avatar} data-ai-hint={req.avatarHint}/><AvatarFallback>{req.name.charAt(0)}</AvatarFallback></Avatar>
                                        <div>
                                            <p className="font-semibold">{req.name}</p>
                                            <p className="text-xs text-muted-foreground">{req.role}, Рейтинг: {req.rating}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleOpenAnalysisDialog(req)}>
                                            <BrainCircuit className="mr-2 h-4 w-4"/>
                                            AI Анализ
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDeclineRequest(req.id)}>Отклонить</Button>
                                        <Button size="sm" onClick={() => handleAcceptRequest(req.id)}>Принять</Button>
                                    </div>
                                </Card>
                            )) : (
                                <p className="text-center text-muted-foreground py-10">Новых заявок нет.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="finances" className="mt-4">
                    <Card>
                         <CardHeader>
                            <CardTitle>Казна команды</CardTitle>
                            <CardDescription>Общий баланс: <span className="font-bold text-primary">6,500 PD</span></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                               <TableHeader>
                                   <TableRow>
                                       <TableHead>Дата</TableHead>
                                       <TableHead>Источник</TableHead>
                                       <TableHead>Пользователь</TableHead>
                                       <TableHead className="text-right">Сумма</TableHead>
                                   </TableRow>
                               </TableHeader>
                               <TableBody>
                                   {teamPdHistory.map(tx => (
                                       <TableRow key={tx.id}>
                                           <TableCell>{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                                           <TableCell>{tx.source}</TableCell>
                                           <TableCell>{tx.user}</TableCell>
                                           <TableCell className={`text-right font-medium ${tx.value > 0 ? 'text-green-500' : 'text-destructive'}`}>{tx.value > 0 ? '+' : ''}{tx.value.toLocaleString()} PD</TableCell>
                                       </TableRow>
                                   ))}
                               </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <JoinRequestAnalysisDialog
                isOpen={isAnalysisOpen}
                onOpenChange={setIsAnalysisOpen}
                request={selectedRequest}
                teamNeeds="Нам нужен опытный смоукер (контроллер), который умеет хорошо коммуницировать и не боится занимать ключевые позиции на карте."
            />
        </div>
    );
}
