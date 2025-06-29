'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { crmTournaments } from '@/shared/lib/mock-data/crm-tournaments';
import { notFound } from 'next/navigation';

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
            <Card>
                <CardHeader>
                    <CardTitle>Панель управления</CardTitle>
                    <CardDescription>В разработке...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
                        <p className="text-muted-foreground">Здесь будут все модули для управления турниром: сетка, участники, расписание и т.д.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
