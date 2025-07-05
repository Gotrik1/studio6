'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import { assignSponsor, getAssignedSponsors, getAvailableSponsors, unassignSponsor } from '@/entities/tournament/api/sponsors';
import type { Sponsor } from '@/entities/sponsor/model/types';

interface CrmTournamentSponsorsProps {
    tournamentId: string;
}

export function CrmTournamentSponsors({ tournamentId }: CrmTournamentSponsorsProps) {
    const { toast } = useToast();
    const [assignedSponsors, setAssignedSponsors] = useState<Sponsor[]>([]);
    const [availableSponsors, setAvailableSponsors] = useState<Sponsor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [assignedRes, availableRes] = await Promise.all([
                getAssignedSponsors(tournamentId),
                getAvailableSponsors()
            ]);
            
            if (assignedRes.success) setAssignedSponsors(assignedRes.data);
            else throw new Error(assignedRes.error);

            if (availableRes.success) {
                const assignedIds = new Set(assignedRes.data.map((p: any) => p.id));
                setAvailableSponsors(availableRes.data.filter((p: any) => !assignedIds.has(p.id)));
            } else {
                 throw new Error(availableRes.error);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Ошибка', description: `Не удалось загрузить данные: ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    }, [tournamentId, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleAddSponsor = async (sponsor: Sponsor) => {
        const result = await assignSponsor(tournamentId, sponsor.id);
        if (result.success) {
            toast({ title: "Спонсор добавлен", description: `Компания ${sponsor.name} теперь является спонсором турнира.` });
            await fetchData();
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
        }
    };
    
    const handleRemoveSponsor = async (sponsor: Sponsor) => {
        const result = await unassignSponsor(tournamentId, sponsor.id);
        if (result.success) {
            toast({ title: "Спонсор удален", description: `${sponsor.name} больше не является спонсором турнира.` });
            await fetchData();
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Спонсоры турнира</CardTitle>
                    <CardDescription>Партнеры, поддерживающие это событие.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoading ? <Skeleton className="h-40 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Спонсор</TableHead>
                                    <TableHead className="text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedSponsors.length > 0 ? assignedSponsors.map(sponsor => (
                                    <TableRow key={sponsor.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={sponsor.logo} data-ai-hint={sponsor.logoHint} /><AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback></Avatar>
                                                <p className="font-semibold">{sponsor.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                             <Button variant="ghost" size="icon" onClick={() => handleRemoveSponsor(sponsor)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center h-24">Спонсоры не назначены</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Доступные спонсоры</CardTitle>
                    <CardDescription>Аккредитованные партнеры, доступные для назначения.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-40 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Спонсор</TableHead>
                                    <TableHead className="text-right">Действие</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableSponsors.length > 0 ? availableSponsors.map(sponsor => (
                                    <TableRow key={sponsor.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={sponsor.logo} data-ai-hint={sponsor.logoHint} /><AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback></Avatar>
                                                <p className="font-semibold">{sponsor.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleAddSponsor(sponsor)}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Назначить
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center h-24">Нет доступных спонсоров</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
