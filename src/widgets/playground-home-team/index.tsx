'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Crown, Sword } from 'lucide-react';
import { matchesList } from '@/shared/lib/mock-data/matches';
import { teams } from '@/shared/lib/mock-data/teams';
import Link from 'next/link';

interface KingOfTheCourtWidgetProps {
    playgroundId: string;
}

export function KingOfTheCourtWidget({ playgroundId }: KingOfTheCourtWidgetProps) {
    const homeTeamData = useMemo(() => {
        const playgroundMatches = matchesList.filter(
            (match) => match.status === 'Завершен' && match.playgroundId === playgroundId
        );

        if (playgroundMatches.length === 0) {
            return null;
        }

        const winsCount = new Map<string, number>();

        playgroundMatches.forEach(match => {
            const scoreParts = match.score.split('-');
            if (scoreParts.length < 2) return;
            const scores = scoreParts.map(s => parseInt(s.trim()));
            if (scores.length !== 2 || isNaN(scores[0]) || isNaN(scores[1])) {
                return;
            }

            let winnerName: string | null = null;
            if (scores[0] > scores[1]) {
                winnerName = match.team1.name;
            } else if (scores[1] > scores[0]) {
                winnerName = match.team2.name;
            }

            if (winnerName) {
                winsCount.set(winnerName, (winsCount.get(winnerName) || 0) + 1);
            }
        });

        if (winsCount.size === 0) {
            return null;
        }

        const [topTeamName, topWins] = [...winsCount.entries()].reduce((a, b) => b[1] > a[1] ? b : a);

        const teamInfo = teams.find(t => t.name === topTeamName);

        if (!teamInfo) {
            return null;
        }

        return {
            ...teamInfo,
            wins: topWins,
        };
    }, [playgroundId]);

    if (!homeTeamData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Crown /> Король площадки</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center p-4">
                        На этой площадке еще не было матчей. Станьте первыми, кто завоюет ее!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-amber-500/5 border-amber-500/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Crown className="text-amber-500" /> Король площадки</CardTitle>
                <CardDescription>Команда с наибольшим количеством побед на этом месте.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 text-center">
                 <Link href={`/teams/${homeTeamData.slug}`} className="block">
                    <Avatar className="h-20 w-20 border-4 border-amber-400">
                        <AvatarImage src={homeTeamData.logo} alt={homeTeamData.name} data-ai-hint={homeTeamData.dataAiHint} />
                        <AvatarFallback className="text-2xl">{homeTeamData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                 </Link>
                 <div>
                    <Link href={`/teams/${homeTeamData.slug}`} className="block">
                        <p className="text-xl font-bold hover:underline">{homeTeamData.name}</p>
                    </Link>
                    <p className="text-muted-foreground">{homeTeamData.wins} побед на этой площадке</p>
                </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full">
                    <Sword className="mr-2 h-4 w-4" /> Бросить вызов Королю
                </Button>
            </CardFooter>
        </Card>
    );
}
