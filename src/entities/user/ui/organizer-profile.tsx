'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { organizerUser, organizerAchievements } from "@/shared/lib/mock-data/organizer-profile";
import { Skeleton } from '@/shared/ui/skeleton';
import Link from 'next/link';

const OrganizerStatsTab = dynamic(() => import('@/entities/user/ui/organizer-profile-tabs/stats-tab').then(mod => mod.OrganizerStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const OrganizerAchievementsTab = dynamic(() => import('@/entities/user/ui/organizer-profile-tabs/achievements-tab').then(mod => mod.OrganizerAchievementsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});

type OrganizerProfileProps = {
  user: typeof organizerUser;
  achievements: typeof organizerAchievements;
};

export function OrganizerProfile({ user, achievements }: OrganizerProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative h-40 bg-muted/40">
          <Image src="https://placehold.co/1200x400.png" alt="Profile Banner" fill className="object-cover" data-ai-hint="event stage lights" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative p-6">
            <div className="flex items-end gap-6 -mt-20">
                 <Avatar className="h-32 w-32 border-4 border-background bg-background">
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="event management logo" />
                    <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-1">
                            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild>
                                <Link href="/tournaments/new">Создать турнир</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="destructive">{user.role}</Badge>
                        <Badge variant="secondary">Организатор событий</Badge>
                    </div>
                </div>
            </div>
        </div>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика событий</TabsTrigger>
          <TabsTrigger value="achievements">Достижения организатора</TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="mt-4">
          <OrganizerStatsTab />
        </TabsContent>
        <TabsContent value="achievements" className="mt-4">
          <OrganizerAchievementsTab achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
