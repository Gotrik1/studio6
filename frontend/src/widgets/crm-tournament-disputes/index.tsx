

'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { DisputeResolutionDialog } from '@/widgets/dispute-resolution-dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { fetchMatches } from '@/entities/match/api/get-matches';
import { resolveDispute } from '@/entities/match/api/resolve-dispute';
import type { Match } from '@/entities/match/model/types';
import { Skeleton } from '@/shared/ui/skeleton';
import { useState, useEffect, useCallback } from 'react';

type DisputedMatch = Match & {
    disputeReason: string;
    timestamp?: string;
};

interface CrmTournamentDisputesProps {
    tournamentId: string;
}

export function CrmTournamentDisputes({ tournamentId }: CrmTournamentDisputesProps) {
    const { toast } = useToast();
    const [disputedMatches, setDisputedMatches] = useState<DisputedMatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMatch, setSelectedMatch] = useState<DisputedMatch | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const data = await fetchMatches('DISPUTED', tournamentId);
        setDisputedMatches(data as DisputedMatch[]);
        setIsLoading(false);
    }, [tournamentId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleReviewClick = (match: DisputedMatch) => {
        setSelectedMatch(match);
        setIsDialogOpen(true);
    };

    const handleResolve = async (matchId: string, resolution: string) => {
        const matchToResolve = disputedMatches.find(m => m.id === matchId);
        if (!matchToResolve) return;

        const result = await resolveDispute(matchId, {
            winnerId: matchToResolve.team1.id, // Simplified for demo
            resolution,
            score1: 1, // Mock score
            score2: 0,
        });

        if (result.success) {
            toast({
                title: 'Спор разрешен!',
                description: `Решение по матчу ${matchToResolve.team1.name} vs ${matchToResolve.team2.name} было принято.`
            });
            await fetchData();
            setIsDialogOpen(false);
        } else {
             toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: result.error || "Не удалось разрешить спор.",
            });
        }
    };

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Спорные матчи</CardTitle>
                <CardDescription>Матчи, требующие решения судьи.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                     <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Матч</TableHead>
                                <TableHead>Причина спора</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {disputedMatches.map(match => (
                                <TableRow key={match.id}>
                                    <TableCell className="font-medium">{match.team1.name} vs {match.team2.name}</TableCell>
                                    <TableCell>{match.disputeReason}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" onClick={() => handleReviewClick(match)}>Рассмотреть</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {disputedMatches.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">Спорных матчей нет.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
        <DisputeResolutionDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            match={selectedMatch}
            onResolve={handleResolve}
        />
        </>
    );
}
