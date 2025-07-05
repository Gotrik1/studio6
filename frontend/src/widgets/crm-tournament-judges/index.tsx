
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { Skeleton } from '@/shared/ui/skeleton';
import { assignJudge, getAssignedJudges, getAvailableJudges, unassignJudge } from '@/entities/tournament/api/judges';
import type { User } from '@/shared/lib/types';

interface CrmTournamentJudgesProps {
    tournamentId: string;
}

export function CrmTournamentJudges({ tournamentId }: CrmTournamentJudgesProps) {
    const { toast } = useToast();
    const [assignedJudges, setAssignedJudges] = useState<User[]>([]);
    const [availableJudges, setAvailableJudges] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [assignedData, availableData] = await Promise.all([
                getAssignedJudges(tournamentId),
                getAvailableJudges()
            ]);
            setAssignedJudges(assignedData);
            // Filter out already assigned judges from the available list
            const assignedIds = new Set(assignedData.map((j: User) => j.id));
            setAvailableJudges(availableData.filter((j: User) => !assignedIds.has(j.id)));
        } catch (error) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить данные судей.' });
        } finally {
            setIsLoading(false);
        }
    }, [tournamentId, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddJudge = async (judge: User) => {
        const result = await assignJudge(tournamentId, judge.id);
        if (result.success) {
            toast({ title: "Судья назначен", description: `${judge.name} был назначен на турнир.` });
            await fetchData();
        } else {
             toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось назначить судью.' });
        }
    };
    
    const handleRemoveJudge = async (judge: User) => {
        const result = await unassignJudge(tournamentId, judge.id);
         if (result.success) {
            toast({ title: "Судья снят с турнира", description: `${judge.name} был удален из судейского состава.` });
            await fetchData();
        } else {
             toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось снять судью.' });
        }
    };

    const handleEditJudge = (name: string) => {
        toast({ title: "Редактирование", description: `Открыт диалог редактирования для судьи ${name}.` });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Назначенные судьи</CardTitle>
                    <CardDescription>Судейский состав, работающий на этом турнире.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoading ? <Skeleton className="h-40 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Судья</TableHead>
                                    <TableHead className="text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedJudges.map(judge => (
                                    <TableRow key={judge.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={judge.avatar} /><AvatarFallback>{judge.name.charAt(0)}</AvatarFallback></Avatar>
                                                <p className="font-semibold">{judge.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Действия</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditJudge(judge.name)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Редактировать
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleRemoveJudge(judge)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Удалить
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {assignedJudges.length === 0 && <TableRow><TableCell colSpan={2} className="text-center h-24">Судьи не назначены</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Доступные судьи</CardTitle>
                    <CardDescription>Аккредитованные судьи, доступные для назначения.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-40 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Судья</TableHead>
                                    <TableHead className="text-right">Действие</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableJudges.map(judge => (
                                    <TableRow key={judge.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={judge.avatar} /><AvatarFallback>{judge.name.charAt(0)}</AvatarFallback></Avatar>
                                                <p className="font-semibold">{judge.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleAddJudge(judge)}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Назначить
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {availableJudges.length === 0 && <TableRow><TableCell colSpan={2} className="text-center h-24">Нет свободных судей</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
