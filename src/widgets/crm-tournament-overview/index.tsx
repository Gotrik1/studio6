
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Users, Trophy, Calendar, PlayCircle, Lock, Edit } from 'lucide-react';
import type { TournamentCrm } from '@/shared/lib/mock-data/crm-tournaments';

interface CrmTournamentOverviewProps {
    tournament: TournamentCrm;
}

export function CrmTournamentOverview({ tournament }: CrmTournamentOverviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Участники</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{tournament.participants} / {tournament.maxParticipants}</div>
                    <p className="text-xs text-muted-foreground">зарегистрировано</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Статус</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{tournament.status}</div>
                     <p className="text-xs text-muted-foreground">Текущий этап турнира</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Дата начала</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{tournament.startDate}</div>
                    <p className="text-xs text-muted-foreground">Начало группового этапа</p>
                </CardContent>
            </Card>
            <Card className="md:col-span-full">
                <CardHeader>
                    <CardTitle>Быстрые действия</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button><PlayCircle className="mr-2 h-4 w-4" />Начать следующий этап</Button>
                    <Button variant="outline"><Lock className="mr-2 h-4 w-4" />Завершить регистрацию</Button>
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Редактировать информацию</Button>
                </CardContent>
            </Card>
        </div>
    );
}
