
'use client';

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Shield, Star, Trophy, Users, Video, Image as ImageIcon, BarChart, FileText, Coins } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const matchData = {
  team1: { name: "Кибер Орлы", logo: "https://placehold.co/128x128.png", logoHint: "eagle logo" },
  team2: { name: "Ледяные Драконы", logo: "https://placehold.co/128x128.png", logoHint: "dragon logo" },
  score: "2-1",
  tournament: "Summer Kickoff 2024 - Финал",
  status: "Завершен",
  date: "17 августа 2024",
  time: "19:00",
  location: "Арена 'Колизей'",
  referee: { name: "Судья Джуди", profileUrl: "/administration/judge" },
  events: [
    { time: "15'", event: "Гол", player: "Alex 'CyberSlasher' Doe", team: "Кибер Орлы" },
    { time: "32'", event: "Желтая карточка", player: "Dmitry 'Gadget' Kuznetsov", team: "Кибер Орлы" },
    { time: "55'", event: "Гол", player: "Frosty", team: "Ледяные Драконы" },
    { time: "89'", event: "Победный гол", player: "Maria 'Shadow' Petrova", team: "Кибер Орлы" },
  ],
  teamStats: {
    possession: { team1: 58, team2: 42 },
    shots: { team1: 14, team2: 9 },
    shotsOnTarget: { team1: 8, team2: 5 },
    corners: { team1: 6, team2: 3 },
    fouls: { team1: 12, team2: 15 },
  },
  lineups: {
    team1: [
      { name: "Alex 'CyberSlasher' Doe", role: "Дуэлянт", avatar: "https://placehold.co/100x100.png", avatarHint: "esports player" },
      { name: "Maria 'Shadow' Petrova", role: "Смоукер", avatar: "https://placehold.co/100x100.png", avatarHint: "female gamer" },
      { name: "Ivan 'Beast' Orlov", role: "Страж", avatar: "https://placehold.co/100x100.png", avatarHint: "focused gamer" },
    ],
    team2: [
      { name: "Frosty", role: "Дуэлянт", avatar: "https://placehold.co/100x100.png", avatarHint: "gamer winter" },
      { name: "IceQueen", role: "Страж", avatar: "https://placehold.co/100x100.png", avatarHint: "ice queen" },
      { name: "Blizzard", role: "Смоукер", avatar: "https://placehold.co/100x100.png", avatarHint: "snow storm" },
    ]
  },
  media: [
    { type: 'image', src: 'https://placehold.co/600x400.png', hint: 'esports winner' },
    { type: 'video', src: 'https://placehold.co/600x400.png', hint: 'esports highlights' },
    { type: 'image', src: 'https://placehold.co/600x400.png', hint: 'team celebration' },
    { type: 'image', src: 'https://placehold.co/600x400.png', hint: 'esports crowd' },
  ]
};

