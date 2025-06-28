'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { coachUser, coachAchievements } from "@/lib/mock-data/coach-profile";
import { Skeleton } from './ui/skeleton';

const CoachStatsTab = dynamic(() => import('@/components/coach-profile-tabs/stats-tab').then(mod => mod.CoachStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const CoachAchievementsTab = dynamic(() => import('@/components/coach-profile-tabs/achievements-tab').then(mod => mod.CoachAchievementsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});

type CoachProfileProps = {
  user: typeof coachUser;
  achievements: typeof coachAchievements;
};

export function CoachProfile({ user, achievements }: CoachProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="sports coach" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge>{user.role}</Badge>
              <Badge variant="secondary">Сертифицированный ментор</Badge>
            </div>
          </div>
          <Button>Просмотр команды</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Опытный тренер, специализирующийся на командных стратегиях в Valorant.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика тренера</TabsTrigger>
          <TabsTrigger value="achievements">Достижения тренера</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <CoachStatsTab />
        </TabsContent>
        <TabsContent value="achievements">
          <CoachAchievementsTab achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
