
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Users, Trophy, Gavel, DollarSign } from 'lucide-react';
import { userList } from '@/shared/lib/mock-data/users';
import { allTournaments } from '@/shared/lib/mock-data/tournaments';
import { reportsQueue } from '@/shared/lib/mock-data/moderation';

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);


export function AdminStatsCards() {
    const totalUsers = userList.length;
    const activeTournaments = allTournaments.filter(t => t.status === 'Идет' || t.status === 'Регистрация').length;
    const openTickets = reportsQueue.length;
    const monthlyRevenue = '$5,230'; // Mock data

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Всего пользователей" value={String(totalUsers)} icon={Users} />
            <StatCard title="Активные турниры" value={String(activeTournaments)} icon={Trophy} />
            <StatCard title="Открытые жалобы" value={String(openTickets)} icon={Gavel} />
            <StatCard title="Доход (месяц)" value={monthlyRevenue} icon={DollarSign} />
        </div>
    );
}
