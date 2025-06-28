'use client';

import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { sponsorUser, sponsorAchievements } from "@/lib/mock-data/sponsor-profile";
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';

const SponsorStatsTab = dynamic(() => import('@/components/sponsor-profile-tabs/stats-tab').then(mod => mod.SponsorStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const SponsorAchievementsTab = dynamic(() => import('@/components/sponsor-profile-tabs/achievements-tab').then(mod => mod.SponsorAchievementsTab), {
  loading: () => <Card><CardContent><Skeleton className="h-64 w-full mt-6" /></CardContent></Card>,
  ssr: false,
});

type SponsorProfileProps = {
  user: typeof sponsorUser;
  achievements: typeof sponsorAchievements;
};

export function SponsorProfile({ user, achievements }: SponsorProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="h-24 w-24 border-4 border-secondary">
            <AvatarImage src={'https://placehold.co/100x100.png'} alt={user.name} data-ai-hint="corporate logo" />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex justify-center gap-2 pt-2 sm:justify-start">
              <Badge variant="secondary">{user.role}</Badge>
              <Badge variant="outline">Официальный партнер</Badge>
            </div>
          </div>
          <Button asChild>
            <Link href="/sponsorship/management">Управление кампаниями</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground sm:text-left">Ведущий спонсор киберспортивных и игровых инициатив.</p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">ROI спонсорства</TabsTrigger>
          <TabsTrigger value="achievements">Вехи спонсора</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <SponsorStatsTab />
        </TabsContent>
        <TabsContent value="achievements">
          <SponsorAchievementsTab achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
