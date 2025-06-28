'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Newspaper, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { generatePlatformNews, type GeneratePlatformNewsOutput } from '@/ai/flows/generate-platform-news-flow';
import { Skeleton } from '@/components/ui/skeleton';

const upcomingMatches = [
    { id: 'match-1', team1: 'Кибер Орлы', team2: 'Стальные Титаны', time: 'Завтра, 19:00', href:'#' },
    { id: 'match-2', team1: 'Призрачные Волки', team2: 'Теневые Коты', time: '28.09, 21:00', href:'#' },
];

type FeedItem = GeneratePlatformNewsOutput['news'][0];

const getIconForCategory = (category: FeedItem['category']) => {
    switch(category) {
        case 'match': return Trophy;
        case 'team': return Users;
        case 'player': return Users; // Could be a different icon
        case 'platform': return Newspaper;
        default: return Newspaper;
    }
}

export default function DashboardPage() {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            try {
                const result = await generatePlatformNews();
                setFeedItems(result.news);
            } catch (error) {
                console.error("Failed to fetch AI news:", error);
                // Fallback to static data on error
                setFeedItems([
                  { title: 'Не удалось загрузить новости', summary: 'Пожалуйста, попробуйте обновить страницу.', category: 'platform', href: '#' },
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);


    return (
        <div className="grid grid-cols-12 gap-6">
            <main className="col-span-12 lg:col-span-8 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Лента активности</CardTitle>
                        <CardDescription>Последние события на платформе, сгенерированные AI.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ) : (
                            feedItems.map((item, index) => {
                                const Icon = getIconForCategory(item.category);
                                return (
                                    <div key={index} className="flex items-center space-x-4 p-4 border-b last:border-b-0">
                                        <Icon className="h-6 w-6 text-muted-foreground" />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">{item.summary}</p>
                                        </div>
                                        <Button variant="outline" size="sm" asChild><Link href={item.href}>Подробнее</Link></Button>
                                    </div>
                                )
                            })
                        )}
                    </CardContent>
                </Card>
            </main>

            <aside className="col-span-12 lg:col-span-4 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ближайшие матчи</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                {upcomingMatches.map(match => (
                                    <TableRow key={match.id}>
                                        <TableCell>
                                            <p className="font-semibold">{match.team1} vs {match.team2}</p>
                                            <p className="text-xs text-muted-foreground">{match.time}</p>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild><Link href={match.href}>К матчу</Link></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </aside>
        </div>
    );
}
