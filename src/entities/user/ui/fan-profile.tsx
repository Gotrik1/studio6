
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { Skeleton } from '@/shared/ui/skeleton';
import { Wand2, ImageIcon } from 'lucide-react';
import { UserAvatarGeneratorDialog } from '@/features/user-avatar-generator';
import type { fanUser, fanAchievements } from "@/shared/lib/mock-data/fan-profile";
import type { Team } from '@/entities/team/model/types';
import Image from "next/image";
import Link from 'next/link';
import { ProfileBannerGeneratorDialog } from '@/features/profile-banner-generator';


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
  favoriteTeams: Team[];
  isCurrentUser: boolean;
};

export function FanProfile({ user, achievements, favoriteTeams, isCurrentUser }: FanProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');
  const [avatar, setAvatar] = useState(user.avatar);
  const [banner, setBanner] = useState('https://placehold.co/1200x400.png');
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-muted/40">
            <Image src={banner} alt="Profile Banner" fill className="object-cover" data-ai-hint="stadium crowd cheering" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            {isCurrentUser && (
                <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 rounded-full h-8 w-8 bg-background/50 backdrop-blur-sm"
                onClick={() => setIsBannerDialogOpen(true)}
                title="Сгенерировать фон"
                >
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">Сгенерировать фон</span>
                </Button>
            )}
        </div>
        <div className="relative p-6">
          <div className="flex flex-col items-center gap-6 -mt-24 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="relative shrink-0">
                <Avatar className="h-32 w-32 border-4 border-background bg-background shadow-lg">
                    <AvatarImage src={avatar} alt={user.name} data-ai-hint="sports fan" />
                    <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                </Avatar>
                 {isCurrentUser && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-1 right-1 rounded-full h-8 w-8 bg-background"
                        onClick={() => setIsAvatarDialogOpen(true)}
                        title="Сгенерировать AI-аватар"
                    >
                        <Wand2 className="h-4 w-4" />
                        <span className="sr-only">Сгенерировать AI-аватар</span>
                    </Button>
                 )}
              </div>
            <div className="flex-1 w-full space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                    <div className="space-y-1">
                        <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex gap-2 justify-center sm:justify-end">
                       {isCurrentUser ? (
                           <Link href="/settings">
                               <Button>Редактировать</Button>
                           </Link>
                       ) : (
                           <Button variant="outline">Подписаться</Button>
                       )}
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Badge>{user.role}</Badge>
                    <Badge variant="secondary">Фанат #1 Cyber Eagles</Badge>
                </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t md:p-6">
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
      <ProfileBannerGeneratorDialog
            isOpen={isBannerDialogOpen}
            onOpenChange={setIsBannerDialogOpen}
            currentBanner={banner}
            onBannerSave={setBanner}
            defaultPrompt={`stadium with cheering crowd`}
        />
    </>
  );
}
