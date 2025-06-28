'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Share2, MapPin, Activity, GalleryHorizontal, Briefcase, BarChart3, Trophy, BrainCircuit, Link as LinkIcon, CheckCircle } from "lucide-react";
import Link from "next/link";
import type { User } from "@/lib/session";
import { achievements, teams, recentMatches, gallery, careerHistory } from "@/lib/mock-data";
import { Skeleton } from './ui/skeleton';

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
            <Button variant="ghost" size="icon"><BrainCircuit className="h-5 w-5"/></Button>
            <Button variant="outline" size="icon"><Share2 className="h-5 w-5"/></Button>
            {isCurrentUser ? (
              <Button>Редактировать профиль</Button>
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
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          <TabsTrigger value="overview"><Activity className="mr-2 h-4 w-4"/>Обзор</TabsTrigger>
          <TabsTrigger value="stats"><BarChart3 className="mr-2 h-4 w-4"/>Статистика</TabsTrigger>
          <TabsTrigger value="career"><Briefcase className="mr-2 h-4 w-4"/>Карьера</TabsTrigger>
          <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4"/>Достижения</TabsTrigger>
          <TabsTrigger value="teams"><Users className="mr-2 h-4 w-4"/>Команды</TabsTrigger>
          <TabsTrigger value="gallery"><GalleryHorizontal className="mr-2 h-4 w-4"/>Галерея</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
