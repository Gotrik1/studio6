
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { fanUser, fanAchievements } from "@/shared/lib/mock-data/fan-profile";
import { Skeleton } from '@/shared/ui/skeleton';
import { teams as mockTeams } from '@/shared/lib/mock-data/teams';
import { Wand2 } from 'lucide-react';
import { UserAvatarGeneratorDialog } from '@/features/user-avatar-generator';


const FanStatsTab = dynamic(() => import('@/entities/user/ui/fan-profile-tabs/stats-tab').then(mod => mod.FanStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const FanAchievementsTab = dynamic(() => import('@/entities/user/ui/fan-profile-tabs/achievements-tab').then(mod => mod.FanAchievementsTab), {
  loading: () => <Card><Skeleton className="h-64 w-full" /></Card>,
  ssr: false,
});
const FavoriteTeamsTab = dynamic(() => import('@/entities/user/ui/fan-profile-tabs/favorite-teams-tab').then(mod => mod.FavoriteTeamsTab), {
    loading: () => <Card><Skeleton className="h-64 w-full" /></Card>,
    ssr: false,
});


type FanProfileProps = {
  user: typeof fanUser;
  achievements: typeof fanAchievements;
};

export function FanProfile({ user, achievements }: FanProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');
  const [avatar, setAvatar] = useState(user.avatar);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const favoriteTeams = mockTeams.slice(0, 2); // Mock some favorite teams


  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative h-40 bg-muted/40">
          <Image src="https://placehold.co/1200x400.png" alt="Profile Banner" fill className="object-cover" data-ai-hint="stadium crowd cheering" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative p-6">
            <div className="flex items-end gap-6 -mt-20">
               <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background bg-background">
                      <AvatarImage src={avatar} alt={user.name} data-ai-hint="sports fan" />
                      <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                  </Avatar>
                   <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                        onClick={() => setIsAvatarDialogOpen(true)}
                        title="Сгенерировать AI-аватар"
                    >
                        <Wand2 className="h-4 w-4" />
                        <span className="sr-only">Сгенерировать AI-аватар</span>
                    </Button>
                </div>
              <div className="flex-1 space-y-2">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div className="space-y-1">
                          <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
                          <p className="text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                          <Button variant="outline">Подписаться</Button>
                      </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                      <Badge>{user.role}</Badge>
                      <Badge variant="secondary">Фанат #1 Cyber Eagles</Badge>
                  </div>
              </div>
            </div>
        </div>
        <div className="border-t p-4 md:p-6">
          <Tabs defaultValue="stats">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Статистика</TabsTrigger>
              <TabsTrigger value="achievements">Достижения</TabsTrigger>
              <TabsTrigger value="favorite-teams">Любимые команды</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="mt-4">
              <FanStatsTab />
            </TabsContent>
            <TabsContent value="achievements" className="mt-4">
              <FanAchievementsTab achievements={achievements} />
            </TabsContent>
            <TabsContent value="favorite-teams" className="mt-4">
                <FavoriteTeamsTab teams={favoriteTeams} userName={user.name} />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
      <UserAvatarGeneratorDialog
        isOpen={isAvatarDialogOpen}
        onOpenChange={setIsAvatarDialogOpen}
        currentAvatar={avatar}
        onAvatarSave={setAvatar}
      />
    </>
  );
}
