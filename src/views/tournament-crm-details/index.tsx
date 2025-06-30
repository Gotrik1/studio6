'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { crmTournaments } from '@/shared/lib/mock-data/crm-tournaments';
import { notFound } from 'next/navigation';
import { CrmTournamentOverview } from '@/widgets/crm-tournament-overview';
import { CrmTournamentParticipants } from '@/widgets/crm-tournament-participants';
import { TournamentBracket } from '@/widgets/tournament-bracket';
import { summerKickoffTournament } from '@/shared/lib/mock-data/tournament-details';
import { CrmTournamentMatches } from '@/widgets/crm-tournament-matches';
import { CrmTournamentJudges } from '@/widgets/crm-tournament-judges';
import { CrmTournamentSponsors } from '@/widgets/crm-tournament-sponsors';
import { CrmTournamentMedical } from '@/widgets/crm-tournament-medical';
import { CrmTournamentAnnouncements } from '@/widgets/crm-tournament-announcements';
import { CrmTournamentDisputes } from '@/widgets/crm-tournament-disputes';
import { CrmTournamentSettings } from '@/widgets/crm-tournament-settings';
import { useState } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { Save } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { CrmTournamentMediaCenter } from '@/widgets/crm-tournament-media-center';

interface TournamentCrmDetailsPageProps {
    tournamentId: string;
}

export function TournamentCrmDetailsPage({ tournamentId }: TournamentCrmDetailsPageProps) {
    const tournament = crmTournaments.find(t => t.id === tournamentId);
    const [rules, setRules] = useState(tournament?.rules || '');
    const { toast } = useToast();

    if (!tournament) {
        return notFound();
    }
    
    const handleSaveRules = () => {
        // In a real app, this would be an API call to update the tournament rules.
        console.log("Saving new rules:", rules);
        toast({
            title: "Правила сохранены!",
            description: "Правила турнира были успешно обновлены.",
        });
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление: {tournament.name}</h1>
                <p className="text-muted-foreground">
                    Полный контроль над вашим турниром.
                </p>
            </div>
            
            <Tabs defaultValue="overview">
                <ScrollArea className="w-full whitespace-nowrap rounded-md">
                    <TabsList className="inline-flex">
                        <TabsTrigger value="overview">Обзор</TabsTrigger>
                        <TabsTrigger value="participants">Участники</TabsTrigger>
                        <TabsTrigger value="rules">Правила</TabsTrigger>
                        <TabsTrigger value="judges">Судьи</TabsTrigger>
                        <TabsTrigger value="matches">Матчи</TabsTrigger>
                        <TabsTrigger value="disputes">Споры</TabsTrigger>
                        <TabsTrigger value="bracket">Сетка</TabsTrigger>
                        <TabsTrigger value="media-center">Медиа-центр</TabsTrigger>
                        <TabsTrigger value="sponsors">Спонсоры</TabsTrigger>
                        <TabsTrigger value="medical">Мед. поддержка</TabsTrigger>
                        <TabsTrigger value="announcements">Рассылки</TabsTrigger>
                        <TabsTrigger value="settings">Настройки</TabsTrigger>
                    </TabsList>
                </ScrollArea>
                
                <TabsContent value="overview" className="mt-4">
                    <CrmTournamentOverview tournament={tournament} />
                </TabsContent>
                
                <TabsContent value="participants" className="mt-4">
                    <CrmTournamentParticipants />
                </TabsContent>

                <TabsContent value="rules" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Редактирование правил турнира</CardTitle>
                            <CardDescription>Здесь вы можете подробно описать все правила и условия проведения турнира. Используйте Markdown для форматирования, если необходимо.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={rules}
                                onChange={(e) => setRules(e.target.value)}
                                className="min-h-[400px] font-mono"
                                placeholder="Введите правила турнира..."
                            />
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveRules}>
                                <Save className="mr-2 h-4 w-4" />
                                Сохранить правила
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="judges" className="mt-4">
                    <CrmTournamentJudges />
                </TabsContent>

                <TabsContent value="matches" className="mt-4">
                    <CrmTournamentMatches />
                </TabsContent>

                <TabsContent value="disputes" className="mt-4">
                    <CrmTournamentDisputes />
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

                <TabsContent value="media-center" className="mt-4">
                    <CrmTournamentMediaCenter tournament={tournament} />
                </TabsContent>

                <TabsContent value="sponsors" className="mt-4">
                    <CrmTournamentSponsors />
                </TabsContent>

                <TabsContent value="medical" className="mt-4">
                    <CrmTournamentMedical />
                </TabsContent>
                
                <TabsContent value="announcements" className="mt-4">
                    <CrmTournamentAnnouncements />
                </TabsContent>
                
                <TabsContent value="settings" className="mt-4">
                    <CrmTournamentSettings tournament={tournament} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
