
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { crmTournaments } from '@/shared/lib/mock-data/crm-tournaments';
import { notFound } from 'next/navigation';
import { CrmTournamentOverview } from '@/widgets/crm-tournament-overview';
import { CrmTournamentParticipants } from '@/widgets/crm-tournament-participants';
import { TournamentBracket } from '@/widgets/tournament-bracket';
import { summerKickoffTournament } from '@/shared/lib/mock-data/tournament-details';

interface TournamentCrmDetailsPageProps {
    tournamentId: string;
}

export function TournamentCrmDetailsPage({ tournamentId }: TournamentCrmDetailsPageProps) {
    const tournament = crmTournaments.find(t => t.id === tournamentId);

    if (!tournament) {
        return notFound();
    }
    
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление: {tournament.name}</h1>
                <p className="text-muted-foreground">
                    Полный контроль над вашим турниром.
                </p>
            </div>
            
            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Обзор</TabsTrigger>
                    <TabsTrigger value="participants">Участники</TabsTrigger>
                    <TabsTrigger value="bracket">Сетка</TabsTrigger>
                    <TabsTrigger value="settings">Настройки</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4">
                    <CrmTournamentOverview tournament={tournament} />
                </TabsContent>
                
                <TabsContent value="participants" className="mt-4">
                    <CrmTournamentParticipants />
                </TabsContent>

                <TabsContent value="bracket" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Сетка турнира</CardTitle>
                            <CardDescription>Визуальное представление турнирной сетки. Функции редактирования будут добавлены в будущем.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TournamentBracket rounds={summerKickoffTournament.bracket.rounds} />
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Настройки турнира</CardTitle>
                            <CardDescription>В разработке...</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
                                <p className="text-muted-foreground">Здесь будет форма для редактирования данных турнира.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
