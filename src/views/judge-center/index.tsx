'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { disputedMatches as initialDisputed, resolvedMatches as initialResolved, type DisputedMatch, type ResolvedMatch } from '@/shared/lib/mock-data/judge-center';
import { DisputeResolutionDialog } from '@/widgets/dispute-resolution-dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export function JudgeCenterPage() {
    const { toast } = useToast();
    const [disputedMatches, setDisputedMatches] = useState<DisputedMatch[]>(initialDisputed);
    const [resolvedMatches, setResolvedMatches] = useState<ResolvedMatch[]>(initialResolved);
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
            const newResolvedMatch: ResolvedMatch = {
                id: matchToResolve.id,
                team1: matchToResolve.team1,
                team2: matchToResolve.team2,
                resolution,
                judge: 'Вы', // Assuming current user is the judge
                timestamp: new Date().toISOString(),
            };
            setResolvedMatches(prev => [newResolvedMatch, ...prev]);
            toast({
                title: 'Спор разрешен!',
                description: `Решение по матчу ${matchToResolve.team1.name} vs ${matchToResolve.team2.name} было принято.`
            });
            setIsDialogOpen(false);
        }
    };

    return (
        <div className="space-y-6">
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
                                    {disputedMatches.map(match => (
                                        <TableRow key={match.id}>
                                            <TableCell className="font-medium">{match.team1.name} vs {match.team2.name}</TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-sm">{match.reason}</TableCell>
                                            <TableCell className="hidden md:table-cell">{formatDistanceToNow(new Date(match.timestamp), { addSuffix: true, locale: ru })}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" onClick={() => handleReviewClick(match)}>Рассмотреть</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Матч</TableHead>
                                        <TableHead>Решение</TableHead>
                                        <TableHead className="text-right">Судья</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {resolvedMatches.map(match => (
                                        <TableRow key={match.id}>
                                            <TableCell className="font-medium">{match.team1.name} vs {match.team2.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{match.resolution}</TableCell>
                                            <TableCell className="text-right">{match.judge}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
    );
}
