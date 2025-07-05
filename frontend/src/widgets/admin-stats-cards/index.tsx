'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Users, Trophy, Gavel, DollarSign } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { getAdminDashboardStats } from '@/entities/admin/api/dashboard';


const StatCard = ({ title, value, isLoading, icon: Icon }: { title: string; value: string; isLoading: boolean; icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{value}</div>}
        </CardContent>
    </Card>
);

export function AdminStatsCards() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeTournaments: 0,
        openTickets: 0,
        monthlyRevenue: '$0'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            const data = await getAdminDashboardStats();
            if (data) {
                setStats(data);
            }
            setIsLoading(false);
        };

        fetchStats();
    }, []);


    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Всего пользователей" value={String(stats.totalUsers)} isLoading={isLoading} icon={Users} />
            <StatCard title="Активные турниры" value={String(stats.activeTournaments)} isLoading={isLoading} icon={Trophy} />
            <StatCard title="Открытые жалобы" value={String(stats.openTickets)} isLoading={isLoading} icon={Gavel} />
            <StatCard title="Доход (месяц)" value={stats.monthlyRevenue} isLoading={isLoading} icon={DollarSign} />
        </div>
    );
}
