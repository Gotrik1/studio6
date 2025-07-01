
'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Users, Share2, Activity, GalleryHorizontal, Briefcase, BarChart3, Trophy, CheckCircle, Coins, Award, Wand2, MoreVertical, Flag, HeartPulse, BrainCircuit, Gamepad2 } from "lucide-react";
import Link from "next/link";
import type { User } from "@/shared/lib/types";
import { Skeleton } from '@/shared/ui/skeleton';
import { RANKS, getRankByPoints } from "@/shared/config/ranks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';
import { UserAvatarGeneratorDialog } from '@/features/user-avatar-generator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { ScrollArea } from '@/shared/ui/scroll-area';
import type { achievements as AchievementsArray, teams as TeamsArray, recentMatches as MatchesArray, gallery as GalleryArray, careerHistory as CareerHistoryArray } from "@/shared/lib/mock-data/profiles";
import { ReportPlayerDialog } from '@/features/report-player-dialog';
import Image from "next/image";


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
const PhysicalPrepTab = dynamic(() => import('@/entities/player/ui/player-profile-tabs/physical-prep-tab').then(mod => mod.PhysicalPrepTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});
const AiAnalystTab = dynamic(() => import('@/entities/player/ui/player-profile-tabs/ai-analyst-tab').then(mod => mod.AiAnalystTab), {
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
  achievements: typeof AchievementsArray;
  teams: typeof TeamsArray;
  recentMatches: typeof MatchesArray;
  gallery: typeof GalleryArray;
  careerHistory: typeof CareerHistoryArray;
};

export function PlayerProfile({ user, isCurrentUser, achievements, teams, recentMatches, gallery, careerHistory }: PlayerProfileProps) {
  const [avatar, setAvatar] = useState(user.avatar);
  const initials = user.name.split(' ').map((n) => n[0]).join('');
  const rank = getRankByPoints(user.xp);
  const nextRank = RANKS[RANKS.indexOf(rank) + 1];
  const progressValue = rank.maxPoints === Infinity ? 100 : ((user.xp - rank.minPoints) / (rank.maxPoints - rank.minPoints)) * 100;
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  return (
    <>
       <Card className="overflow-hidden">
        <div className="relative h-48 bg-muted/40">
          <Image src="https://placehold.co/1200x400.png" alt="Profile Banner" fill className="object-cover" data-ai-hint="esports gaming background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <div className="relative p-6">
          <div className="flex flex-col items-center gap-6 -mt-24 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="relative shrink-0">
              <Avatar className="h-32 w-32 border-4 border-background bg-background shadow-lg">
                <AvatarImage src={avatar} alt={user.name} data-ai-hint="esports player" />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>
              {isCurrentUser && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-1 right-1 rounded-full h-8 w-8 bg-background"
                  onClick={() => setIsAvatarDialogOpen(true)}
                  title="Generate AI Avatar"
                >
                  <Wand2 className="h-4 w-4" />
                  <span className="sr-only">Generate AI Avatar</span>
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-2 w-full">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
                      {user.isVerified && <CheckCircle className="h-6 w-6 text-primary" />}
                  </div>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                 <div className="flex gap-2 justify-center sm:justify-end">
                    {isCurrentUser ? (
                        <div className="flex gap-2">
                        <Button variant="outline" size="sm" title="Поделиться"><Share2 className="h-4 w-4"/></Button>
                        <Link href="/settings">
                            <Button size="sm">Редактировать</Button>
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
                            <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => setIsReportDialogOpen(true)}
                            >
                                <Flag className="mr-2 h-4 w-4"/> Пожаловаться
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
              </div>
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
          </div>
        </div>

        <CardContent className="p-6 pt-2 border-b">
            <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Прогресс до {nextRank ? `ранга "${nextRank.name}"` : 'максимального ранга'}</span>
                <span>{user.xp.toLocaleString('ru-RU')} / {rank.maxPoints === Infinity ? '∞' : rank.maxPoints.toLocaleString('ru-RU')} XP</span>
            </div>
            <Progress value={progressValue} className="h-2" />
            </div>
        </CardContent>
        <div className="p-4 md:p-6">
            <Tabs defaultValue="overview">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <TabsList className="inline-flex">
                <TabsTrigger value="overview"><Activity className="mr-2 h-4 w-4"/>Обзор</TabsTrigger>
                <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4"/>Статистика</TabsTrigger>
                <TabsTrigger value="physical-prep"><HeartPulse className="mr-2 h-4 w-4" />Физ. подготовка</TabsTrigger>
                <TabsTrigger value="ai-analyst"><BrainCircuit className="mr-2 h-4 w-4" />AI-Аналитик</TabsTrigger>
                <TabsTrigger value="career"><Briefcase className="mr-2 h-4 w-4"/>Карьера</TabsTrigger>
                <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4"/>Достижения</TabsTrigger>
                <TabsTrigger value="teams"><Users className="mr-2 h-4 w-4"/>Команды</TabsTrigger>
                <TabsTrigger value="gallery"><GalleryHorizontal className="mr-2 h-4 w-4"/>Галерея</TabsTrigger>
                </TabsList>
            </ScrollArea>

            <TabsContent value="overview" className="mt-4">
                <OverviewTab recentMatches={recentMatches} isCurrentUser={isCurrentUser} />
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
                <StatsTab />
            </TabsContent>

            <TabsContent value="physical-prep" className="mt-4">
                <PhysicalPrepTab />
            </TabsContent>

            <TabsContent value="ai-analyst" className="mt-4">
                <AiAnalystTab user={user} />
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
            </Tabs>
        </div>
        </Card>
        <UserAvatarGeneratorDialog
            isOpen={isAvatarDialogOpen}
            onOpenChange={setIsAvatarDialogOpen}
            currentAvatar={avatar}
            onAvatarSave={setAvatar}
        />
        <ReportPlayerDialog
            isOpen={isReportDialogOpen}
            onOpenChange={setIsReportDialogOpen}
            reportedPlayerName={user.name}
        />
    </>
  );
}
