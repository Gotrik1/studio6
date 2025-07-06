

'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Users, Share2, GalleryHorizontal, Briefcase, BarChart3, Trophy, CheckCircle, Award, Wand2, MoreVertical, Flag, HeartPulse, BrainCircuit, Cake, Gamepad2, MapPin, Send, Image as ImageIcon, Sword, ListChecks, UserPlus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from '@/shared/ui/skeleton';
import { getRankByPoints } from "@/shared/config/ranks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { useState } from 'react';
import { UserAvatarGeneratorDialog } from '@/features/user-avatar-generator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { ReportPlayerDialog } from '@/features/report-player-dialog';
import Image from "next/image";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ProfileBannerGeneratorDialog } from '@/features/profile-banner-generator';
import { HolisticAnalysisTab } from '@/widgets/holistic-analysis-tab';
import type { PlayerActivityItem } from '@/widgets/player-activity-feed';
import type { FullUserProfile, UserTeam, CareerHistoryItem, GalleryItem, PlayerStats } from '@/entities/user/model/types';
import type { Achievement } from '@/entities/achievement/model/types';
import { ProposeTrainingDialog } from '@/widgets/propose-training-dialog';


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
const StatsTab = dynamic(() => import('@/entities/player/ui/player-profile-tabs/stats-tab').then(mod => mod.StatsTab), {
    loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
    ssr: false,
});
const PhysicalPrepTab = dynamic(() => import('@/entities/player/ui/player-profile-tabs/physical-prep-tab').then(mod => mod.PhysicalPrepTab), {
    loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
    ssr: false,
});
const PlayerActivityFeed = dynamic(() => import('@/widgets/player-activity-feed').then(mod => mod.PlayerActivityFeed), {
    loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
    ssr: false,
});


type PlayerProfileProps = {
  user: FullUserProfile;
  isCurrentUser: boolean;
  achievements: Achievement[];
  teams: UserTeam[];
  gallery: GalleryItem[];
  careerHistory: CareerHistoryItem[];
  playerActivity: PlayerActivityItem[];
  stats: PlayerStats | null;
};

