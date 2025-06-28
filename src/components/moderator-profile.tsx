'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { moderatorUser, moderatorAchievements } from "@/lib/mock-data/moderator-profile";
import { Skeleton } from './ui/skeleton';

const ModeratorStatsTab = dynamic(() => import('@/components/moderator-profile-tabs/stats-tab').then(mod => mod.ModeratorStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const ModeratorAchievementsTab = dynamic(() => import('@/components/moderator-profile-tabs/achievements-tab').then(mod => mod.ModeratorAchievementsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});

type ModeratorProfileProps = {
  user: typeof moderatorUser;
  achievements: typeof moderatorAchievements;
};

export function ModeratorProfile({ user, achievements }: ModeratorProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-accent">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="moderator avatar" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="secondary" className="bg-accent/80 text-accent-foreground">{user.role}</Badge>
              <Badge variant="secondary">Хранитель контента</Badge>
            </div>
          </div>
          <Button>Очередь модерации</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Модератор, ответственный за соблюдение правил сообщества.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика модерации</TabsTrigger>
          <TabsTrigger value="achievements">Достижения модератора</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <ModeratorStatsTab />
        </TabsContent>
        <TabsContent value="achievements">
          <ModeratorAchievementsTab achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
