





'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Bot, AlertCircle, Award } from 'lucide-react';
import { generateMatchPost, type GenerateMatchPostOutput } from '@/shared/api/genkit/flows/generate-match-post-flow';
import Link from 'next/link';
import Image from 'next/image';
import { getMatchOfTheWeek } from '@/entities/match/api/get-match';
import type { Match, MatchDetails } from '@/entities/match/model/types';

type ResultData = {
    matchPost: GenerateMatchPostOutput;
    matchDetails: Match;
};

export function MatchOfTheWeekWidget() {
    const [result, setResult] = useState<ResultData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHighlight = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const matchData = await getMatchOfTheWeek();
                if (!matchData) {
                    throw new Error("No match of the week found.");
                }

                const scoreParts = matchData.score.split('-').map(s => parseInt(s.trim(), 10));
                if (scoreParts.length < 2 || isNaN(scoreParts[0]) || isNaN(scoreParts[1])) {
                    throw new Error("Invalid score format for match of the week.");
                }

                const winningTeam = scoreParts[0] > scoreParts[1] ? matchData.team1.name : matchData.team2.name;
                const losingTeam = scoreParts[0] > scoreParts[1] ? matchData.team2.name : matchData.team1.name;

                const postData = await generateMatchPost({
                    winningTeam,
                    losingTeam,
                    score: matchData.score,
                    matchSummary: `A close match in the ${matchData.tournament || 'friendly game'}.`
                });
                
                // Adapt MatchDetails to Match
                const adaptedMatchDetails: Match = {
                    ...matchData,
                    id: String(matchData.id),
                    team1: { ...matchData.team1, id: 'mock-id-1' }, // Add mock ID
                    team2: { ...matchData.team2, id: 'mock-id-2' }, // Add mock ID
                    game: 'Unknown',
                    href: `/matches/${matchData.id}`,
                };
                
                setResult({ matchPost: postData, matchDetails: adaptedMatchDetails });
            } catch (e) {
                console.error('Failed to fetch match of the week:', e);
                setError('Не удалось загрузить матч недели.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchHighlight();
    }, []);

    if (isLoading) {
        return (
            <Card className="h-[320px]">
                <Skeleton className="h-40 w-full" />
                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                <CardContent><Skeleton className="h-16 w-full" /></CardContent>
            </Card>
        )
    }
    
    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot /> Матч недели</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (!result) return null;
    
    const { matchPost, matchDetails } = result;

    return (
        <Card className="overflow-hidden">
            <div className="relative h-40">
                <Image src={matchPost.imageDataUri} alt="Матч недели" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <CardTitle className="absolute bottom-2 left-4 text-white font-headline text-xl shadow-lg">Матч недели</CardTitle>
            </div>
            <CardHeader>
                <CardDescription>{matchDetails.tournament || 'Товарищеский матч'}</CardDescription>
                 <p className="font-semibold">{matchPost.postText}</p>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 text-sm">
                    <Award className="h-5 w-5 text-amber-500"/>
                    <div>
                         <span className="font-semibold">{matchDetails.team1.name}</span>
                         <span className="mx-2 font-bold">{matchDetails.score}</span>
                         <span className="font-semibold">{matchDetails.team2.name}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                    <Link href={`/matches/${matchDetails.id}`}>Подробнее</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
