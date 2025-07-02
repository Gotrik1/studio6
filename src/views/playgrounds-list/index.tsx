
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/shared/ui/input';
import { Search, PlusCircle, Map } from 'lucide-react';
import { playgroundsList } from '@/shared/lib/mock-data/playgrounds';
import { PlaygroundCard } from '@/widgets/playground-card';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

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
                        Карта площадок
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
            
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Поиск по названию или адресу..."
                    className="w-full pl-10 md:w-1/2 lg:w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaygrounds.map(playground => (
                    <PlaygroundCard key={playground.id} playground={playground} />
                ))}
            </div>
        </div>
    );
}
