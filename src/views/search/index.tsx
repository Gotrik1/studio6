'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { PlayerScout } from '@/widgets/player-scout';
import { PlaygroundFinder } from '@/widgets/playground-finder';
import { GlobalSearchWidget } from '@/widgets/global-search';
import { Search, UserSearch, MapPin } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export function SearchPage() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'global';

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Поисковый центр</h1>
                <p className="text-muted-foreground">
                    Ваш единый центр для поиска любой информации на платформе.
                </p>
            </div>

            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="global"><Search className="mr-2 h-4 w-4" />Общий поиск</TabsTrigger>
                    <TabsTrigger value="players"><UserSearch className="mr-2 h-4 w-4" />Поиск игроков</TabsTrigger>
                    <TabsTrigger value="playgrounds"><MapPin className="mr-2 h-4 w-4" />Поиск площадок</TabsTrigger>
                </TabsList>
                <TabsContent value="global" className="mt-6">
                    <GlobalSearchWidget />
                </TabsContent>
                <TabsContent value="players" className="mt-6">
                    <PlayerScout />
                </TabsContent>
                <TabsContent value="playgrounds" className="mt-6">
                    <PlaygroundFinder />
                </TabsContent>
            </Tabs>
        </div>
    );
}
