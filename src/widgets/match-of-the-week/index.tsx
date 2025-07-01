'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Bot, AlertCircle, Award } from 'lucide-react';
import { generateTournamentSummary, type GenerateTournamentSummaryOutput } from '@/shared/api/genkit/flows/generate-tournament-summary-flow';
import { generatePostImage, type GeneratePostImageOutput } from '@/shared/api/genkit/flows/generate-post-image-flow';
import { summerKickoffTournament as mockTournament } from '@/shared/lib/mock-data/tournament-details';
import Link from 'next/link';
import Image from 'next/image';

type ResultData = {
    summary: GenerateTournamentSummaryOutput;
    image: GeneratePostImageOutput;
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
                const finalMatch = mockTournament.bracket.rounds.find(r => r.name === "Финал")?.matches[0];
                if (!finalMatch || !('team2' in finalMatch)) throw new Error("Final match not found");

                const summaryData = await generateTournamentSummary({
                    tournamentName: mockTournament.name,
                    tournamentGame: mockTournament.game,
                    champion: mockTournament.teams.find(t => t.name === finalMatch.team1?.name) ? finalMatch.team1.name : "Unknown",
                    finalMatch: {
                        team1: finalMatch.team1?.name || "Team 1",
                        team2: finalMatch.team2?.name || "Team 2",
                        score: finalMatch.score || "N/A",
                    },
                });

                const imagePrompt = summaryData.imagePrompts[0] || `A heroic moment from the final of ${mockTournament.name}`;
                const imageData = await generatePostImage(imagePrompt);
                
                setResult({ summary: summaryData, image: imageData });
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
            <Card>
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

    return (
        <Card className="overflow-hidden">
            <div className="relative h-40">
                <Image src={result.image.imageDataUri} alt="Матч недели" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <CardTitle className="absolute bottom-2 left-4 text-white font-headline text-xl shadow-lg">Матч недели</CardTitle>
            </div>
            <CardHeader>
                <CardDescription>{result.summary.tournamentName}</CardDescription>
                 <p className="font-semibold">{result.summary.socialMediaPost}</p>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 text-sm">
                    <Award className="h-5 w-5 text-amber-500"/>
                    <div>
                        <span className="font-semibold">MVP:</span> {result.summary.mvp.name}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                    <Link href={`/tournaments/${mockTournament.slug}`}>Подробнее</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
