'use client';

import Image from "next/image";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { TournamentDetails } from "@/entities/tournament/model/types";
import { Button } from "@/shared/ui/button";
import { Calendar, Users, Trophy } from "lucide-react";
import { TournamentBracket } from "@/widgets/tournament-bracket";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";

export function TournamentDetailsPage({ tournament }: { tournament: TournamentDetails }) {

    const getStatusVariant = (status: string) => {
        if (status === "Завершен") return "outline";
        if (status === "Регистрация") return "default";
        return "destructive";
    };

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <div className="relative h-48 sm:h-64">
                    <Image src={tournament.image} alt={`${tournament.name} banner`} fill className="object-cover" data-ai-hint={tournament.dataAiHint} />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                        <div>
                            <Badge variant={getStatusVariant(tournament.status)}>{tournament.status}</Badge>
                            <h1 className="font-headline text-2xl sm:text-4xl font-bold text-white shadow-lg mt-2">{tournament.name}</h1>
                            <p className="text-lg text-white/90 shadow-md">{tournament.description}</p>
                        </div>
                    </div>
                </div>
            </Card>

             <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="overview">Обзор</TabsTrigger>
                    <TabsTrigger value="bracket">Сетка</TabsTrigger>
                    <TabsTrigger value="teams">Команды</TabsTrigger>
                    <TabsTrigger value="rules">Правила</TabsTrigger>
                </TabsList>

                 <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                           <Card>
                               <CardHeader><CardTitle>Информация о турнире</CardTitle></CardHeader>
                               <CardContent className="space-y-4">
                                   <div className="flex items-center gap-4"><Calendar className="h-5 w-5 text-muted-foreground" /><p><strong>Даты проведения:</strong> {tournament.schedule.finals}</p></div>
                                   <div className="flex items-center gap-4"><Trophy className="h-5 w-5 text-muted-foreground" /><p><strong>Призовой фонд:</strong> ${tournament.prizePool}</p></div>
                                   <div className="flex items-center gap-4"><Users className="h-5 w-5 text-muted-foreground" /><p><strong>Количество команд:</strong> {tournament.teamsCount}</p></div>
                               </CardContent>
                           </Card>
                        </div>
                        <div>
                            <Card>
                                <CardHeader><CardTitle>Организатор</CardTitle></CardHeader>
                                <CardContent className="flex items-center gap-3">
                                    <Avatar><AvatarImage src={tournament.organizer.logo} /></Avatar>
                                    <p className="font-semibold">{tournament.organizer.name}</p>
                                </CardContent>
                                <CardContent><Button className="w-full">Связаться</Button></CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                 <TabsContent value="bracket" className="mt-4">
                     <Card>
                        <CardHeader><CardTitle>Турнирная сетка</CardTitle></CardHeader>
                        <CardContent>
                            <TournamentBracket rounds={tournament.bracket.rounds} />
                        </CardContent>
                     </Card>
                 </TabsContent>
                 
                 <TabsContent value="teams" className="mt-4">
                     <Card>
                        <CardHeader><CardTitle>Участники</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {tournament.teams.map(team => (
                                <div key={team.name} className="flex flex-col items-center gap-2 text-center">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={team.logo} data-ai-hint={team.dataAiHint} />
                                        <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm font-medium">{team.name}</p>
                                </div>
                            ))}
                        </CardContent>
                     </Card>
                 </TabsContent>

                  <TabsContent value="rules" className="mt-4">
                     <Card>
                        <CardHeader><CardTitle>Правила турнира</CardTitle></CardHeader>
                        <CardContent className="prose dark:prose-invert max-w-none">
                           <p>{tournament.rules}</p>
                        </CardContent>
                     </Card>
                 </TabsContent>
            </Tabs>
        </div>
    );
}
