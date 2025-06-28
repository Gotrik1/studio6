
'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Calendar, Check, Trophy, Users, FileText, PlusCircle, Megaphone, UserPlus, MoreHorizontal } from "lucide-react";
import { TournamentBracket } from "@/components/tournament-bracket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { TournamentDetails } from "@/lib/mock-data/tournament-details";

type Participant = TournamentDetails['participants'][0];

interface TournamentClientPageProps {
    tournament: TournamentDetails;
}

const getStatusVariant = (status: string) => {
    switch(status) {
        case 'Оплачено': return 'default';
        case 'Ожидает оплаты': return 'secondary';
        case 'Проблема с оплатой': return 'destructive';
        default: return 'outline';
    }
}

export default function TournamentClientPage({ tournament }: TournamentClientPageProps) {
  const [participants, setParticipants] = useState(tournament.participants);
  const { toast } = useToast();

  const handleAction = (message: string) => {
      toast({
          title: "Действие выполнено",
          description: message,
      });
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
         <CardHeader className="relative h-48 w-full p-0">
          <Image
            src={tournament.bannerImage}
            alt={`${tournament.name} banner`}
            fill
            className="object-cover"
            data-ai-hint={tournament.bannerImageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <Badge variant="destructive" className="mb-2">{tournament.status}</Badge>
            <h1 className="font-headline text-4xl font-bold">{tournament.name}</h1>
            <p className="mt-1 text-lg text-white/80">{tournament.description}</p>
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            <Button variant="outline"><UserPlus className="mr-2 h-4 w-4" />Добавить команду</Button>
            <Button variant="outline"><Megaphone className="mr-2 h-4 w-4" />Объявление</Button>
            <Button><PlusCircle className="mr-2 h-4 w-4" />Создать матч</Button>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="bracket">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="bracket">Турнирная сетка</TabsTrigger>
          <TabsTrigger value="participants">Участники</TabsTrigger>
          <TabsTrigger value="schedule">Расписание</TabsTrigger>
          <TabsTrigger value="prizes">Призы и Спонсоры</TabsTrigger>
        </TabsList>
        <TabsContent value="bracket">
          <Card>
            <CardHeader>
              <CardTitle>Сетка плей-офф</CardTitle>
              <CardDescription>Следите за ходом матчей в реальном времени.</CardDescription>
            </CardHeader>
            <CardContent>
              <TournamentBracket rounds={tournament.bracketData.rounds} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="participants">
            <Card>
                <CardHeader>
                    <CardTitle>Управление командами</CardTitle>
                    <CardDescription>Всего {participants.length} команд, сражающихся за титул.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                    {participants.map((team) => (
                        <Card key={team.id} className="flex items-center justify-between p-3">
                           <div className="flex items-center gap-4">
                             <Avatar>
                                <AvatarImage src={team.logo} alt={team.name} data-ai-hint={team.dataAiHint} />
                                <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <div>
                                <p className="font-semibold">{team.name}</p>
                                <p className="text-sm text-muted-foreground">Капитан: {team.captain}</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-4">
                                <Badge variant={getStatusVariant(team.status)}>{team.status}</Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={team.profileUrl}>Просмотреть профиль</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAction(`Сообщение отправлено капитану команды "${team.name}".`)}>
                                            Отправить сообщение
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAction(`Статус оплаты для команды "${team.name}" изменен.`)}>
                                            Изменить статус оплаты
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                            onClick={() => {
                                                setParticipants(prev => prev.filter(p => p.id !== team.id));
                                                handleAction(`Команда "${team.name}" исключена из турнира.`);
                                            }}
                                        >
                                            Исключить из турнира
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                           </div>
                        </Card>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Расписание матчей</CardTitle>
              <CardDescription>Все игры турнира в одном месте.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {tournament.schedule.map(item => (
                    <div key={item.stage} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-muted-foreground"/>
                            <div>
                                <p className="font-semibold">{item.stage}</p>
                                <p className="text-sm text-muted-foreground">{item.date}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Управлять матчами</Button>
                    </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="prizes">
           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Призовой фонд</CardTitle>
                    <CardDescription>Награды для сильнейших команд.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {tournament.prizes.map(prize => (
                         <div key={prize.place} className="flex items-start gap-4">
                            <Trophy className={`h-8 w-8 ${prize.color} mt-1`}/>
                            <div>
                                <p className="font-semibold">{prize.place}</p>
                                <p className="text-muted-foreground">{prize.reward}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Спонсоры</CardTitle>
                    <CardDescription>Компании, которые поддерживают турнир.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-8">
                    {tournament.sponsors.map(sponsor => (
                        <Image key={sponsor.name} src={sponsor.logo} alt={sponsor.name} width={150} height={50} data-ai-hint={sponsor.logoHint} />
                    ))}
                </CardContent>
            </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
