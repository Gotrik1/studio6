

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import { assignMedicalPartner, getAssignedMedicalStaff, getAvailableMedicalPartners, unassignMedicalPartner } from '@/entities/tournament/api/medical';

type MedicalPartner = {
  id: string;
  name: string;
  specialization: string;
  contact: string;
  avatar: string | null;
  avatarHint: string | null;
};

interface CrmTournamentMedicalProps {
    tournamentId: string;
}

export function CrmTournamentMedical({ tournamentId }: CrmTournamentMedicalProps) {
    const { toast } = useToast();
    const [assignedMedics, setAssignedMedics] = useState<MedicalPartner[]>([]);
    const [availableMedics, setAvailableMedics] = useState<MedicalPartner[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [assignedRes, availableRes] = await Promise.all([
                getAssignedMedicalStaff(tournamentId),
                getAvailableMedicalPartners()
            ]);
            
            if (assignedRes.success) {
                setAssignedMedics(assignedRes.data as MedicalPartner[]);
            } else {
                throw new Error(assignedRes.error);
            }

            if (availableRes.success && Array.isArray(availableRes.data)) {
                const assignedIds = new Set((assignedRes.data as MedicalPartner[]).map((p: MedicalPartner) => p.id));
                setAvailableMedics((availableRes.data as MedicalPartner[]).filter((p: MedicalPartner) => !assignedIds.has(p.id)));
            } else if (!availableRes.success) {
                 throw new Error('Failed to process available medics');
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
    
    const handleAddMedic = async (medic: MedicalPartner) => {
        const result = await assignMedicalPartner(tournamentId, medic.id);
        if (result.success) {
            toast({ title: "Мед. поддержка назначена", description: `${medic.name} будет работать на турнире.` });
            await fetchData();
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
        }
    };
    
    const handleRemoveMedic = async (medic: MedicalPartner) => {
        const result = await unassignMedicalPartner(tournamentId, medic.id);
         if (result.success) {
            toast({ title: "Мед. поддержка снята", description: `${medic.name} снят(а) с турнира.` });
            await fetchData();
        } else {
             toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Закрепленная мед. поддержка</CardTitle>
                    <CardDescription>Медицинские бригады и специалисты, работающие на этом турнире.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoading ? <Skeleton className="h-40 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Организация / Врач</TableHead>
                                    <TableHead className="text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedMedics.length > 0 ? assignedMedics.map(medic => (
                                    <TableRow key={medic.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={medic.avatar || ''} data-ai-hint={medic.avatarHint || 'medical logo'}/>
                                                    <AvatarFallback>{medic.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{medic.name}</p>
                                                    <p className="text-xs text-muted-foreground">{medic.specialization}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveMedic(medic)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center h-24">Медицинская поддержка не назначена</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Аккредитованные мед. службы</CardTitle>
                    <CardDescription>Доступные для назначения на турнир партнеры.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoading ? <Skeleton className="h-40 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Организация / Врач</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableMedics.length > 0 ? availableMedics.map(medic => (
                                    <TableRow key={medic.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                 <Avatar className="h-9 w-9">
                                                    <AvatarImage src={medic.avatar || ''} data-ai-hint={medic.avatarHint || 'medical logo'}/>
                                                    <AvatarFallback>{medic.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{medic.name}</p>
                                                    <p className="text-xs text-muted-foreground">{medic.specialization}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleAddMedic(medic)}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Назначить
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center h-24">Нет доступных партнеров</TableCell>
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
