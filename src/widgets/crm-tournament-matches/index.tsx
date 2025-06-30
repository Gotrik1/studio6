'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { summerKickoffTournament } from '@/shared/lib/mock-data/tournament-details';
import { Edit } from 'lucide-react';
import { CrmScoreDialog } from '@/widgets/crm-score-dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { Badge } from '@/shared/ui/badge';

type Match = (typeof summerKickoffTournament.bracket.rounds)[0]['matches'][0];

export function CrmTournamentMatches() {
    const allMatches = summerKickoffTournament.bracket.rounds.flatMap(round => round.matches.filter(match => match.team1 && match.team2));
    const [matches, setMatches] = useState<Match[]>(allMatches);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleOpenScoreDialog = (match: Match) => {
        setSelectedMatch(match);
        setIsScoreDialogOpen(true);
    };

    const handleScoreSubmit = (matchId: number, scoreA: number, scoreB: number) => {
        setMatches(prev => prev.map(match => 
            match.id === matchId ? { ...match, score: `${scoreA}-${scoreB}` } : match
        ));
        toast({
            title: "Результат обновлен!",
            description: "Счет матча был успешно сохранен."
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Матчи турнира</CardTitle>
                    <CardDescription>Управление результатами всех матчей в рамках текущего турнира.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Раунд</TableHead>
                                <TableHead>Матч</TableHead>
                                <TableHead>Результат</TableHead>
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {summerKickoffTournament.bracket.rounds.map(round => 
                                round.matches.filter(match => match.team1 && match.team2).map(match => {
                                    const currentMatchState = matches.find(m => m.id === match.id);
                                    return (
                                        <TableRow key={match.id}>
                                            <TableCell className="text-muted-foreground">{round.name}</TableCell>
                                            <TableCell className="font-medium">{currentMatchState?.team1?.name} vs {currentMatchState?.team2?.name}</TableCell>
                                            <TableCell>
                                                {currentMatchState?.score ? (
                                                    <Badge variant="secondary">{currentMatchState.score}</Badge>
                                                ) : (
                                                    <Badge variant="outline">Ожидает</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => handleOpenScoreDialog(currentMatchState!)}>
                                                    <Edit className="mr-2 h-3 w-3" />
                                                    {currentMatchState?.score ? 'Изменить' : 'Ввести'} результат
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <CrmScoreDialog 
                isOpen={isScoreDialogOpen}
                onOpenChange={setIsScoreDialogOpen}
                match={selectedMatch}
                onScoreSubmit={handleScoreSubmit}
            />
        </>
    );
}
