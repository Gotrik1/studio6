


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
import type { Sponsor as SponsorType } from '@/entities/sponsor/model/types';
import { AssignSponsorDialog } from '@/widgets/assign-sponsor-dialog';

type SponsorWithAmount = SponsorType & { amount?: number };

type BackendSponsor = {
  id: string;
  name: string;
  logo: string | null;
  logoHint: string | null;
  description: string;
  profileUrl: string;
  interests: string[];
  amount?: number;
};

const adaptSponsor = (sponsor: BackendSponsor | null | undefined): (SponsorType & { amount?: number }) | null => {
    if (!sponsor) return null;
    return {
        ...sponsor,
        id: String(sponsor.id),
        logo: sponsor.logo || 'https://placehold.co/100x100.png',
        logoHint: sponsor.logoHint || 'sponsor logo',
        amount: sponsor.amount || 0,
    };
};

interface CrmTournamentSponsorsProps {
    tournamentId: string;
}

export function CrmTournamentSponsors({ tournamentId }: CrmTournamentSponsorsProps) {
    const { toast } = useToast();
    const [assignedSponsors, setAssignedSponsors] = useState<SponsorWithAmount[]>([]);
    const [availableSponsors, setAvailableSponsors] = useState<SponsorType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSponsor, setSelectedSponsor] = useState<SponsorType | null>(null);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [assignedData, availableRes] = await Promise.all([
                getAssignedSponsors(tournamentId),
                getAvailableSponsors()
            ]);
            
            setAssignedSponsors(assignedData);

            if (availableRes.success && Array.isArray(availableRes.data)) {
                const assignedIds = new Set(assignedData.map((p: SponsorWithAmount) => p.id));
                const adaptedSponsors = (availableRes.data as BackendSponsor[]).map(adaptSponsor).filter((s): s is SponsorType => s !== null);
                setAvailableSponsors(adaptedSponsors.filter(p => !assignedIds.has(p.id)));
            } else if (!availableRes.success) {
                 throw new Error(availableRes.error || 'Failed to process available sponsors');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить данные.';
            toast({ variant: 'destructive', title: 'Ошибка', description: `Не удалось загрузить данные: ${errorMessage}` });
        } finally {
            setIsLoading(false);
        }
    }, [tournamentId, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenAssignDialog = (sponsor: SponsorType) => {
        setSelectedSponsor(sponsor);
        setIsAssignDialogOpen(true);
    };
    
    const handleRemoveSponsor = async (sponsor: SponsorType) => {
        const result = await unassignSponsor(tournamentId, sponsor.id);
         if (result.success) {
            toast({ title: "Спонсор удален", description: `${sponsor.name} больше не является спонсором турнира.` });
            await fetchData();
        } else {
             toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
        }
    };

    return (
        <>
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
                                    <TableHead>Взнос (PD)</TableHead>
                                    <TableHead className="text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedSponsors.length > 0 ? assignedSponsors.map(sponsor => (
                                    <TableRow key={sponsor.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8"><AvatarImage src={sponsor.logo || ''} data-ai-hint={sponsor.logoHint} /><AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback></Avatar>
                                                <p className="font-semibold">{sponsor.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {sponsor.amount?.toLocaleString('ru-RU')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                             <Button variant="ghost" size="icon" onClick={() => handleRemoveSponsor(sponsor)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24">Спонсоры не назначены</TableCell>
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
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableSponsors.length > 0 ? availableSponsors.map(sponsor => (
                                    <TableRow key={sponsor.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                 <Avatar className="h-9 w-9">
                                                    <AvatarImage src={sponsor.logo || ''} data-ai-hint={sponsor.logoHint || 'medical logo'}/>
                                                    <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{sponsor.name}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenAssignDialog(sponsor)}>
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
        <AssignSponsorDialog 
            isOpen={isAssignDialogOpen}
            onOpenChange={setIsAssignDialogOpen}
            tournamentId={tournamentId}
            sponsor={selectedSponsor}
            onSuccess={fetchData}
        />
        </>
    );
}
