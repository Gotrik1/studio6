
'use client';

import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import Link from 'next/link';
import { DynamicIcon } from '@/shared/ui/dynamic-icon';
import { icons } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Search } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Skeleton } from '@/shared/ui/skeleton';
import { useToast } from '@/shared/hooks/use-toast';
import { getSports } from '@/entities/sport/api/sports';
import type { Sport } from '@/entities/sport/model/types';

export function SportsListPage() {
    const [sports, setSports] = useState<Sport[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        async function loadSports() {
            setLoading(true);
            try {
                const data = await getSports();
                setSports(data);
            } catch (error) {
                console.error(error);
                toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить список видов спорта.' });
            } finally {
                setLoading(false);
            }
        }
        loadSports();
    }, [toast]);

    const filteredSports = useMemo(() => {
        return sports.filter(sport => sport.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [sports, searchQuery]);

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Виды спорта</h1>
                <p className="text-muted-foreground">
                    Найдите свою дисциплину, следите за турнирами и лучшими игроками.
                </p>
            </div>
            
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Поиск по названию дисциплины..."
                    className="w-full pl-10 md:w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredSports.map(sport => (
                        <Link key={sport.id} href={`/sports/${sport.id}`} className="block">
                            <Card className="flex flex-col items-center justify-center p-6 text-center h-full transition-all hover:shadow-lg hover:border-primary">
                                <DynamicIcon name={sport.icon as keyof typeof icons} className="h-10 w-10 text-primary mb-3" />
                                <CardHeader className="p-0">
                                    <CardTitle className="text-base">{sport.name}</CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
