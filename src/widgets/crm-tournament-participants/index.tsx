
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { crmParticipants, type CrmParticipant } from '@/shared/lib/mock-data/crm-participants';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Check, X, Mail } from 'lucide-react';

export function CrmTournamentParticipants() {
    // In a real app, participants would be fetched based on tournament ID
    const participants = crmParticipants;

    const getStatusVariant = (status: CrmParticipant['status']) => {
        return status === 'Подтвержден' ? 'default' : 'secondary';
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Участники турнира</CardTitle>
                <CardDescription>Список зарегистрированных команд и спортсменов.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Команда/Игрок</TableHead>
                            <TableHead>Капитан</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participants.map(p => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium">{p.name}</TableCell>
                                <TableCell>{p.captain}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(p.status)}>{p.status}</Badge></TableCell>
                                <TableCell className="text-right space-x-1">
                                    <Button variant="ghost" size="icon"><Mail className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-red-500"><X className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-green-500"><Check className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
