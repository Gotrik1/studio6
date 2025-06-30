'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { fanUser, fanAchievements } from "@/shared/lib/mock-data/fan-profile";
import { Skeleton } from '@/shared/ui/skeleton';

const FanStatsTab = dynamic(() => import('@/entities/user/ui/fan-profile-tabs/stats-tab').then(mod => mod.FanStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const FanAchievementsTab = dynamic(() => import('@/entities/user/ui/fan-profile-tabs/achievements-tab').then(mod => mod.FanAchievementsTab), {
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
      <Card className="overflow-hidden">
        <div className="relative h-40 bg-muted/40">
          <Image src="https://placehold.co/1200x400.png" alt="Profile Banner" fill className="object-cover" data-ai-hint="stadium crowd cheering" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative px-6 pb-6">
            <div className="flex items-end gap-6 -mt-20">
                 <Avatar className="h-32 w-32 border-4 border-background bg-background">
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="sports fan" />
                    <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
                    <div className="space-y-1">
                        <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                     <div className="flex gap-2">
                        <Button variant="outline">Подписаться</Button>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge>{user.role}</Badge>
                <Badge variant="secondary">Фанат #1 Cyber Eagles</Badge>
            </div>
        </div>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика болельщика</TabsTrigger>
          <TabsTrigger value="achievements">Достижения болельщика</TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="mt-4">
          <FanStatsTab />
        </TabsContent>
        <TabsContent value="achievements" className="mt-4">
          <FanAchievementsTab achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
