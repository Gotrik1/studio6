'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { BookOpen, Youtube, Goal, Users, Share2, MapPin, Activity, GalleryHorizontal, Briefcase, BarChart3, Trophy, BrainCircuit, Link as LinkIcon, CheckCircle, Coins, Calendar, Award, Loader2, TrendingUp, TrendingDown, Sparkles, AlertCircle, Wand2 } from "lucide-react";
import Link from "next/link";
import type { User } from "@/shared/lib/types";
import { achievements, teams, recentMatches, gallery, careerHistory } from "@/shared/lib/mock-data/profiles";
import { pdHistory } from "@/shared/lib/mock-data/gamification";
import { Skeleton } from '@/shared/ui/skeleton';
import { PD_SOURCE_DETAILS, type PD_SOURCE_TYPE } from '@/shared/config/gamification';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { RANKS, getRankByPoints } from "@/shared/config/ranks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { analyzePlayerPerformance, type AnalyzePlayerPerformanceOutput } from '@/shared/api/genkit/flows/analyze-player-performance-flow';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { generateTrainingPlan, type GenerateTrainingPlanOutput } from '@/shared/api/genkit/flows/generate-training-plan-flow';
import { UserAvatarGeneratorDialog } from '@/features/user-avatar-generator';

const OverviewTab = dynamic(() => import('@/entities/player/ui/player-profile-tabs/overview-tab').then(mod => mod.OverviewTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const StatsTab = dynamic(() => import('@/entities/player/ui/player-profile-tabs/stats-tab').then(mod => mod.StatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const CareerTab = dynamic(() => import('@/entities/player/ui/player-profile-tabs/career-tab').then(mod => mod.CareerTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const AchievementsTab = dynamic(() => import('@/entities/player/ui/player-profile-tabs/achievements-tab').then(mod => mod.AchievementsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const TeamsTab = dynamic(() => import('@/entities/player/ui/player-profile-tabs/teams-tab').then(mod => mod.TeamsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const GalleryTab = dynamic(() => import('@/entities/player/ui/player-profile-tabs/gallery-tab').then(mod => mod.GalleryTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});

type PlayerProfileProps = {
  user: User & {
    location: string;
    mainSport: string;
    status: string;
    isVerified: boolean;
    xp: number;
  };
  isCurrentUser: boolean;
};

export function PlayerProfile({ user, isCurrentUser }: PlayerProfileProps) {
  const [avatar, setAvatar] = useState(user.avatar);
  const initials = user.name.split(' ').map((n) => n[0]).join('');
  const totalPd = pdHistory.reduce((sum, item) => sum + item.value, 0);
  const rank = getRankByPoints(user.xp);
  const nextRank = RANKS[RANKS.indexOf(rank) + 1];
  const progressValue = rank.maxPoints === Infinity ? 100 : ((user.xp - rank.minPoints) / (rank.maxPoints - rank.minPoints)) * 100;

  // AI Coach state
  const [isCoachDialogOpen, setIsCoachDialogOpen] = useState(false);
  const [isLoadingCoach, setIsLoadingCoach] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzePlayerPerformanceOutput | null>(null);
  const [trainingPlan, setTrainingPlan] = useState<GenerateTrainingPlanOutput | null>(null);
  
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const handleGetCoaching = async () => {
    setIsLoadingCoach(true);
    setCoachError(null);
    setAnalysisResult(null);
    setTrainingPlan(null);

    try {
      const playerStats = `
        Role: ${user.role},
        Status: ${user.status},
        Main Sport: ${user.mainSport},
        Total Matches: 218,
        Wins: 152
      `;
      const matchHistory = recentMatches.map(m => `vs ${m.teamB}: ${m.scoreA}-${m.scoreB} on ${m.map}`).join('\n');

      const analysis = await analyzePlayerPerformance({ playerStats, matchHistory });
      const plan = await generateTrainingPlan({
        analysis: analysis,
        playerRole: user.role,
      });

      setAnalysisResult(analysis);
      setTrainingPlan(plan);
    } catch (e) {
      console.error(e);
      setCoachError("Не удалось получить персональную тренировку. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsLoadingCoach(false);
    }
  };

  const onCoachDialogOpenChange = (open: boolean) => {
    setIsCoachDialogOpen(open);
    if (open) {
      handleGetCoaching();
    } else {
      setAnalysisResult(null);
      setTrainingPlan(null);
      setCoachError(null);
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={avatar} alt={user.name} data-ai-hint="esports player" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
           {isCurrentUser && (
              <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  onClick={() => setIsAvatarDialogOpen(true)}
                  title="Generate AI Avatar"
              >
                  <Wand2 className="h-4 w-4" />
                  <span className="sr-only">Generate AI Avatar</span>
              </Button>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
              {user.isVerified && <CheckCircle className="h-6 w-6 text-primary" />}
          </div>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex flex-wrap justify-center gap-2 pt-2 sm:justify-start">
            <Badge>{user.role}</Badge>
            <Badge variant="secondary">{user.status}</Badge>
            <Badge variant="outline">PRO Пользователь</Badge>
            {rank && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-help border-amber-500/50">
                      <Award className={cn("mr-1.5 h-3.5 w-3.5", rank.color)} />
                      {rank.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{rank.name}</p>
                    <p className="text-sm text-muted-foreground italic">&quot;{rank.title}&quot;</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
           <div className="flex items-center justify-center gap-4 pt-2 text-sm text-muted-foreground sm:justify-start">
              <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {user.location}</div>
              <div className="flex items-center gap-1"><Activity className="h-4 w-4" /> {user.mainSport}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCoachDialogOpen} onOpenChange={onCoachDialogOpenChange}>
              <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" title="AI-Тренер"><BrainCircuit className="h-5 w-5"/></Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                      <DialogTitle>AI-Тренер</DialogTitle>
                      <DialogDescription>
                          Искусственный интеллект анализирует ваши данные и составляет персональный план тренировок.
                      </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                      {isLoadingCoach ? (
                          <div className="flex flex-col items-center justify-center h-60 gap-4">
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                              <p className="text-muted-foreground">AI-тренер анализирует ваши данные...</p>
                          </div>
                      ) : coachError ? (
                           <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Ошибка</AlertTitle>
                              <AlertDescription>{coachError}</AlertDescription>
                          </Alert>
                      ) : (analysisResult && trainingPlan) && (
                          <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                      <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500"/> Сильные стороны</h3>
                                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                                          {analysisResult.strengths.map((item, i) => <li key={`str-${i}`}>{item}</li>)}
                                      </ul>
                                  </div>
                                  <div className="space-y-2">
                                      <h3 className="font-semibold flex items-center gap-2"><TrendingDown className="h-5 w-5 text-yellow-500"/> Точки роста</h3>
                                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                                           {analysisResult.weaknesses.map((item, i) => <li key={`weak-${i}`}>{item}</li>)}
                                      </ul>
                                  </div>
                              </div>
                              
                              <Card className="bg-muted/50">
                                  <CardHeader>
                                      <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> Персональный план на неделю</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                      <div>
                                          <h4 className="font-semibold text-sm flex items-center gap-1.5"><Activity className="h-4 w-4"/>Фокус недели:</h4>
                                          <p className="text-sm text-muted-foreground">{trainingPlan.weeklyFocus}</p>
                                      </div>
                                          <div>
                                          <h4 className="font-semibold text-sm flex items-center gap-1.5"><BookOpen className="h-4 w-4"/>Упражнения:</h4>
                                          <ul className="space-y-1 mt-1">
                                          {trainingPlan.drills.map((drill, i) => (
                                              <li key={i} className="text-sm text-muted-foreground ml-4 p-2 border-l-2">
                                                  <strong>{drill.name} ({drill.duration}):</strong> {drill.description}
                                              </li>
                                          ))}
                                          </ul>
                                      </div>
                                      <div>
                                          <h4 className="font-semibold text-sm flex items-center gap-1.5"><Youtube className="h-4 w-4"/>Рекомендованные видео:</h4>
                                          <ul className="space-y-1 mt-1">
                                              {trainingPlan.suggestedVideos.map((video, i) => (
                                                  <li key={i} className="text-sm text-primary underline">
                                                      <a href={video.url} target="_blank" rel="noopener noreferrer">{video.title}</a>
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>
                                      <div>
                                          <h4 className="font-semibold text-sm flex items-center gap-1.5"><Goal className="h-4 w-4"/>Цель на неделю:</h4>
                                          <p className="text-sm text-muted-foreground">{trainingPlan.weeklyGoal}</p>
                                      </div>
                                  </CardContent>
                              </Card>
                          </div>
                      )}
                  </div>
              </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" title="Поделиться"><Share2 className="h-5 w-5"/></Button>
          {isCurrentUser ? (
            <Link href="/settings">
              <Button>Редактировать профиль</Button>
            </Link>
          ) : (
              <Button>Бросить вызов</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Прогресс до {nextRank ? `ранга "${nextRank.name}"` : 'максимального ранга'}</span>
            <span>{user.xp.toLocaleString('ru-RU')} / {rank.maxPoints === Infinity ? '∞' : rank.maxPoints.toLocaleString('ru-RU')} XP</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      </CardContent>
      <div className="border-t p-4 md:p-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-7">
            <TabsTrigger value="overview"><Activity className="mr-2 h-4 w-4"/>Обзор</TabsTrigger>
            <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4"/>Статистика</TabsTrigger>
            <TabsTrigger value="career"><Briefcase className="mr-2 h-4 w-4"/>Карьера</TabsTrigger>
            <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4"/>Достижения</TabsTrigger>
            <TabsTrigger value="teams"><Users className="mr-2 h-4 w-4"/>Команды</TabsTrigger>
            <TabsTrigger value="gallery"><GalleryHorizontal className="mr-2 h-4 w-4"/>Галерея</TabsTrigger>
            <TabsTrigger value="pd-wallet"><Coins className="mr-2 h-4 w-4"/>PD Кошелек</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <OverviewTab recentMatches={recentMatches} isCurrentUser={isCurrentUser} />
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <StatsTab />
          </TabsContent>
          
          <TabsContent value="career" className="mt-4">
              <CareerTab careerHistory={careerHistory} isCurrentUser={isCurrentUser} />
          </TabsContent>

          <TabsContent value="achievements" className="mt-4">
            <AchievementsTab achievements={achievements} />
          </TabsContent>
          
          <TabsContent value="teams" className="mt-4">
            <TeamsTab teams={teams} isCurrentUser={isCurrentUser} userName={user.name} />
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-4">
            <GalleryTab gallery={gallery} isCurrentUser={isCurrentUser} />
          </TabsContent>

          <TabsContent value="pd-wallet" className="mt-4">
              <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Текущий баланс</CardTitle>
                              <Coins className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                              <div className="text-2xl font-bold">{totalPd.toLocaleString('ru-RU')} PD</div>
                              <p className="text-xs text-muted-foreground">Всего заработано за все время</p>
                          </CardContent>
                      </Card>
                  </div>

                  <Card>
                      <CardHeader>
                          <CardTitle>История начислений</CardTitle>
                          <CardDescription>Здесь отображаются все ваши операции с PD.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Дата</TableHead>
                                      <TableHead>Источник</TableHead>
                                      <TableHead className="text-right">Сумма</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {pdHistory.map((tx) => (
                                      <TableRow key={tx.id}>
                                          <TableCell>
                                              <div className="flex items-center gap-2">
                                                  <Calendar className="h-4 w-4 text-muted-foreground"/>
                                                  <span>{format(new Date(tx.timestamp), "d MMMM yyyy, HH:mm", { locale: ru })}</span>
                                              </div>
                                          </TableCell>
                                          <TableCell>{PD_SOURCE_DETAILS[tx.source as PD_SOURCE_TYPE]?.description || tx.source}</TableCell>
                                          <TableCell className="text-right font-medium text-green-500">+{tx.value} PD</TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </CardContent>
                  </Card>
              </div>
          </TabsContent>
        </Tabs>
      </div>
       <UserAvatarGeneratorDialog
        isOpen={isAvatarDialogOpen}
        onOpenChange={setIsAvatarDialogOpen}
        currentAvatar={avatar}
        onAvatarSave={setAvatar}
      />
    </Card>
  );
}
