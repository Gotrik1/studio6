
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { coachUser, coachAchievements } from "@/shared/lib/mock-data/coach-profile";
import { trainingPrograms } from '@/shared/lib/mock-data/training-programs';
import { Skeleton } from '@/shared/ui/skeleton';
import { coachedPlayers, type CoachedPlayer } from "@/shared/lib/mock-data/coach-players";
import { PlayerAnalysisDialog } from '@/entities/player/ui/player-analysis-dialog';

const CoachStatsTab = dynamic(() => import('@/entities/user/ui/coach-profile-tabs/stats-tab').then(mod => mod.CoachStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const CoachAchievementsTab = dynamic(() => import('@/entities/user/ui/coach-profile-tabs/achievements-tab').then(mod => mod.CoachAchievementsTab), {
  loading: () => <Card><Skeleton className="h-64 w-full" /></Card>,
  ssr: false,
});
const MyPlayersTab = dynamic(() => import('@/entities/user/ui/coach-profile-tabs/my-players-tab').then(mod => mod.MyPlayersTab), {
    loading: () => <Card><Skeleton className="h-64 w-full" /></Card>,
    ssr: false,
});
const MyProgramsTab = dynamic(() => import('@/entities/user/ui/coach-profile-tabs/my-programs-tab').then(mod => mod.MyProgramsTab), {
    loading: () => <Card><Skeleton className="h-64 w-full" /></Card>,
    ssr: false,
});


type CoachProfileProps = {
  user: typeof coachUser;
  achievements: typeof coachAchievements;
};

export function CoachProfile({ user, achievements }: CoachProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');
  
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<CoachedPlayer | null>(null);

  const handleAnalyzePlayer = (player: CoachedPlayer) => {
      setSelectedPlayer(player);
      setIsAnalysisOpen(true);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 bg-muted/40">
        <Image src="https://placehold.co/1200x400.png" alt="Profile Banner" fill className="object-cover" data-ai-hint="sports strategy playbook" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
      <div className="relative p-6">
          <div className="flex items-end gap-6 -mt-20">
               <Avatar className="h-32 w-32 border-4 border-background bg-background">
                  <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="sports coach" />
                  <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div className="space-y-1">
                          <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
                          <p className="text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                          <Button>Просмотр команды</Button>
                      </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                      <Badge>{user.role}</Badge>
                      <Badge variant="secondary">Сертифицированный ментор</Badge>
                  </div>
              </div>
          </div>
      </div>
      <div className="border-t p-4 md:p-6">
        <Tabs defaultValue="stats">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">Статистика</TabsTrigger>
            <TabsTrigger value="achievements">Достижения</TabsTrigger>
            <TabsTrigger value="my-players">Мои игроки</TabsTrigger>
            <TabsTrigger value="my-programs">Программы</TabsTrigger>
          </TabsList>
          <TabsContent value="stats" className="mt-4">
            <CoachStatsTab />
          </TabsContent>
          <TabsContent value="achievements" className="mt-4">
            <CoachAchievementsTab achievements={achievements} />
          </TabsContent>
          <TabsContent value="my-players" className="mt-4">
            <MyPlayersTab players={coachedPlayers} onAnalyzePlayer={handleAnalyzePlayer} />
          </TabsContent>
          <TabsContent value="my-programs" className="mt-4">
            <MyProgramsTab programs={trainingPrograms} />
          </TabsContent>
        </Tabs>
      </div>
      <PlayerAnalysisDialog 
        isOpen={isAnalysisOpen}
        onOpenChange={setIsAnalysisOpen}
        player={selectedPlayer}
      />
    </Card>
  );
}
