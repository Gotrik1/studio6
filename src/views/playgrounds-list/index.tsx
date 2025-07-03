
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/shared/ui/button';
import { PlusCircle, Map } from 'lucide-react';
import { playgroundsList } from '@/shared/lib/mock-data/playgrounds';
import { PlaygroundCard } from '@/widgets/playground-card';
import Link from 'next/link';
import { Input } from '@/shared/ui/input';
import { Search } from 'lucide-react';
import { Card, CardHeader } from '@/shared/ui/card';
import { getKingOfTheCourt } from '@/shared/lib/get-king-of-the-court';

const sportTypes = ['Все', 'Футбол', 'Баскетбол', 'Стритбол', 'Воркаут', 'Универсальная', 'Фитнес-зал', 'Бассейн', 'Теннисный корт', 'Лыжная трасса', 'Биатлонный комплекс', 'Каток', 'Сноуборд-парк', 'Горнолыжный склон', 'Стрельбище'];

export function PlaygroundsListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sportFilter, setSportFilter] = useState('Все');

    const livePlaygrounds = useMemo(() => new Set(['playground-2']), []);

    const filteredPlaygrounds = useMemo(() => {
        return playgroundsList.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.address.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSport = sportFilter === 'Все' || p.type === sportFilter;
            return matchesSearch && matchesSport;
        });
    }, [searchQuery, sportFilter]);

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Map className="h-8 w-8 text-primary"/>
                        Места для тренировок
                    </h1>
                    <p className="text-muted-foreground">
                        Найдите или добавьте свое любимое место для игр и тренировок.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/playgrounds/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить место
                    </Link>
                </Button>
            </div>
            
            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Поиск по названию или адресу..."
                            className="w-full pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sportTypes.map((type) => (
                            <Button 
                                key={type} 
                                variant={sportFilter === type ? "default" : "outline"}
                                onClick={() => setSportFilter(type)}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaygrounds.map(playground => {
                    const kingTeam = getKingOfTheCourt(playground.id);
                    const isLive = livePlaygrounds.has(playground.id);
                    return (
                         <PlaygroundCard 
                            key={playground.id} 
                            playground={playground}
                            kingTeam={kingTeam}
                            isLive={isLive}
                        />
                    )
                })}
            </div>
             {filteredPlaygrounds.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                    <p>Места не найдены. Попробуйте изменить фильтры.</p>
                </div>
            )}
        </div>
    );
}
