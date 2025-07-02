
'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { sponsorUser, sponsorAchievements } from "@/shared/lib/mock-data/sponsor-profile";
import { Skeleton } from '@/shared/ui/skeleton';
import Link from 'next/link';
import { useState } from 'react';
import { Wand2, ImageIcon } from 'lucide-react';
import { UserAvatarGeneratorDialog } from '@/features/user-avatar-generator';
import { ProfileBannerGeneratorDialog } from '@/features/profile-banner-generator';

const SponsorStatsTab = dynamic(() => import('@/entities/user/ui/sponsor-profile-tabs/stats-tab').then(mod => mod.SponsorStatsTab), {
  loading: () => <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>,
  ssr: false,
});
const SponsorAchievementsTab = dynamic(() => import('@/entities/user/ui/sponsor-profile-tabs/achievements-tab').then(mod => mod.SponsorAchievementsTab), {
  loading: () => <Card><Skeleton className="h-64 w-full" /></Card>,
  ssr: false,
});

type SponsorProfileProps = {
  user: typeof sponsorUser;
  achievements: typeof sponsorAchievements;
};

export function SponsorProfile({ user, achievements }: SponsorProfileProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('');
  const [avatar, setAvatar] = useState(user.avatar);
  const [banner, setBanner] = useState('https://placehold.co/1280x360.png');
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-muted/40">
          <Image src={banner} alt="Profile Banner" fill className="object-cover" data-ai-hint="corporate building" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
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
        </div>
        <div className="relative p-6">
            <div className="flex items-end gap-6 -mt-20">
                <div className="relative shrink-0">
                    <Avatar className="h-32 w-32 border-4 border-background bg-background">
                        <AvatarImage src={avatar} alt={user.name} data-ai-hint="corporate logo" />
                        <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                    </Avatar>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-1 right-1 rounded-full h-8 w-8 bg-background"
                        onClick={() => setIsAvatarDialogOpen(true)}
                        title="Изменить аватар"
                    >
                        <Wand2 className="h-4 w-4" />
                        <span className="sr-only">Изменить аватар</span>
                    </Button>
                 </div>
                <div className="flex-1 space-y-2">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-1">
                            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                             <Link href="/settings"><Button>Редактировать</Button></Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{user.role}</Badge>
                        <Badge variant="outline">Официальный партнер</Badge>
                    </div>
                </div>
            </div>
        </div>
        <div className="border-t p-4 md:p-6">
          <Tabs defaultValue="stats">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stats">ROI спонсорства</TabsTrigger>
              <TabsTrigger value="achievements">Вехи спонсора</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="mt-4">
              <SponsorStatsTab />
            </TabsContent>
            <TabsContent value="achievements" className="mt-4">
              <SponsorAchievementsTab achievements={achievements} />
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
            defaultPrompt={`corporate building background`}
        />
    </>
  );
}
