

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
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
import { Badge } from '@/shared/ui/badge';

type DisputedMatch = Match & {
    disputeReason: string;
    timestamp: string;
};

type ResolvedMatch = Match & {
    resolution: string;
    judge: string; // Mocked for now
};

export function JudgeCenterPage() {
    const { toast } = useToast();
    const [disputedMatches, setDisputedMatches] = useState<DisputedMatch[]>([]);
    const [resolvedMatches, setResolvedMatches] = useState<ResolvedMatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMatch, setSelectedMatch] = useState<DisputedMatch | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const disputedData = await fetchMatches('DISPUTED');
            const finishedData = await fetchMatches('FINISHED');
            setDisputedMatches(disputedData as DisputedMatch[]);
            setResolvedMatches(finishedData.filter((m) => m.resolution).map((m) => ({ ...m, judge: 'Вы' } as ResolvedMatch)));
        } catch (error) {
            console.error('Failed to fetch matches:', error);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить список матчей.' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

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
            <div className="space-y-6 opacity-0 animate-fade-in-up">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Центр Судей</h1>
                    <p className="text-muted-foreground">
                        Рассмотрение спорных ситуаций и вынесение решений по матчам.
                    </p>
                </div>

                <Tabs defaultValue="queue">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="queue">Очередь споров <Badge className="ml-2">{disputedMatches.length}</Badge></TabsTrigger>
                        <TabsTrigger value="resolved">Разрешенные споры</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="queue" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ожидают решения</CardTitle>
                                <CardDescription>Матчи, по которым были открыты споры.</CardDescription>
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
                    </TabsContent>

                    <TabsContent value="resolved" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>История решений</CardTitle>
                                <CardDescription>Архив рассмотренных споров.</CardDescription>
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
                                                <TableHead>Решение</TableHead>
                                                <TableHead className="text-right">Судья</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resolvedMatches.length > 0 ? resolvedMatches.map(match => (
                                                <TableRow key={match.id}>
                                                    <TableCell className="font-medium">{match.team1.name} vs {match.team2.name}</TableCell>
                                                    <TableCell className="text-muted-foreground">{match.resolution}</TableCell>
                                                    <TableCell className="text-right">{match.judge}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={3} className="h-24 text-center">Разрешенных споров нет.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                
                <DisputeResolutionDialog 
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    match={selectedMatch}
                    onResolve={handleResolve}
                />
            </div>
        </>
    );
}