export default function MatchDetailsPage() {
  const { toast } = useToast();
  const [team1Bet, setTeam1Bet] = useState(1000);
  const [team2Bet, setTeam2Bet] = useState(1000);
  const totalBet = team1Bet + team2Bet;
  const [hasBet, setHasBet] = useState(false);
  
  const [isBetDialogOpen, setIsBetDialogOpen] = useState(false);
  const [betAmount, setBetAmount] = useState('50');
  const [selectedTeamForBet, setSelectedTeamForBet] = useState<'team1' | 'team2' | null>(null);

  const handlePlaceBet = () => {
    const amount = parseInt(betAmount);
    if (!selectedTeamForBet || !amount || amount <= 0) {
        toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Пожалуйста, выберите команду и введите корректную сумму ставки.",
        });
        return;
    }

    if (selectedTeamForBet === 'team1') {
        setTeam1Bet(prev => prev + amount);
    } else {
        setTeam2Bet(prev => prev + amount);
    }

    setHasBet(true);
    setIsBetDialogOpen(false);
    toast({
        title: "Ставка принята!",
        description: `Вы поставили ${amount} PD на команду "${selectedTeamForBet === 'team1' ? matchData.team1.name : matchData.team2.name}".`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={matchData.team1.logo} data-ai-hint={matchData.team1.logoHint} />
                <AvatarFallback>{matchData.team1.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="font-headline text-2xl font-bold">{matchData.team1.name}</h2>
            </div>
            <div className="text-center">
              <p className="font-headline text-4xl font-bold">{matchData.score}</p>
              <p className="text-sm text-muted-foreground">{matchData.tournament}</p>
              <Badge variant="outline" className="mt-1">{matchData.status}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="font-headline text-2xl font-bold">{matchData.team2.name}</h2>
              <Avatar className="h-16 w-16">
                <AvatarImage src={matchData.team2.logo} data-ai-hint={matchData.team2.logoHint} />
                <AvatarFallback>{matchData.team2.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-2 border-t p-4">
          <Button variant="secondary"><Video className="mr-2 h-4 w-4" />Смотреть трансляцию</Button>
          <Button variant="outline"><BarChart className="mr-2 h-4 w-4" />Полная статистика</Button>
          <Button variant="outline"><FileText className="mr-2 h-4 w-4" />Протокол матча</Button>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Coins className="h-6 w-6 text-amber-400" /> Ставки на матч</CardTitle>
            <CardDescription>Победитель забирает банк. Ставки принимаются до начала матча.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
            <div className="text-center">
                <p className="font-semibold">{matchData.team1.name}</p>
                <p className="font-headline text-2xl font-bold">{team1Bet.toLocaleString()} PD</p>
            </div>
            <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Общий банк</p>
                <p className="font-headline text-4xl font-bold text-primary">{totalBet.toLocaleString()} PD</p>
                 <Dialog open={isBetDialogOpen} onOpenChange={setIsBetDialogOpen}>
                    <DialogTrigger asChild>
                        <Button disabled={hasBet}>
                            {hasBet ? "Ставка сделана" : "Сделать ставку"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Сделать ставку на матч</DialogTitle>
                            <DialogDescription>
                                Выберите команду и сумму ставки. Удачи!
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <RadioGroup onValueChange={(value: 'team1' | 'team2') => setSelectedTeamForBet(value)}>
                                <Label className="font-semibold">Выберите команду</Label>
                                <div className="flex gap-4">
                                    <Label htmlFor="team1" className="flex flex-1 items-center gap-2 rounded-md border p-3 hover:bg-accent cursor-pointer has-[:checked]:border-primary">
                                        <RadioGroupItem value="team1" id="team1" />
                                        {matchData.team1.name}
                                    </Label>
                                    <Label htmlFor="team2" className="flex flex-1 items-center gap-2 rounded-md border p-3 hover:bg-accent cursor-pointer has-[:checked]:border-primary">
                                        <RadioGroupItem value="team2" id="team2" />
                                        {matchData.team2.name}
                                    </Label>
                                </div>
                            </RadioGroup>
                            <div className="space-y-2">
                                <Label htmlFor="bet-amount">Сумма ставки (PD)</Label>
                                <Input
                                    id="bet-amount"
                                    type="number"
                                    value={betAmount}
                                    onChange={(e) => setBetAmount(e.target.value)}
                                    placeholder="50"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsBetDialogOpen(false)}>Отмена</Button>
                            <Button onClick={handlePlaceBet}>Поставить</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="text-center">
                <p className="font-semibold">{matchData.team2.name}</p>
                <p className="font-headline text-2xl font-bold">{team2Bet.toLocaleString()} PD</p>
            </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="stats">Статистика</TabsTrigger>
          <TabsTrigger value="lineups">Составы</TabsTrigger>
          <TabsTrigger value="media">Медиа</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Информация о матче</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center"><Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> {matchData.date}</div>
                <div className="flex items-center"><Clock className="mr-2 h-4 w-4 text-muted-foreground" /> {matchData.time} (МСК)</div>
                <div className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" /> {matchData.location}</div>
                <div className="flex items-center"><Shield className="mr-2 h-4 w-4 text-muted-foreground" /> Судья: {matchData.referee.name}</div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Ключевые события</CardTitle>
                <CardDescription>Хронология матча.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matchData.events.map((event, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="font-mono text-sm">{event.time}</div>
                      <div className="h-full w-px bg-border"></div>
                      <div>
                        <p className="font-semibold">{event.event}</p>
                        <p className="text-xs text-muted-foreground">{event.player} ({event.team})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats">
            <Card>
                <CardHeader>
                    <CardTitle>Статистика команд</CardTitle>
                    <CardDescription>Сравнительные показатели эффективности.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries(matchData.teamStats).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>{value.team1}</span>
                                <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span>{value.team2}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress value={value.team1 / (value.team1 + value.team2) * 100} className="h-3 [&>div]:bg-primary" />
                                <Progress value={value.team2 / (value.team1 + value.team2) * 100} className="h-3 scale-x-[-1] [&>div]:bg-destructive" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="lineups">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>{matchData.team1.name}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                         {matchData.lineups.team1.map((player) => (
                            <div key={player.name} className="flex items-center gap-3">
                                <Avatar><AvatarImage src={player.avatar} data-ai-hint={player.avatarHint} /><AvatarFallback>{player.name.charAt(0)}</AvatarFallback></Avatar>
                                <div>
                                    <p className="font-semibold">{player.name}</p>
                                    <p className="text-sm text-muted-foreground">{player.role}</p>
                                </div>
                            </div>
                         ))}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>{matchData.team2.name}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                         {matchData.lineups.team2.map((player) => (
                            <div key={player.name} className="flex items-center gap-3">
                                <Avatar><AvatarImage src={player.avatar} data-ai-hint={player.avatarHint} /><AvatarFallback>{player.name.charAt(0)}</AvatarFallback></Avatar>
                                <div>
                                    <p className="font-semibold">{player.name}</p>
                                    <p className="text-sm text-muted-foreground">{player.role}</p>
                                </div>
                            </div>
                         ))}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

         <TabsContent value="media">
            <Card>
                <CardHeader>
                    <CardTitle>Медиагалерея</CardTitle>
                    <CardDescription>Лучшие моменты матча в фото и видео.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {matchData.media.map((item, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-lg border">
                                <Image 
                                    src={item.src} 
                                    alt={`Media ${index + 1}`} 
                                    width={600} 
                                    height={400} 
                                    className="aspect-video h-full w-full object-cover transition-transform group-hover:scale-105"
                                    data-ai-hint={item.hint}
                                />
                                {item.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <Video className="h-10 w-10 text-white"/>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
