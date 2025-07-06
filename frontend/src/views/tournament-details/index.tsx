

'use client';

import Image from "next/image";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { TournamentDetails } from "@/entities/tournament/model/types";
import { Button } from "@/shared/ui/button";
import { Calendar, Users, Trophy, FileText, Camera, Loader2 } from "lucide-react";
import { TournamentBracket } from "@/widgets/tournament-bracket";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { ScheduleTab } from "@/widgets/match-details-tabs/ui/schedule-tab";
import { MediaTab } from "@/widgets/match-details-tabs/ui/media-tab";
import { useTransition } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { registerTeamForTournamentAction } from "@/entities/tournament/api/register-team";
import Link from 'next/link';

interface TournamentDetailsPageProps {
  tournament: TournamentDetails;
}

export function TournamentDetailsPage({ tournament }: { tournament: TournamentDetails }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const getStatusVariant = (status: string) => {
        if (status === "Завершен") return "outline";
        if (status === "Регистрация") return "default";
        return "destructive";
    };
    
    const handleRegisterTeam = () => {
        startTransition(async () => {
            const result = await registerTeamForTournamentAction(tournament.id, tournament.slug);
            if (result.success) {
                toast({ title: 'Вы успешно зарегистрированы!', description: 'Ваша команда теперь в списке участников.' });
            } else {
                toast({ variant: 'destructive', title: 'Ошибка регистрации', description: result.error });
            }
        });
    };
    
    const canRegister = tournament.status === 'REGISTRATION';

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                 <div className="relative h-48 sm:h-64">
                    <Image src={tournament.image} alt={`${tournament.name} banner`} fill className="object-cover" data-ai-hint={tournament.dataAiHint} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                        <div>
                            <Badge variant={getStatusVariant(tournament.status === 'ONGOING' ? 'Идет' : tournament.status === 'REGISTRATION' ? 'Регистрация' : 'Завершен')}>{tournament.status === 'ONGOING' ? 'Идет' : tournament.status === 'REGISTRATION' ? 'Регистрация' : 'Завершен'}</Badge>
                            <h1 className="font-headline text-2xl sm:text-4xl font-bold text-white shadow-lg mt-2">{tournament.name}</h1>
                        </div>
                    </div>
                     <div className="absolute top-4 right-4">
                        {canRegister && (
                            <Button onClick={handleRegisterTeam} disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trophy className="mr-2 h-4 w-4"/>}
                                Зарегистрировать команду
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

             <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-6">
                    <TabsTrigger value="overview">Обзор</TabsTrigger>
                    <TabsTrigger value="schedule"><Calendar className="mr-2 h-4 w-4"/>Расписание</TabsTrigger>
                    <TabsTrigger value="bracket">Сетка</TabsTrigger>
                    <TabsTrigger value="teams">Команды</TabsTrigger>
                    <TabsTrigger value="rules">Правила</TabsTrigger>
                    <TabsTrigger value="media"><Camera className="mr-2 h-4 w-4"/>Медиа</TabsTrigger>
                </TabsList>

                 <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                           <Card>
                               <CardHeader><CardTitle>Информация о турнире</CardTitle></CardHeader>
                               <CardContent className="space-y-4 text-sm">
                                   <div className="flex items-center gap-4"><Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> <p><strong>Даты проведения:</strong> {tournament.schedule.finals}</p></div>
                                   <div className="flex items-center gap-4"><Trophy className="mr-2 h-4 w-4 text-muted-foreground" /><p><strong>Призовой фонд:</strong> {String(tournament.prizePool)}</p></div>
                                   <div className="flex items-center gap-4"><Users className="mr-2 h-4 w-4 text-muted-foreground" /><p><strong>Количество команд:</strong> {tournament.teamsCount}</p></div>
                               </CardContent>
                           </Card>
                        </div>
                        <div>
                            <Card>
                                <CardHeader><CardTitle>Организатор</CardTitle></CardHeader>
                                <CardContent className="flex items-center gap-3">
                                    <Avatar><AvatarImage src={tournament.organizer.avatar || undefined} /></Avatar>
                                    <p className="font-semibold">{tournament.organizer.name}</p>
                                </CardContent>
                                <CardContent><Button className="w-full">Связаться</Button></CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="schedule" className="mt-4">
                    <ScheduleTab rounds={tournament.bracket.rounds} />
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
                                        <AvatarImage src={team.logo || ''} data-ai-hint={team.dataAiHint || ''} />
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
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5"/>
                              Правила турнира
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="prose dark:prose-invert max-w-none">
                           <p>{tournament.rules}</p>
                        </CardContent>
                     </Card>
                 </TabsContent>

                 <TabsContent value="media" className="mt-4">
                    <MediaTab media={tournament.media.map(m => ({ ...m, hint: m.hint || ''}))} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
