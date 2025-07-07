

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { DisputeResolutionDialog } from '@/widgets/dispute-resolution-dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { fetchMatches } from '@/entities/match/api/get-matches';
import type { Match } from '@/entities/match/model/types';
import { Skeleton } from '@/shared/ui/skeleton';
import { resolveDispute } from '@/entities/match/api/resolve-dispute';


type DisputedMatch = Match & {
    disputeReason: string;
    timestamp: string;
};

type ResolvedMatch = Match & {
    resolution: string;
    judge: string; // Mocked for now
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
        try {
            const data = await fetchMatches('DISPUTED', tournamentId);
            setDisputedMatches(data as DisputedMatch[]);
        } catch (error) {
            console.error('Failed to fetch disputed matches:', error);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить список споров.' });
        } finally {
            setIsLoading(false);
        }
    }, [toast, tournamentId]);

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

        // Simplified logic for winner/score for this implementation
        const result = await resolveDispute(matchId, {
            winnerId: matchToResolve.team1.id, // For demo, let's make team1 the winner
            resolution,
            score1: 1, // Mock score
            score2: 0,
        });

        if (result.success) {
            toast({
                title: 'Спор разрешен!',
                description: `Решение по матчу ${matchToResolve.team1.name} vs ${matchToResolve.team2.name} было принято.`
            });
            await fetchData(); // Refetch data
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
                    <CardDescription>Споры, открытые участниками в рамках этого турнира.</CardDescription>
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
                                    <TableHead className="hidden md:table-cell">Причина</TableHead>
                                    <TableHead className="hidden md:table-cell">Поступил</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {disputedMatches.length > 0 ? disputedMatches.map(match => (
                                    <TableRow key={match.id}>
                                        <TableCell className="font-medium">{match.team1.name} vs {match.team2.name}</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-sm">{match.disputeReason}</TableCell>
                                        <TableCell className="hidden md:table-cell">{match.timestamp ? formatDistanceToNow(new Date(match.timestamp), { addSuffix: true, locale: ru }) : '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => handleReviewClick(match)}>Рассмотреть</Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={4} className="h-24 text-center">Активных споров нет.</TableCell></TableRow>
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
