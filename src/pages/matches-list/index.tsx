
'use client';

import { useState } from 'react';
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReportScoreDialog } from '@/components/report-score-dialog';
import { useToast } from '@/hooks/use-toast';
import { matchesList } from "@/lib/mock-data/matches";
import { PlusCircle, Swords } from 'lucide-react';

export function MatchesListPage() {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<{ id: string, name: string } | null>(null);
  const { toast } = useToast();

  const handleOpenReportDialog = (matchId: string, team1Name: string, team2Name: string) => {
    setSelectedMatch({ id: matchId, name: `${team1Name} vs ${team2Name}` });
    setIsReportDialogOpen(true);
  };

  const handleReportSubmit = () => {
    // Here you would typically update the match status or perform other actions
    toast({
      title: "Отчет отправлен",
      description: "Результат матча отправлен на проверку.",
    });
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
    <div className="space-y-6">
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
              {matchesList.map((match) => (
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
                  <TableCell className="hidden md:table-cell">{match.date}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Badge variant={getStatusVariant(match.status)}>{match.status}</Badge>
                    {match.status === "Идет" && (
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenReportDialog(match.id, match.team1.name, match.team2.name)}
                        >
                            Сообщить результат
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
       <ReportScoreDialog
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        matchName={selectedMatch?.name || ''}
        onReportSubmit={handleReportSubmit}
      />
    </div>
  );
}
