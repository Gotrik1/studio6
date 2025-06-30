
'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { managerUser, managerAchievements } from "@/shared/lib/mock-data/manager-profile";
import { Skeleton } from '@/shared/ui/skeleton';

const ManagerStatsTab = dynamic(() => import('@/entities/user/ui/manager-profile-tabs/stats-tab').then(mod => mod.ManagerStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const ManagerAchievementsTab = dynamic(() => import('@/entities/user/ui/manager-profile-tabs/achievements-tab').then(mod => mod.ManagerAchievementsTab), {
  loading: () => <Card><Skeleton className="h-64 w-full" /></Card>,
  ssr: false,
});

type ManagerProfileProps = {
  user: typeof managerUser;
  achievements: typeof managerAchievements;
};

export function ManagerProfile({ user, achievements }: ManagerProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 bg-muted/40">
        <Image src="https://placehold.co/1200x400.png" alt="Profile Banner" fill className="object-cover" data-ai-hint="business cityscape" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
      <div className="relative p-6">
          <div className="flex items-end gap-6 -mt-20">
               <Avatar className="h-32 w-32 border-4 border-background bg-background">
                  <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="business manager" />
                  <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div className="space-y-1">
                          <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
                          <p className="text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                          <Button>Связаться</Button>
                      </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="bg-accent/80 text-accent-foreground">{user.role}</Badge>
                      <Badge variant="secondary">Агент команды</Badge>
                  </div>
              </div>
          </div>
      </div>
      <div className="border-t p-4 md:p-6">
        <Tabs defaultValue="stats">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">Статистика управления</TabsTrigger>
            <TabsTrigger value="achievements">Достижения менеджера</TabsTrigger>
          </TabsList>
          <TabsContent value="stats" className="mt-4">
            <ManagerStatsTab />
          </TabsContent>
          <TabsContent value="achievements" className="mt-4">
            <ManagerAchievementsTab achievements={achievements} />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
