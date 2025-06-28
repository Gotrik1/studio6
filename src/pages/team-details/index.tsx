'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Gamepad2, UserPlus, MessageCircle, Settings } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useSession } from '@/shared/lib/session/client';
import { teams } from "@/lib/mock-data/teams";
import { teamRoster, teamActivity, challenges } from "@/lib/mock-data/team-details";
import { TeamChatbot } from '@/components/team-chatbot';

export function TeamDetailsPage() {
    const { user: currentUser } = useSession();
    // For this demo, we are hardcoding the team. In a real app, this would come from params.
    const team = teams.find(t => t.slug === 'cyber-eagles');

    if (!team) {
        return <div>Команда не найдена.</div>;
    }

    const isCaptain = currentUser?.name === team.captain || currentUser?.role === 'Администратор';

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <div className="relative h-48 sm:h-64">
                    <Image src="https://placehold.co/1200x400.png" alt={`${team.name} banner`} fill className="object-cover" data-ai-hint="esports team banner" />
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
                        <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">{team.members}/5 игроков</span></div>
                        <div className="flex items-center gap-2"><Gamepad2 className="h-4 w-4 text-muted-foreground" /> <span className="font-semibold">{team.game}</span></div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><UserPlus className="mr-2 h-4 w-4" />Подать заявку</Button>
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
                    <TabsTrigger value="challenges">Вызовы</TabsTrigger>
                    <TabsTrigger value="chatbot">Чат-бот</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Лента активности</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {teamActivity.map(activity => (
                                <div key={activity.id} className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <activity.icon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{activity.text}</p>
                                        <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
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
                                   {teamRoster.map(player => (
                                       <TableRow key={player.id}>
                                           <TableCell className="font-medium flex items-center gap-2">
                                               <Avatar className="h-8 w-8"><AvatarImage src={player.avatar} /><AvatarFallback>{player.name.charAt(0)}</AvatarFallback></Avatar>
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
                <TabsContent value="chatbot" className="mt-4">
                    <TeamChatbot teamId={team.slug} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
