
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import type { TournamentCrm } from '@/entities/user/model/types';

interface ManagedTournamentsTabProps {
    tournaments: TournamentCrm[];
}

export function ManagedTournamentsTab({ tournaments }: ManagedTournamentsTabProps) {
    
    const getStatusVariant = (status: TournamentCrm['status']) => {
        switch (status) {
            case 'ONGOING': return 'destructive';
            case 'REGISTRATION': return 'default';
            case 'FINISHED': return 'secondary';
            default: return 'outline';
        }
    };
    
    const getStatusText = (status: TournamentCrm['status']) => {
        switch (status) {
            case 'ONGOING': return 'В процессе';
            case 'REGISTRATION': return 'Открыт набор';
            case 'FINISHED': return 'Завершён';
            default: return 'Архив';
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Организованные турниры</CardTitle>
                <CardDescription>Список турниров, созданных и управляемых этим организатором.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Турнир</TableHead>
                            <TableHead className="hidden md:table-cell">Дисциплина</TableHead>
                            <TableHead className="hidden md:table-cell">Статус</TableHead>
                            <TableHead className="text-right">Управление</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tournaments.map(tournament => (
                            <TableRow key={tournament.id}>
                                <TableCell className="font-medium">{tournament.name}</TableCell>
                                <TableCell className="hidden md:table-cell">{tournament.sport}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Badge variant={getStatusVariant(tournament.status as any)}>{getStatusText(tournament.status as any)}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/administration/tournament-crm/${tournament.id}`}>Перейти</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
