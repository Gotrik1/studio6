'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { managerUser, managerAchievements } from "@/shared/lib/mock-data/manager-profile";
import { Skeleton } from '@/shared/ui/skeleton';

const ManagerStatsTab = dynamic(() => import('@/entities/user/ui/manager-profile-tabs/stats-tab').then(mod => mod.ManagerStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const ManagerAchievementsTab = dynamic(() => import('@/entities/user/ui/manager-profile-tabs/achievements-tab').then(mod => mod.ManagerAchievementsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});

type ManagerProfileProps = {
  user: typeof managerUser;
  achievements: typeof managerAchievements;
};

export function ManagerProfile({ user, achievements }: ManagerProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-accent">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="business manager" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="secondary" className="bg-accent/80 text-accent-foreground">{user.role}</Badge>
              <Badge variant="secondary">Агент команды</Badge>
            </div>
          </div>
          <Button>Связаться</Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Профессиональный менеджер и агент команд.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика управления</TabsTrigger>
          <TabsTrigger value="achievements">Достижения менеджера</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <ManagerStatsTab />
        </TabsContent>
        <TabsContent value="achievements">
          <ManagerAchievementsTab achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
