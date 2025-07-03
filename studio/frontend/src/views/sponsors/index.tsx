'use client';

import { SponsorScout } from '@/widgets/sponsor-scout';
import { SponsorshipDashboard } from '@/widgets/sponsorship-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { UserSearch, LayoutDashboard } from 'lucide-react';

export function SponsorsPage() {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Центр спонсорства</h1>
                <p className="text-muted-foreground">
                    Находите команды для сотрудничества и управляйте своими кампаниями.
                </p>
            </div>
            <Tabs defaultValue="scout">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="scout">
                        <UserSearch className="mr-2 h-4 w-4" />
                        AI-Скаут Команд
                    </TabsTrigger>
                    <TabsTrigger value="dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Панель управления
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="scout" className="mt-4">
                    <SponsorScout />
                </TabsContent>
                <TabsContent value="dashboard" className="mt-4">
                     <SponsorshipDashboard />
                </TabsContent>
            </Tabs>
        </div>
    );
}
