'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { disputedMatches as initialDisputed, type DisputedMatch } from '@/shared/lib/mock-data/judge-center';
import { useToast } from '@/shared/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DisputeResolutionDialog } from '@/widgets/dispute-resolution-dialog';

export function CrmTournamentDisputes() {
    const { toast } = useToast();
    const [disputedMatches, setDisputedMatches] = useState<DisputedMatch[]>(initialDisputed.slice(0, 1));
    const [selectedMatch, setSelectedMatch] = useState<DisputedMatch | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleReviewClick = (match: DisputedMatch) => {
        setSelectedMatch(match);
        setIsDialogOpen(true);
    };

    const handleResolve = (matchId: string, resolution: string) => {
        const matchToResolve = disputedMatches.find(m => m.id === matchId);
        if (matchToResolve) {
            setDisputedMatches(prev => prev.filter(m => m.id !== matchId));
            toast({
                title: 'Спор разрешен!',
                description: `Решение по матчу ${matchToResolve.team1.name} vs ${matchToResolve.team2.name} было принято.`
            });
            setIsDialogOpen(false);
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Матч</TableHead>
                                <TableHead className="hidden md:table-cell">Причина спора</TableHead>
                                <TableHead className="hidden md:table-cell">Поступил</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {disputedMatches.length > 0 ? disputedMatches.map(match => (
                                <TableRow key={match.id}>
                                    <TableCell className="font-medium">{match.team1.name} vs {match.team2.name}</TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-sm">{match.reason}</TableCell>
                                    <TableCell className="hidden md:table-cell">{formatDistanceToNow(new Date(match.timestamp), { addSuffix: true, locale: ru })}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" onClick={() => handleReviewClick(match)}>Рассмотреть</Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        В этом турнире нет активных споров.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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
