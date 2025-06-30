
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { summerKickoffTournament } from '@/shared/lib/mock-data/tournament-details';
import { Edit, MessageSquare } from 'lucide-react';
import { CrmMatchResultDialog, type MatchResult } from '@/widgets/crm-score-dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { Badge } from '@/shared/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

type MatchUnion = (typeof summerKickoffTournament.bracket.rounds)[0]['matches'][0];
type Match = Extract<MatchUnion, { team2: unknown }>;

type MatchStatus = 'pending' | 'played' | 'technical_defeat_t1' | 'technical_defeat_t2';

type MatchState = Match & {
    comment?: string;
    status: MatchStatus;
};

export function CrmTournamentMatches() {
    const { toast } = useToast();

    const allMatches = useMemo(() => {
        return summerKickoffTournament.bracket.rounds.reduce((acc, round) => {
            const playableMatches = round.matches.filter((match): match is Match => 'team2' in match);
            return acc.concat(playableMatches);
        }, [] as Match[]);
    }, []);
    
    const [matches, setMatches] = useState<MatchState[]>(allMatches.map(m => ({ ...m, score: m.score || '', status: (m.score && m.score !== 'VS') ? 'played' : 'pending' })));
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);

    const handleOpenScoreDialog = (match: Match) => {
        setSelectedMatch(match);
        setIsScoreDialogOpen(true);
    };

    const handleMatchUpdate = (result: MatchResult) => {
        setMatches(prev => prev.map(match => {
            if (match.id !== result.matchId) return match;
            
            let newScore: string;
            let newStatus: MatchStatus;

            if (result.type === 'score') {
                newScore = `${result.scoreA}-${result.scoreB}`;
                newStatus = 'played';
            } else if (result.type === 'tech_defeat_t1') {
                newScore = 'L-W';
                newStatus = 'tech_defeat_t1';
            } else { // result.type === 'tech_defeat_t2'
                newScore = 'W-L';
                newStatus = 'tech_defeat_t2';
            }
            
            return { ...match, score: newScore, status: newStatus, comment: result.comment };
        }));
        toast({
            title: "Результат обновлен!",
            description: "Счет матча был успешно сохранен."
        });
    };
    
    const getResultBadge = (match: MatchState) => {
        switch(match.status) {
            case 'played':
                return <Badge variant="secondary">{match.score}</Badge>;
            case 'pending':
                return <Badge variant="outline">Ожидает</Badge>;
            case 'technical_defeat_t1':
                return <Badge variant="destructive">Тех. пор. {match.team1?.name}</Badge>;
            case 'technical_defeat_t2':
                return <Badge variant="destructive">Тех. пор. {match.team2?.name}</Badge>;
        }
    }

    // Create a map for quick lookup of round names
    const matchIdToRoundName = useMemo(() => {
        return summerKickoffTournament.bracket.rounds.reduce((acc, round) => {
            round.matches.forEach(match => {
                if ('team2' in match) { // Ensure it's a playable match
                    acc[match.id] = round.name;
                }
            });
            return acc;
        }, {} as Record<number, string>);
    }, []);

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
                            {matches.map(currentMatchState => (
                                <TableRow key={currentMatchState.id}>
                                    <TableCell className="text-muted-foreground">{matchIdToRoundName[currentMatchState.id]}</TableCell>
                                    <TableCell className="font-medium">{currentMatchState.team1?.name} vs {currentMatchState.team2?.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getResultBadge(currentMatchState)}
                                            {currentMatchState.comment && (
                                                    <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="max-w-xs">{currentMatchState.comment}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => handleOpenScoreDialog(currentMatchState)}>
                                            <Edit className="mr-2 h-3 w-3" />
                                            Управлять
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <CrmMatchResultDialog 
                isOpen={isScoreDialogOpen}
                onOpenChange={setIsScoreDialogOpen}
                match={selectedMatch}
                onMatchUpdate={handleMatchUpdate}
            />
        </>
    );
}
