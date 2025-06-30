
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import type { fanUser, fanAchievements } from "@/shared/lib/mock-data/fan-profile";
import { Skeleton } from '@/shared/ui/skeleton';
import { teams as mockTeams } from '@/shared/lib/mock-data/teams';
import { Wand2, Coins, DollarSign, Calendar } from 'lucide-react';
import { UserAvatarGeneratorDialog } from '@/features/user-avatar-generator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { pdHistory } from "@/shared/lib/mock-data/gamification";
import { PD_SOURCE_DETAILS, type PD_SOURCE_TYPE } from '@/shared/config/gamification';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/shared/lib/utils';


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

  const totalEarned = pdHistory.filter(item => item.value > 0).reduce((sum, item) => sum + item.value, 0);
  const totalSpent = pdHistory.filter(item => item.value < 0).reduce((sum, item) => sum + item.value, 0);
  const totalPd = totalEarned + totalSpent;


  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative p-6 -mt-20">
          <div className="flex items-end gap-6">
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stats">Статистика</TabsTrigger>
              <TabsTrigger value="achievements">Достижения</TabsTrigger>
              <TabsTrigger value="favorite-teams">Любимые команды</TabsTrigger>
              <TabsTrigger value="pd-wallet">PD Кошелек</TabsTrigger>
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
            <TabsContent value="pd-wallet" className="mt-4">
              <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Текущий баланс</CardTitle>
                              <Coins className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                              <div className="text-2xl font-bold">{totalPd.toLocaleString('ru-RU')} PD</div>
                          </CardContent>
                      </Card>
                       <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium text-green-500">Всего заработано</CardTitle>
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                              <div className="text-2xl font-bold">{totalEarned.toLocaleString('ru-RU')} PD</div>
                          </CardContent>
                      </Card>
                       <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium text-red-500">Всего потрачено</CardTitle>
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                              <div className="text-2xl font-bold">{Math.abs(totalSpent).toLocaleString('ru-RU')} PD</div>
                          </CardContent>
                      </Card>
                  </div>

                  <Card>
                      <CardHeader>
                          <CardTitle>История транзакций</CardTitle>
                          <CardDescription>Здесь отображаются все ваши операции с PD.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Дата</TableHead>
                                      <TableHead>Источник</TableHead>
                                      <TableHead className="text-right">Сумма</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {pdHistory.map((tx) => (
                                      <TableRow key={tx.id}>
                                          <TableCell>
                                              <div className="flex items-center gap-2">
                                                  <Calendar className="h-4 w-4 text-muted-foreground"/>
                                                  <span>{format(new Date(tx.timestamp), "d MMMM yyyy, HH:mm", { locale: ru })}</span>
                                              </div>
                                          </TableCell>
                                          <TableCell>{PD_SOURCE_DETAILS[tx.source as PD_SOURCE_TYPE]?.description || tx.source}</TableCell>
                                          <TableCell className={cn("text-right font-medium", tx.value > 0 ? 'text-green-500' : 'text-red-500')}>
                                            {tx.value > 0 ? '+' : ''}{tx.value.toLocaleString('ru-RU')} PD
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </CardContent>
                  </Card>
              </div>
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
