'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { fanUser, fanAchievements } from "@/lib/mock-data/fan-profile";
import { Skeleton } from './ui/skeleton';

const FanStatsTab = dynamic(() => import('@/components/fan-profile-tabs/stats-tab').then(mod => mod.FanStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const FanAchievementsTab = dynamic(() => import('@/components/fan-profile-tabs/achievements-tab').then(mod => mod.FanAchievementsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});

type FanProfileProps = {
  user: typeof fanUser;
  achievements: typeof fanAchievements;
};

export function FanProfile({ user, achievements }: FanProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="sports fan" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge>{user.role}</Badge>
              <Badge variant="secondary">Фанат #1 Cyber Eagles</Badge>
            </div>
          </div>
          <Button variant="outline">Подписаться</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Преданный болельщик, поддерживающий массовую киберспортивную сцену.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика болельщика</TabsTrigger>
          <TabsTrigger value="achievements">Достижения болельщика</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <FanStatsTab />
        </TabsContent>
        <TabsContent value="achievements">
          <FanAchievementsTab achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
