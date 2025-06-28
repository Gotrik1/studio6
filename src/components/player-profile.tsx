
'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Youtube, Goal, Users, Share2, MapPin, Activity, GalleryHorizontal, Briefcase, BarChart3, Trophy, BrainCircuit, Link as LinkIcon, CheckCircle, Coins, Calendar, Award, Loader2, TrendingUp, TrendingDown, Sparkles, AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import type { User } from "@/lib/types";
import { achievements, teams, recentMatches, gallery, careerHistory } from "@/lib/mock-data/profiles";
import { pdHistory } from "@/lib/mock-data/gamification";
import { Skeleton } from './ui/skeleton';
import { PD_SOURCE_DETAILS, type PD_SOURCE_TYPE } from '@/config/gamification';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getRankByPoints, type Rank } from "@/config/ranks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { analyzePlayerPerformance, type AnalyzePlayerPerformanceOutput } from '@/ai/flows/analyze-player-performance-flow';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { generateTrainingPlan, type GenerateTrainingPlanOutput } from '@/ai/flows/generate-training-plan-flow';

const OverviewTab = dynamic(() => import('@/components/player-profile-tabs/overview-tab').then(mod => mod.OverviewTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const StatsTab = dynamic(() => import('@/components/player-profile-tabs/stats-tab').then(mod => mod.StatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const CareerTab = dynamic(() => import('@/components/player-profile-tabs/career-tab').then(mod => mod.CareerTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const AchievementsTab = dynamic(() => import('@/components/player-profile-tabs/achievements-tab').then(mod => mod.AchievementsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const TeamsTab = dynamic(() => import('@/components/player-profile-tabs/teams-tab').then(mod => mod.TeamsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const GalleryTab = dynamic(() => import('@/components/player-profile-tabs/gallery-tab').then(mod => mod.GalleryTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});

type PlayerProfileProps = {
  user: User & {
    location: string;
    mainSport: string;
    status: string;
    isVerified: boolean;
  };
  isCurrentUser: boolean;
};

export function PlayerProfile({ user, isCurrentUser }: PlayerProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');
  const totalPd = pdHistory.reduce((sum, item) => sum + item.value, 0);
  const rank = getRankByPoints(totalPd);

  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzePlayerPerformanceOutput | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [trainingPlan, setTrainingPlan] = useState<GenerateTrainingPlanOutput | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    setTrainingPlan(null);
    setPlanError(null);

    try {
      const playerStats = `
        Role: ${user.role},
        Status: ${user.status},
        Main Sport: ${user.mainSport},
        Total Matches: 218,
        Wins: 152
      `;
      const matchHistory = recentMatches.map(m => `vs ${m.teamB}: ${m.scoreA}-${m.scoreB} on ${m.map}`).join('\n');

      const result = await analyzePlayerPerformance({ playerStats, matchHistory });
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setAnalysisError("Не удалось получить анализ. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!analysisResult) return;
    setIsGeneratingPlan(true);
    setPlanError(null);
    setTrainingPlan(null);

    try {
      const plan = await generateTrainingPlan({
        analysis: analysisResult,
        playerRole: user.role,
      });
      setTrainingPlan(plan);
    } catch (e) {
      console.error(e);
      setPlanError("Не удалось сгенерировать план тренировок. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsAnalysisOpen(open);
    if (open) {
      handleAnalyze();
    } else {
      setAnalysisResult(null);
      setAnalysisError(null);
      setTrainingPlan(null);
      setPlanError(null);
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="esports player" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
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
                      <p className="text-sm text-muted-foreground">{rank.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
             <div className="flex items-center justify-center gap-4 pt-2 text-sm text-muted-foreground sm:justify-start">
                <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {user.location}</div>
                <div className="flex items-center gap-1"><Activity className="h-4 w-4" /> {user.mainSport}</div>
                <div className="flex items-center gap-2">
                    <Link href="#" className="text-muted-foreground hover:text-primary"><LinkIcon className="h-4 w-4" /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><LinkIcon className="h-4 w-4" /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><LinkIcon className="h-4 w-4" /></Link>
                </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAnalysisOpen} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="AI Анализ"><BrainCircuit className="h-5 w-5"/></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>AI-анализ производительности</DialogTitle>
                        <DialogDescription>
                            Искусственный интеллект анализирует ваши последние игры и статистику, чтобы дать персональные советы.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {isAnalyzing && (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                            </div>
                        )}
                        {analysisError && (
                             <Alert variant="destructive">
                                <AlertCircleIcon className="h-4 w-4" />
                                <AlertTitle>Ошибка анализа</AlertTitle>
                                <AlertDescription>{analysisError}</AlertDescription>
                            </Alert>
                        )}
                        {analysisResult && (
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
                                
                                {isGeneratingPlan ? (
                                    <div className="flex items-center justify-center h-40 border rounded-lg border-dashed">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                                    </div>
                                ) : planError ? (
                                    <Alert variant="destructive">
                                        <AlertCircleIcon className="h-4 w-4" />
                                        <AlertTitle>Ошибка генерации плана</AlertTitle>
                                        <AlertDescription>{planError}</AlertDescription>
                                    </Alert>
                                ) : trainingPlan ? (
                                    <Card className="mt-6 bg-muted/50">
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
                                ) : (
                                     <div className="text-center pt-4 border-t">
                                        <Button onClick={handleGeneratePlan}>
                                            <Sparkles className="mr-2 h-4 w-4"/>Сгенерировать план тренировок
                                        </Button>
                                    </div>
                                )}
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
              <span>Прогресс до Уровня 28</span>
              <span>2,300 / 5,000 XP</span>
            </div>
            <Progress value={46} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
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

        <TabsContent value="overview">
          <OverviewTab recentMatches={recentMatches} isCurrentUser={isCurrentUser} />
        </TabsContent>

        <TabsContent value="stats">
          <StatsTab />
        </TabsContent>
        
        <TabsContent value="career">
            <CareerTab careerHistory={careerHistory} isCurrentUser={isCurrentUser} />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsTab achievements={achievements} />
        </TabsContent>
        
        <TabsContent value="teams">
          <TeamsTab teams={teams} isCurrentUser={isCurrentUser} userName={user.name} />
        </TabsContent>
        
        <TabsContent value="gallery">
          <GalleryTab gallery={gallery} isCurrentUser={isCurrentUser} />
        </TabsContent>

        <TabsContent value="pd-wallet">
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Текущий баланс</CardTitle>
                            <Coins className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPd.toLocaleString()} PD</div>
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
  );
}
