
'use client';

import { useState } from "react";
import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, BarChart, FileText, Coins, BrainCircuit, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import type { MatchDetails } from "@/lib/mock-data/match-details";
import { Progress } from "@/components/ui/progress";
import { ReportScoreDialog } from "@/components/report-score-dialog";

const OverviewTab = dynamic(() => import('@/components/match-details-tabs/overview-tab').then(mod => mod.OverviewTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const StatsTab = dynamic(() => import('@/components/match-details-tabs/stats-tab').then(mod => mod.StatsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const LineupsTab = dynamic(() => import('@/components/match-details-tabs/lineups-tab').then(mod => mod.LineupsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const MediaTab = dynamic(() => import('@/components/match-details-tabs/media-tab').then(mod => mod.MediaTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const AiAnalysisTab = dynamic(() => import('@/components/match-details-tabs/ai-analysis-tab').then(mod => mod.AiAnalysisTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});


interface MatchDetailsClientProps {
    match: MatchDetails;
}

export default function MatchDetailsClient({ match }: MatchDetailsClientProps) {
  const { toast } = useToast();
  const [team1Bet, setTeam1Bet] = useState(1000);
  const [team2Bet, setTeam2Bet] = useState(1000);
  const totalBet = team1Bet + team2Bet;
  const [hasBet, setHasBet] = useState(false);
  
  const [isBetDialogOpen, setIsBetDialogOpen] = useState(false);
  const [betAmount, setBetAmount] = useState('50');
  const [selectedTeamForBet, setSelectedTeamForBet] = useState<'team1' | 'team2' | null>(null);

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isReported, setIsReported] = useState(false);

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
        description: `Вы поставили ${amount} PD на команду "${selectedTeamForBet === 'team1' ? match.team1.name : match.team2.name}".`,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="p-4">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={match.team1.logo} data-ai-hint={match.team1.logoHint} />
                  <AvatarFallback>{match.team1.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="font-headline text-2xl font-bold">{match.team1.name}</h2>
              </div>
              <div className="text-center">
                <p className="font-headline text-4xl font-bold">{match.score}</p>
                <p className="text-sm text-muted-foreground">{match.tournament}</p>
                <Badge variant="outline" className="mt-1">{match.status}</Badge>
              </div>
              <div className="flex items-center gap-4">
                <h2 className="font-headline text-2xl font-bold">{match.team2.name}</h2>
                <Avatar className="h-16 w-16">
                  <AvatarImage src={match.team2.logo} data-ai-hint={match.team2.logoHint} />
                  <AvatarFallback>{match.team2.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-2 border-t p-4">
            <Button variant="secondary"><Video className="mr-2 h-4 w-4" />Смотреть трансляцию</Button>
            <Button variant="outline"><BarChart className="mr-2 h-4 w-4" />Полная статистика</Button>
            {match.status === 'Завершен' && (
              <Button variant="outline" onClick={() => setIsReportDialogOpen(true)} disabled={isReported}>
                <Flag className="mr-2 h-4 w-4" />
                {isReported ? "Результат сообщен" : "Сообщить результат"}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Coins className="h-6 w-6 text-amber-400" /> Ставки на матч</CardTitle>
              <CardDescription>Победитель забирает банк. Ставки принимаются до начала матча.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="w-full max-w-lg space-y-2">
                  <div className="flex justify-between font-bold text-lg">
                      <span>{match.team1.name}</span>
                      <span>{match.team2.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <Progress value={totalBet > 0 ? (team1Bet / totalBet) * 100 : 50} className="h-3 [&>div]:bg-primary" />
                      <Progress value={totalBet > 0 ? (team2Bet / totalBet) * 100 : 50} className="h-3 scale-x-[-1] [&>div]:bg-destructive" />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                      <span className="font-semibold">{team1Bet.toLocaleString()} PD</span>
                      <span className="font-semibold">{team2Bet.toLocaleString()} PD</span>
                  </div>
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
                                          {match.team1.name}
                                      </Label>
                                      <Label htmlFor="team2" className="flex flex-1 items-center gap-2 rounded-md border p-3 hover:bg-accent cursor-pointer has-[:checked]:border-primary">
                                          <RadioGroupItem value="team2" id="team2" />
                                          {match.team2.name}
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
          </CardContent>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="stats">Статистика</TabsTrigger>
            <TabsTrigger value="lineups">Составы</TabsTrigger>
            <TabsTrigger value="media">Медиа</TabsTrigger>
            <TabsTrigger value="ai-analysis"><BrainCircuit className="h-4 w-4 mr-2"/>AI-Анализ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab match={match} />
          </TabsContent>

          <TabsContent value="stats">
              <StatsTab stats={match.teamStats} />
          </TabsContent>

          <TabsContent value="lineups">
              <LineupsTab match={match} />
          </TabsContent>

          <TabsContent value="media">
              <MediaTab media={match.media} />
          </TabsContent>

          <TabsContent value="ai-analysis">
              <AiAnalysisTab match={match} />
          </TabsContent>
        </Tabs>
      </div>
      <ReportScoreDialog
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        onReportSubmit={() => setIsReported(true)}
        matchName={`${match.team1.name} vs ${match.team2.name}`}
      />
    </>
  );
}
