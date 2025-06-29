'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
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
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-destructive">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="event management logo" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="destructive">{user.role}</Badge>
              <Badge variant="secondary">Организатор событий</Badge>
            </div>
          </div>
          <Button asChild>
            <Link href="/tournaments/new">Создать турнир</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Ведущие организаторы турниров и событий в онлайн-гейминге.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Статистика событий</TabsTrigger>
          <TabsTrigger value="achievements">Достижения организатора</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <OrganizerStatsTab />
        </TabsContent>
        <TabsContent value="achievements">
          <OrganizerAchievementsTab achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
