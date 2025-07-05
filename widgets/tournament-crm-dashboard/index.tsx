
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Progress } from '@/shared/ui/progress';
import { PlusCircle, Search, Trophy, Users, DollarSign, ClipboardCheck } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { fetchCrmTournaments } from '@/entities/tournament/api/get-tournaments';
import type { TournamentCrm } from '@/entities/user/model/types';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';

const StatCard = ({ title, value, description, icon: Icon }: { title: string, value: string, description?: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);


export function TournamentCrmDashboard() {
    const [tournaments, setTournaments] = useState<TournamentCrm[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Все');
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const data = await fetchCrmTournaments();
            if (data) {
                setTournaments(data);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: 'Не удалось загрузить список турниров.'
                });
            }
            setIsLoading(false);
        }
        loadData();
    }, [toast]);

    const filteredTournaments = useMemo(() => {
        return tournaments.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.sport.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'Все' || t.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tournaments, searchQuery, statusFilter]);
    
    const getStatusVariant = (status: TournamentCrm['status']) => {
        switch (status) {
            case 'ONGOING': return 'destructive';
            case 'REGISTRATION': return 'default';
            case 'FINISHED': return 'secondary';
            default: return 'outline';
        }
    };
     const getStatusText = (status: TournamentCrm['status']) => {
        switch (status) {
            case 'ONGOING': return 'В процессе';
            case 'REGISTRATION': return 'Открыт набор';
            case 'FINISHED': return 'Завершён';
            default: return 'Архив';
        }
    }

    const activeTournaments = tournaments.filter(t => t.status === 'ONGOING' || t.status === 'REGISTRATION').length;
    const totalParticipants = tournaments.reduce((sum, t) => sum + t.participants, 0);

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Панель управления турнирами</h1>
                    <p className="text-muted-foreground">Создавайте, редактируйте и управляйте всеми вашими турнирами.</p>
                </div>
                <Button asChild>
                    <Link href="/administration/tournament-crm/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Создать турнир
                    </Link>
                </Button>
            </div>
            
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Активные турниры" value={String(activeTournaments)} icon={Trophy} />
                <StatCard title="Всего участников" value={totalParticipants.toLocaleString('ru-RU')} icon={Users} />
                <StatCard title="Общий призовой фонд" value="$135,000" description="Сумма по всем турнирам" icon={DollarSign} />
                <StatCard title="Требуют внимания" value="1" description="Турниры со спорными матчами" icon={ClipboardCheck} />
            </div>

            <Card>
                 <CardHeader>
                    <CardTitle>Список турниров</CardTitle>
                    <CardDescription>
                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Поиск по названию или виду спорта..."
                                    className="w-full pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Все">Все статусы</SelectItem>
                                    <SelectItem value="REGISTRATION">Открыт набор</SelectItem>
                                    <SelectItem value="ONGOING">В процессе</SelectItem>
                                    <SelectItem value="FINISHED">Завершён</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Название турнира</TableHead>
                                    <TableHead className="hidden md:table-cell">Статус</TableHead>
                                    <TableHead className="hidden lg:table-cell">Участники</TableHead>
                                    <TableHead className="hidden md:table-cell">Дата начала</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTournaments.map((tournament) => (
                                    <TableRow key={tournament.id}>
                                        <TableCell>
                                            <div className="font-medium">{tournament.name}</div>
                                            <div className="text-sm text-muted-foreground">{tournament.sport}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge variant={getStatusVariant(tournament.status as any)}>{getStatusText(tournament.status as any)}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex flex-col">
                                                <span>{tournament.participants} / {tournament.maxParticipants}</span>
                                                <Progress value={(tournament.participants / tournament.maxParticipants) * 100} className="h-1.5 mt-1" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {format(new Date(tournament.startDate), 'd MMMM yyyy', { locale: ru })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/administration/tournament-crm/${tournament.id}`}>Управлять</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
