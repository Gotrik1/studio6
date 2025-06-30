
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { crmParticipants as initialParticipants, type CrmParticipant } from '@/shared/lib/mock-data/crm-participants';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Check, X, Mail, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useToast } from '@/shared/hooks/use-toast';

export function CrmTournamentParticipants() {
    const { toast } = useToast();
    const [participants, setParticipants] = useState<CrmParticipant[]>(initialParticipants);

    const applications = useMemo(() => participants.filter(p => p.status === 'Ожидает подтверждения'), [participants]);
    const confirmed = useMemo(() => participants.filter(p => p.status === 'Подтвержден'), [participants]);

    const handleAccept = (participantId: string) => {
        setParticipants(prev =>
            prev.map(p =>
                p.id === participantId ? { ...p, status: 'Подтвержден' } : p
            )
        );
        const participant = participants.find(p => p.id === participantId);
        if (participant) {
            toast({
                title: 'Заявка принята',
                description: `Команда "${participant.name}" была добавлена в список участников.`,
            });
        }
    };

    const handleDecline = (participantId: string) => {
        const participant = participants.find(p => p.id === participantId);
        setParticipants(prev => prev.filter(p => p.id !== participantId));
        if (participant) {
            toast({
                variant: 'destructive',
                title: 'Заявка отклонена',
                description: `Заявка от команды "${participant.name}" была отклонена.`,
            });
        }
    };
    
    const handleRemove = (participantId: string) => {
        const participant = participants.find(p => p.id === participantId);
        setParticipants(prev => prev.filter(p => p.id !== participantId));
         if (participant) {
            toast({
                variant: 'destructive',
                title: 'Участник удален',
                description: `Команда "${participant.name}" была удалена из турнира.`,
            });
        }
    }


    return (
        <Tabs defaultValue="applications">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="applications">Заявки на участие <Badge className="ml-2">{applications.length}</Badge></TabsTrigger>
                <TabsTrigger value="confirmed">Подтвержденные участники <Badge className="ml-2">{confirmed.length}</Badge></TabsTrigger>
            </TabsList>
            <TabsContent value="applications" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Заявки</CardTitle>
                        <CardDescription>Здесь отображаются команды, которые подали заявку на участие в турнире.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Команда/Игрок</TableHead>
                                    <TableHead>Капитан</TableHead>
                                    <TableHead className="text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.length > 0 ? applications.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>{p.captain}</TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleDecline(p.id)}><X className="h-4 w-4 text-red-500" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleAccept(p.id)}><Check className="h-4 w-4 text-green-500" /></Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24">Новых заявок нет</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="confirmed" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Участники</CardTitle>
                        <CardDescription>Список команд, участие которых было подтверждено.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Команда/Игрок</TableHead>
                                    <TableHead>Капитан</TableHead>
                                    <TableHead className="text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {confirmed.length > 0 ? confirmed.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>{p.captain}</TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button variant="ghost" size="icon"><Mail className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemove(p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                     <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24">Подтвержденных участников нет</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
