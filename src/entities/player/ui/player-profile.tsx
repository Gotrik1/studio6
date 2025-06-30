'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Users, Share2, MapPin, Activity, GalleryHorizontal, Briefcase, BarChart3, Trophy, BrainCircuit, CheckCircle, Coins, Calendar, Award, Wand2, MoreVertical, Flag, DollarSign } from "lucide-react";
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
import { UserAvatarGeneratorDialog } from '@/features/user-avatar-generator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { ScrollArea } from '@/shared/ui/scroll-area';

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
const AiCoachTab = dynamic(() => import('@/entities/player/ui/player-profile-tabs/ai-coach-tab').then(mod => mod.AiCoachTab), {
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
  const rank = getRankByPoints(user.xp);
  const nextRank = RANKS[RANKS.indexOf(rank) + 1];
  const progressValue = rank.maxPoints === Infinity ? 100 : ((user.xp - rank.minPoints) / (rank.maxPoints - rank.minPoints)) * 100;
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  
  const totalEarned = pdHistory.filter(item => item.value > 0).reduce((sum, item) => sum + item.value, 0);
  const totalSpent = pdHistory.filter(item => item.value < 0).reduce((sum, item) => sum + item.value, 0);
  const totalPd = totalEarned + totalSpent;


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
        </div>
        <div className="flex gap-2">
          {isCurrentUser ? (
             <div className="flex gap-2">
              <Button variant="outline" size="icon" title="Поделиться"><Share2 className="h-5 w-5"/></Button>
              <Link href="/settings">
                <Button>Редактировать</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">Действия</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Бросить вызов</DropdownMenuItem>
                <DropdownMenuItem>Поделиться</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                    <Flag className="mr-2 h-4 w-4"/> Пожаловаться
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <TabsList className="inline-flex">
              <TabsTrigger value="overview"><Activity className="mr-2 h-4 w-4"/>Обзор</TabsTrigger>
              <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4"/>Статистика</TabsTrigger>
              <TabsTrigger value="ai-coach"><BrainCircuit className="mr-2 h-4 w-4"/>AI-Тренер</TabsTrigger>
              <TabsTrigger value="career"><Briefcase className="mr-2 h-4 w-4"/>Карьера</TabsTrigger>
              <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4"/>Достижения</TabsTrigger>
              <TabsTrigger value="teams"><Users className="mr-2 h-4 w-4"/>Команды</TabsTrigger>
              <TabsTrigger value="gallery"><GalleryHorizontal className="mr-2 h-4 w-4"/>Галерея</TabsTrigger>
              <TabsTrigger value="pd-wallet"><Coins className="mr-2 h-4 w-4"/>PD Кошелек</TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="overview" className="mt-4">
            <OverviewTab recentMatches={recentMatches} isCurrentUser={isCurrentUser} />
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <StatsTab />
          </TabsContent>
          
          <TabsContent value="ai-coach" className="mt-4">
            <AiCoachTab user={user} />
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
                          </CardContent>
                      </Card>
                       <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium text-green-500">Всего заработано</CardTitle>
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                              <div className="text-2xl font-bold">{totalEarned.toLocaleString('ru-RU')} PD</div>
                          </CardContent>
                      </Card>
                       <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium text-red-500">Всего потрачено</CardTitle>
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                              <div className="text-2xl font-bold">{Math.abs(totalSpent).toLocaleString('ru-RU')} PD</div>
                          </CardContent>
                      </Card>
                  </div>

                  <Card>
                      <CardHeader>
                          <CardTitle>История транзакций</CardTitle>
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
                                          <TableCell className={cn("text-right font-medium", tx.value > 0 ? 'text-green-500' : 'text-red-500')}>
                                            {tx.value > 0 ? '+' : ''}{tx.value.toLocaleString('ru-RU')} PD
                                          </TableCell>
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
