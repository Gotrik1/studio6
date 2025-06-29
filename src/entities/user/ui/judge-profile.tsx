'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { judgeUser, judgeAchievements } from "@/shared/lib/mock-data/judge-profile";
import { Skeleton } from '@/shared/ui/skeleton';

const JudgeStatsTab = dynamic(() => import('@/entities/user/ui/judge-profile-tabs/stats-tab').then(mod => mod.JudgeStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const JudgeAchievementsTab = dynamic(() => import('@/entities/user/ui/judge-profile-tabs/achievements-tab').then(mod => mod.JudgeAchievementsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});

type JudgeProfileProps = {
  user: typeof judgeUser;
  achievements: typeof judgeAchievements;
};

export function JudgeProfile({ user, achievements }: JudgeProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-secondary">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="judge portrait" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="secondary">{user.role}</Badge>
              <Badge variant="outline">Сертифицированный судья</Badge>
            </div>
          </div>
          <Button>Просмотр расписания</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Сертифицированный судья для турниров по CS:GO 2 и Valorant.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика судейства</TabsTrigger>
          <TabsTrigger value="achievements">Достижения судьи</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <JudgeStatsTab />
        </TabsContent>
        <TabsContent value="achievements">
            <JudgeAchievementsTab achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
