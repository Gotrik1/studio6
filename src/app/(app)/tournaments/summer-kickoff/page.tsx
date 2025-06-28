import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Calendar, Check, Trophy, Users, FileText, PlusCircle } from "lucide-react";
import { TournamentBracket } from "@/components/tournament-bracket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const bracketData = {
  rounds: [
    {
      name: 'Четвертьфиналы',
      matches: [
        { id: 1, team1: { name: 'Кибер Орлы' }, team2: { name: 'Стальные Титаны' }, score: '13-8' },
        { id: 2, team1: { name: 'Вихревые Гадюки' }, team2: { name: 'Квантовые Квазары' }, score: '9-13' },
        { id: 3, team1: { name: 'Багровые Крестоносцы' }, team2: { name: 'Призрачные Волки' }, score: '13-5' },
        { id: 4, team1: { name: 'Ледяные Драконы' }, team2: { name: 'Теневые Коты' }, score: '13-11' },
      ],
    },
    {
      name: 'Полуфиналы',
      matches: [
        { id: 5, team1: { name: 'Кибер Орлы' }, team2: { name: 'Квантовые Квазары' }, score: '13-10' },
        { id: 6, team1: { name: 'Багровые Крестоносцы' }, team2: { name: 'Ледяные Драконы' }, score: '7-13' },
      ],
    },
    {
      name: 'Финал',
      matches: [
        { id: 7, team1: { name: 'Кибер Орлы' }, team2: { name: 'Ледяные Драконы' }, score: '2-1', href: '/match-details' },
      ],
    },
     {
      name: 'Чемпион',
      matches: [
        { id: 8, team1: { name: 'Кибер Орлы' }, winner: true },
      ],
    },
  ],
};

const participants = [
  { name: 'Кибер Орлы', logo: 'https://placehold.co/40x40.png', dataAiHint: "eagle logo", status: 'Чемпионы', profileUrl: '/teams/cyber-eagles' },
  { name: 'Ледяные Драконы', logo: 'https://placehold.co/40x40.png', dataAiHint: "dragon logo", status: 'Финалист', profileUrl: '#' },
  { name: 'Квантовые Квазары', logo: 'https://placehold.co/40x40.png', dataAiHint: "galaxy logo", status: 'Полуфиналист', profileUrl: '#' },
  { name: 'Багровые Крестоносцы', logo: 'https://placehold.co/40x40.png', dataAiHint: "knight logo", status: 'Полуфиналист', profileUrl: '#' },
  { name: 'Стальные Титаны', logo: 'https://placehold.co/40x40.png', dataAiHint: "robot titan", status: 'Участник', profileUrl: '#' },
  { name: 'Вихревые Гадюки', logo: 'https://placehold.co/40x40.png', dataAiHint: "snake logo", status: 'Участник', profileUrl: '#' },
  { name: 'Призрачные Волки', logo: 'https://placehold.co/40x40.png', dataAiHint: "wolf logo", status: 'Участник', profileUrl: '#' },
  { name: 'Теневые Коты', logo: 'https://placehold.co/40x40.png', dataAiHint: "cat logo", status: 'Участник', profileUrl: '#' },
];

export default function TournamentPage() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
         <CardHeader className="relative h-48 w-full p-0">
          <Image
            src="https://placehold.co/1200x400.png"
            alt="Summer Kickoff 2024 banner"
            fill
            className="object-cover"
            data-ai-hint="esports gaming"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <Badge variant="destructive" className="mb-2">Идет</Badge>
            <h1 className="font-headline text-4xl font-bold">Summer Kickoff 2024</h1>
            <p className="mt-1 text-lg text-white/80">Главный Valorant турнир этого лета!</p>
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            <Button variant="outline"><FileText className="mr-2 h-4 w-4" />Регламент</Button>
            <Button><PlusCircle className="mr-2 h-4 w-4" />Подать заявку</Button>
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
              <TournamentBracket rounds={bracketData.rounds} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="participants">
            <Card>
                <CardHeader>
                    <CardTitle>Команды-участницы</CardTitle>
                    <CardDescription>Все {participants.length} команд, сражающихся за титул.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {participants.map((team) => (
                        <Card key={team.name} className="p-4">
                           <div className="flex items-center gap-4">
                             <Avatar>
                                <AvatarImage src={team.logo} alt={team.name} data-ai-hint={team.dataAiHint} />
                                <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <div className="flex-1">
                                <p className="font-semibold">{team.name}</p>
                                <Badge variant="secondary">{team.status}</Badge>
                             </div>
                             <Button asChild variant="ghost" size="icon">
                                 <Link href={team.profileUrl}><ArrowRight className="h-4 w-4"/></Link>
                             </Button>
                           </div>
                        </Card>
                    ))}
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
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">Четвертьфиналы</p>
                            <p className="text-sm text-muted-foreground">15 августа 2024</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">Смотреть матчи</Button>
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">Полуфиналы</p>
                            <p className="text-sm text-muted-foreground">16 августа 2024</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">Смотреть матчи</Button>
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">Финал</p>
                            <p className="text-sm text-muted-foreground">17 августа 2024</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">Смотреть трансляцию</Button>
                </div>
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
                    <div className="flex items-start gap-4">
                        <Trophy className="h-8 w-8 text-amber-400 mt-1"/>
                        <div>
                            <p className="font-semibold">1 место</p>
                            <p className="text-muted-foreground">$2,500 + эксклюзивный скин</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Trophy className="h-8 w-8 text-gray-400 mt-1"/>
                        <div>
                            <p className="font-semibold">2 место</p>
                            <p className="text-muted-foreground">$1,500</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Trophy className="h-8 w-8 text-orange-400 mt-1"/>
                        <div>
                            <p className="font-semibold">3-4 место</p>
                            <p className="text-muted-foreground">$500</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Спонсоры</CardTitle>
                    <CardDescription>Компании, которые поддерживают турнир.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Image src="https://placehold.co/150x50.png" alt="Sponsor 1" width={150} height={50} data-ai-hint="corporate logo" />
                    <Image src="https://placehold.co/150x50.png" alt="Sponsor 2" width={150} height={50} data-ai-hint="gaming brand logo" />
                    <Image src="https://placehold.co/150x50.png" alt="Sponsor 3" width={150} height={50} data-ai-hint="beverage logo" />
                </CardContent>
            </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
