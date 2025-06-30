'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { matchesList } from '@/shared/lib/mock-data/matches';
import { useState } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export function MatchPredictionWidget() {
    const { toast } = useToast();
    const upcomingMatches = matchesList.filter(m => m.status === 'Предстоящий').slice(0, 3);
    const [predictions, setPredictions] = useState<Record<string, 'team1' | 'team2'>>({});

    const handlePredict = (matchId: string, team: 'team1' | 'team2') => {
        setPredictions(prev => ({ ...prev, [matchId]: team }));
        toast({
            title: 'Прогноз принят!',
            description: 'Ваш прогноз на матч сохранен. Удачи!',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Сделайте свой прогноз</CardTitle>
                <CardDescription>Угадайте победителей предстоящих матчей и заработайте очки!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {upcomingMatches.map(match => (
                    <div key={match.id} className="space-y-2 rounded-lg border p-4">
                        <p className="text-sm text-center text-muted-foreground">{match.tournament} - {match.date}</p>
                        <div className="flex items-center justify-between gap-2">
                             <Button 
                                variant={predictions[match.id] === 'team1' ? 'default' : 'outline'}
                                className="flex-1 justify-start h-12"
                                onClick={() => handlePredict(match.id, 'team1')}
                                disabled={!!predictions[match.id]}
                            >
                                <Image src={match.team1.logo} alt={match.team1.name} width={32} height={32} className="rounded-full mr-2" data-ai-hint={match.team1.logoHint || ''}/>
                                <span className="font-semibold">{match.team1.name}</span>
                                {predictions[match.id] === 'team1' && <CheckCircle className="ml-auto h-5 w-5"/>}
                            </Button>
                             <Button 
                                variant={predictions[match.id] === 'team2' ? 'default' : 'outline'}
                                className="flex-1 justify-end h-12"
                                onClick={() => handlePredict(match.id, 'team2')}
                                disabled={!!predictions[match.id]}
                            >
                                {predictions[match.id] === 'team2' && <CheckCircle className="mr-auto h-5 w-5"/>}
                                <span className="font-semibold">{match.team2.name}</span>
                                 <Image src={match.team2.logo} alt={match.team2.name} width={32} height={32} className="rounded-full ml-2" data-ai-hint={match.team2.logoHint || ''}/>
                            </Button>
                        </div>
                    </div>
                ))}
                {upcomingMatches.length === 0 && (
                     <p className="text-center text-muted-foreground py-4">Нет предстоящих матчей для прогноза.</p>
                )}
            </CardContent>
        </Card>
    );
}
