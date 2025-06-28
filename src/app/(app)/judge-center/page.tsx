
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileCheck, AlertTriangle, Calendar, Gavel, Video, MessageSquare, Check, X } from "lucide-react";
import { matchesToReview as initialMatchesToReview, disputedMatches as initialDisputedMatches, mySchedule } from "@/lib/mock-data/judge-center";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

export default function JudgeCenterPage() {
    const { toast } = useToast();
    const [matchesToReview, setMatchesToReview] = useState(initialMatchesToReview);
    const [disputedMatches, setDisputedMatches] = useState(initialDisputedMatches);

    const handleReviewAction = (matchId: string, action: 'approve' | 'reject') => {
        setMatchesToReview(prev => prev.filter(match => match.id !== matchId));
        toast({
            title: `Результат ${action === 'approve' ? 'подтвержден' : 'отклонен'}`,
            description: `Матч ${matchId} был обработан.`,
        });
    };

    const handleDisputeAction = (matchId: string) => {
        setDisputedMatches(prev => 
            prev.map(match => 
                match.id === matchId ? { ...match, status: 'Изучается' } : match
            )
        );
        toast({
            title: `Спор по матчу ${matchId} взят в работу.`,
            description: "Вы будете уведомлены о результате.",
        });
    };
    
    const getStatusBadgeVariant = (status: string) => {
        if (status === 'Ожидает решения') return 'default';
        if (status === 'Изучается') return 'secondary';
        return 'outline';
    };


    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Центр Судей</h1>
                <p className="text-muted-foreground">
                    Ваш хаб для управления матчами, разрешения споров и просмотра расписания.
                </p>
            </div>

            <Tabs defaultValue="review">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="review">
                        <FileCheck className="mr-2 h-4 w-4" />
                        На утверждение
                        {matchesToReview.length > 0 && <Badge className="ml-2">{matchesToReview.length}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="disputes">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Спорные матчи
                        {disputedMatches.length > 0 && <Badge variant="destructive" className="ml-2">{disputedMatches.length}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="schedule">
                        <Calendar className="mr-2 h-4 w-4" />
                        Мое расписание
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="review" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Матчи на утверждение</CardTitle>
                            <CardDescription>Проверьте и подтвердите результаты, загруженные капитанами команд.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {matchesToReview.length > 0 ? matchesToReview.map(match => (
                                <Card key={match.id}>
                                    <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex-1 flex items-center justify-between md:justify-start gap-4">
                                             <div className="flex items-center gap-2 text-right">
                                                <span className="font-semibold">{match.team1.name}</span>
                                                <Avatar className="h-8 w-8"><AvatarImage src={match.team1.logo} data-ai-hint={match.team1.logoHint} /></Avatar>
                                            </div>
                                            <span className="font-bold text-lg">{match.score}</span>
                                             <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={match.team2.logo} data-ai-hint={match.team2.logoHint} /></Avatar>
                                                <span className="font-semibold">{match.team2.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-center text-sm text-muted-foreground">
                                            <p>{match.tournament}</p>
                                            <p>Загружено: {match.submittedBy} ({match.timestamp})</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleReviewAction(match.id, 'approve')} className="bg-green-600 hover:bg-green-700"><Check className="mr-2 h-4 w-4"/>Подтвердить</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleReviewAction(match.id, 'reject')}><X className="mr-2 h-4 w-4"/>Отклонить</Button>
                                            <Button size="sm" variant="outline"><Video className="mr-2 h-4 w-4"/>Повтор</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="text-center text-muted-foreground py-10">
                                    <FileCheck className="mx-auto h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Нет матчей на утверждение</h3>
                                    <p>Все результаты проверены. Отличная работа!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="disputes" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Спорные матчи</CardTitle>
                            <CardDescription>Эти матчи требуют вашего вмешательства для разрешения конфликтов.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {disputedMatches.length > 0 ? disputedMatches.map(match => (
                                <Card key={match.id} className="border-l-4 border-destructive">
                                     <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between md:justify-start gap-4">
                                                <div className="flex items-center gap-2 text-right">
                                                    <span className="font-semibold">{match.team1.name}</span>
                                                    <Avatar className="h-8 w-8"><AvatarImage src={match.team1.logo} data-ai-hint={match.team1.logoHint} /></Avatar>
                                                </div>
                                                <span className="font-bold text-lg">{match.score}</span>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8"><AvatarImage src={match.team2.logo} data-ai-hint={match.team2.logoHint} /></Avatar>
                                                    <span className="font-semibold">{match.team2.name}</span>
                                                </div>
                                            </div>
                                             <p className="text-sm text-muted-foreground pt-2 border-t mt-2">Причина спора: <span className="text-foreground font-medium">{match.reason}</span></p>
                                        </div>
                                         <div className="flex flex-col items-center gap-2">
                                            <Badge variant={getStatusBadgeVariant(match.status)}>{match.status}</Badge>
                                            <Button size="sm" onClick={() => handleDisputeAction(match.id)} disabled={match.status === 'Изучается'}>
                                                <Gavel className="mr-2 h-4 w-4"/>
                                                {match.status === 'Изучается' ? 'В работе' : 'Рассмотреть дело'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="text-center text-muted-foreground py-10">
                                    <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Нет активных споров</h3>
                                    <p>Все конфликты разрешены. Мир, дружба, жвачка!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="schedule" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Мое расписание</CardTitle>
                            <CardDescription>Предстоящие матчи, на которые вы назначены судьей.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mySchedule.map(match => (
                                <Card key={match.id} className="bg-muted/50">
                                    <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex-1 flex items-center justify-between md:justify-start gap-4">
                                             <div className="flex items-center gap-2 text-right">
                                                <span className="font-semibold">{match.team1.name}</span>
                                                <Avatar className="h-8 w-8"><AvatarImage src={match.team1.logo} data-ai-hint={match.team1.logoHint} /></Avatar>
                                            </div>
                                            <span className="font-bold text-lg text-muted-foreground">vs</span>
                                             <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={match.team2.logo} data-ai-hint={match.team2.logoHint} /></Avatar>
                                                <span className="font-semibold">{match.team2.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-center text-sm text-muted-foreground">
                                            <p>{match.tournament}</p>
                                            <p className="font-bold text-primary">{match.time}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline"><MessageSquare className="mr-2 h-4 w-4"/>Чат матча</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