export function PlayerProfile({ user, isCurrentUser, achievements, teams, gallery, careerHistory, playerActivity, stats }: PlayerProfileProps) {
  const [avatar, setAvatar] = useState(user.avatar);
  const [banner, setBanner] = useState('https://placehold.co/2560x720.png');
  const initials = user.name.split(' ').map((n: string) => n[0]).join('');
  const rank = getRankByPoints(user.xp || 0);
  const progressValue = rank.maxPoints === Infinity ? 100 : (((user.xp || 0) - rank.minPoints) / (rank.maxPoints - rank.minPoints)) * 100;
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isProposeTrainingOpen, setIsProposeTrainingOpen] = useState(false);

  return (
    <>
       <Card className="overflow-hidden">
        <div className="relative aspect-[3/1] bg-muted/40">
          <Image src={banner} alt="Profile Banner" fill className="object-cover" data-ai-hint="esports gaming background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          {isCurrentUser && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 rounded-full h-8 w-8 bg-background/50 backdrop-blur-sm"
              onClick={() => setIsBannerDialogOpen(true)}
              title="Сгенерировать фон"
            >
              <ImageIcon className="h-4 w-4" />
              <span className="sr-only">Сгенерировать фон</span>
            </Button>
          )}
        </div>
        
        <div className="relative p-6">
          <div className="flex flex-col items-center gap-6 -mt-20 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="relative shrink-0">
              <Avatar className="h-32 w-32 border-4 border-background bg-background shadow-lg">
                <AvatarImage src={avatar || ''} alt={user.name} data-ai-hint="esports player" />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>
              {isCurrentUser && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-1 right-1 rounded-full h-8 w-8 bg-background"
                  onClick={() => setIsAvatarDialogOpen(true)}
                  title="Изменить аватар"
                >
                  <Wand2 className="h-4 w-4" />
                  <span className="sr-only">Изменить аватар</span>
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
                        <div className="flex items-center gap-2">
                            <Button><UserPlus className="mr-2 h-4 w-4"/> Добавить в друзья</Button>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-5 w-5" />
                                    <span className="sr-only">Действия</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsProposeTrainingOpen(true)}>
                                        <Sword className="mr-2 h-4 w-4"/>
                                        Предложить тренировку
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Share2 className="mr-2 h-4 w-4"/>
                                        Поделиться
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        className="text-destructive"
                                        onClick={() => setIsReportDialogOpen(true)}
                                    >
                                        <Flag className="mr-2 h-4 w-4"/> Пожаловаться
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
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
                <span>Прогресс</span>
                <span>{(user.xp || 0).toLocaleString('ru-RU')} / {rank.maxPoints === Infinity ? '∞' : rank.maxPoints.toLocaleString('ru-RU')} XP</span>
            </div>
            <Progress value={progressValue} className="h-2" />
            </div>
        </CardContent>

        <CardContent className="grid gap-6 border-b p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4">
                <Cake className="h-6 w-6 text-pink-500" />
                <div>
                    <p className="font-semibold">{user.age} лет ({format(new Date(user.dateOfBirth), 'd MMMM yyyy', { locale: ru })})</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-blue-500" />
                <div>
                    <p className="font-semibold">{user.location}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Gamepad2 className="h-6 w-6 text-green-500" />
                <div className="flex flex-wrap gap-1">
                    {user.preferredSports.map(sport => <Badge key={sport} variant="secondary">{sport}</Badge>)}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Send className="h-6 w-6 text-purple-500" />
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`https://t.me/${user.contacts.telegram.slice(1)}`} target="_blank">Telegram</Link>
                    </Button>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm">Discord</Button>
                            </TooltipTrigger>
                            <TooltipContent><p>{user.contacts.discord}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </CardContent>

        <div className="p-4 md:p-6">
            <Tabs defaultValue="activity">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="activity"><ListChecks className="mr-2 h-4 w-4"/>Активность</TabsTrigger>
                <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4"/>Статистика</TabsTrigger>
                <TabsTrigger value="physical-prep"><HeartPulse className="mr-2 h-4 w-4" />Физ. подготовка</TabsTrigger>
                <TabsTrigger value="holistic-analysis"><BrainCircuit className="mr-2 h-4 w-4" />Компл. анализ</TabsTrigger>
                <TabsTrigger value="career"><Briefcase className="mr-2 h-4 w-4"/>Карьера</TabsTrigger>
                <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4"/>Достижения</TabsTrigger>
                <TabsTrigger value="teams"><Users className="mr-2 h-4 w-4"/>Команды</TabsTrigger>
                <TabsTrigger value="gallery"><GalleryHorizontal className="mr-2 h-4 w-4"/>Галерея</TabsTrigger>
                </TabsList>

            <TabsContent value="activity" className="mt-4">
                <PlayerActivityFeed activities={playerActivity} />
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
                <StatsTab stats={stats} />
            </TabsContent>

            <TabsContent value="physical-prep" className="mt-4">
                <PhysicalPrepTab />
            </TabsContent>

            <TabsContent value="holistic-analysis" className="mt-4">
                <HolisticAnalysisTab stats={stats} />
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
            currentAvatar={avatar || ''}
            onAvatarSave={setAvatar}
        />
        <ProfileBannerGeneratorDialog
            isOpen={isBannerDialogOpen}
            onOpenChange={setIsBannerDialogOpen}
            currentBanner={banner}
            onBannerSave={setBanner}
            defaultPrompt={`esports gaming background for a player, main sport is ${user.mainSport}`}
        />
        <ReportPlayerDialog
            isOpen={isReportDialogOpen}
            onOpenChange={setIsReportDialogOpen}
            reportedPlayerId={user.id}
            reportedPlayerName={user.name}
        />
        <ProposeTrainingDialog
            isOpen={isProposeTrainingOpen}
            onOpenChange={setIsProposeTrainingOpen}
            challengedPlayer={{id: user.id, name: user.name}}
        />
    </>
  );
}
