
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/shared/ui/button';
import { PlusCircle, Map } from 'lucide-react';
import { playgroundsList } from '@/shared/lib/mock-data/playgrounds';
import { PlaygroundCard } from '@/widgets/playground-card';
import Link from 'next/link';
import { PlaygroundFinder } from '@/widgets/playground-finder';

export function PlaygroundsListPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPlaygrounds = useMemo(() => {
        return playgroundsList.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Map className="h-8 w-8 text-primary"/>
                        Площадки
                    </h1>
                    <p className="text-muted-foreground">
                        Найдите или добавьте свою любимую площадку для игр и тренировок.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/playgrounds/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить площадку
                    </Link>
                </Button>
            </div>
            
            <PlaygroundFinder />
            
            <div className="space-y-4 pt-6 mt-6 border-t">
                 <h2 className="font-headline text-2xl font-bold">Все площадки</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playgroundsList.map(playground => (
                        <PlaygroundCard key={playground.id} playground={playground} />
                    ))}
                </div>
            </div>
        </div>
    );
}
