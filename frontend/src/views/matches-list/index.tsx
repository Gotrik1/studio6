

'use client';

import { useState, useCallback } from 'react';
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { useToast } from '@/shared/hooks/use-toast';
import { PlusCircle, Edit } from 'lucide-react';
import { fetchMatches } from '@/entities/match/api/get-matches';
import type { Match } from "@/entities/match/model/types";
import { Skeleton } from '@/shared/ui/skeleton';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CrmMatchResultDialog, type MatchResult } from '@/widgets/crm-score-dialog';
import { updateMatchScore } from '@/entities/match/api/update-match-score';

type DialogMatch = {
    id: string;
    team1?: { name: string };
    team2?: { name: string };
    score?: string;
};

interface MatchesListPageProps {
  initialMatches: Match[];
}

export function MatchesListPage({ initialMatches }: MatchesListPageProps) {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [loading, setLoading] = useState(false);
  const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<DialogMatch | null>(null);
  const { toast } = useToast();

  const loadMatches = useCallback(async () => {
      setLoading(true);
      try {
          const fetchedMatches = await fetchMatches();
          setMatches(fetchedMatches);
      } catch (error) {
          console.error("Failed to fetch matches:", error);
          toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить матчи.' });
      } finally {
          setLoading(false);
      }
  }, [toast]);

  const handleOpenScoreDialog = (match: Match) => {
    const dialogMatch: DialogMatch = {
        id: match.id,
        team1: { name: match.team1.name },
        team2: { name: match.team2.name },
        score: match.score,
    };
    setSelectedMatch(dialogMatch);
    setIsScoreDialogOpen(true);
  };

  const handleMatchUpdate = async (result: MatchResult) => {
    const updateResult = await updateMatchScore(String(result.matchId), result.scoreA, result.scoreB, result.comment);
    if (updateResult.success) {
        toast({
            title: "Результат обновлен",
            description: "Счет матча был успешно сохранен.",
        });
        await loadMatches(); // Reload data
    } else {
        toast({
            variant: 'destructive',
            title: 'Ошибка обновления',
            description: updateResult.error,
        });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Идет": return "destructive";
      case "Завершен": return "outline";
      case "Предстоящий": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Матчи</h1>
                <p className="text-muted-foreground">
                    Следите за результатами прошедших, текущих и будущих игр.
                </p>
            </div>
             <Button asChild>
                <Link href="/matches/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Создать вызов
                </Link>
            </Button>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Список матчей</CardTitle>
          <CardDescription>Все матчи, проводимые на платформе.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Матч</TableHead>
                  <TableHead className="hidden md:table-cell">Турнир</TableHead>
                  <TableHead className="hidden md:table-cell">Дата</TableHead>
                  <TableHead className="text-right">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match: Match) => (
                  <TableRow key={match.id}>
                    <TableCell>
                      <Link href={match.href || '#'} className="flex items-center gap-4 group">
                        <div className="flex items-center gap-2 text-right">
                          <span className="font-semibold hidden sm:inline">{match.team1.name}</span>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={match.team1.logo} data-ai-hint={match.team1.logoHint} />
                            <AvatarFallback>{match.team1.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <span className="font-bold text-lg text-muted-foreground group-hover:text-primary transition-colors">{match.score}</span>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={match.team2.logo} data-ai-hint={match.team2.logoHint} />
                            <AvatarFallback>{match.team2.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold hidden sm:inline">{match.team2.name}</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{match.tournament}</TableCell>
                    <TableCell className="hidden md:table-cell">{format(new Date(match.date), 'd MMMM yyyy', { locale: ru })}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Badge variant={getStatusVariant(match.status)}>{match.status}</Badge>
                      {(match.status === "Идет" || match.status === "Предстоящий") && (
                          <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenScoreDialog(match)}
                          >
                              <Edit className="mr-2 h-3 w-3" />
                              Ввести результат
                          </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
       <CrmMatchResultDialog
        isOpen={isScoreDialogOpen}
        onOpenChange={setIsScoreDialogOpen}
        match={selectedMatch} 
        onMatchUpdate={handleMatchUpdate}
      />
    </div>
  );
}
