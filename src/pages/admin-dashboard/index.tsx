'use client';

// UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Icons
import { Gavel, Users, ShieldCheck, DollarSign } from 'lucide-react';

// Mock data
import { reportsQueue } from '@/lib/mock-data/moderation';
import { userList } from '@/lib/mock-data/users';

// Other imports
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, YAxis, Tooltip } from "recharts";

const data = [
  { name: 'Янв', users: 400, revenue: 2400 },
  { name: 'Фев', users: 300, revenue: 1398 },
  { name: 'Мар', users: 500, revenue: 9800 },
  { name: 'Апр', users: 278, revenue: 3908 },
  { name: 'Май', users: 189, revenue: 4800 },
  { name: 'Июн', users: 239, revenue: 3800 },
  { name: 'Июл', users: 349, revenue: 4300 },
];

export function AdminDashboardPage() {
    const recentUsers = userList.slice(0, 5);
    const pendingReports = reportsQueue.slice(0, 3);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Панель администратора</h1>
                <p className="text-muted-foreground">Обзор ключевых метрик и активностей на платформе.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">10,234</div>
                        <p className="text-xs text-muted-foreground">+5% за последний месяц</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Активных жалоб</CardTitle>
                        <Gavel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reportsQueue.length}</div>
                        <p className="text-xs text-muted-foreground">+3 за последние 24 часа</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Безопасность</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.8%</div>
                        <p className="text-xs text-muted-foreground">Рейтинг безопасности аккаунтов</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Доход (мес.)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450</div>
                        <p className="text-xs text-muted-foreground">-2% по сравнению с прошлым месяцем</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Статистика роста</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Недавние жалобы</CardTitle>
                        <CardDescription>Последние жалобы, требующие внимания.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {pendingReports.map(report => (
                            <div key={report.id} className="flex items-center">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={report.reportedUser.avatar} data-ai-hint={report.reportedUser.avatarHint} />
                                    <AvatarFallback>{report.reportedUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Жалоба на {report.reportedUser.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">Причина: {report.reason}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}