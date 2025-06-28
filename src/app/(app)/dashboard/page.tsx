'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Newspaper, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

// Mock data - in a real app, this would come from an API
const feedItems = [
  { id: 1, type: 'match', title: 'Кибер Орлы одержали победу над Ледяными Драконами!', time: '2 часа назад', icon: Trophy, href: '/matches/cyber-eagles-vs-ice-dragons' },
  { id: 2, type: 'team', title: 'Команда "Вихревые Гадюки" ищет нового игрока', time: '5 часов назад', icon: Users, href: '/teams' },
  { id: 3, type: 'news', title: 'Обновление платформы: новые функции в профиле', time: '1 день назад', icon: Newspaper, href: '#' },
];
const upcomingMatches = [
    { id: 'match-1', team1: 'Кибер Орлы', team2: 'Стальные Титаны', time: 'Завтра, 19:00', href:'#' },
    { id: 'match-2', team1: 'Призрачные Волки', team2: 'Теневые Коты', time: '28.09, 21:00', href:'#' },
];

export default function DashboardPage() {
    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Main content */}
            <main className="col-span-12 lg:col-span-8 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Лента активности</CardTitle>
                        <CardDescription>Последние события на платформе.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {feedItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-4 p-4 border-b last:border-b-0">
                                <item.icon className="h-6 w-6 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.time}</p>
                                </div>
                                <Button variant="outline" size="sm" asChild><Link href={item.href}>Подробнее</Link></Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </main>

            {/* Sidebar */}
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
