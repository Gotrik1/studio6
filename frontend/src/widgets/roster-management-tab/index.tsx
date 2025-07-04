
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { UserMinus, ShieldQuestion } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { teamRoster as initialRoster } from '@/shared/lib/mock-data/team-details';

type RosterPlayer = (typeof initialRoster)[0];

export function RosterManagementTab() {
    const { toast } = useToast();
    const [roster, setRoster] = useState<RosterPlayer[]>(initialRoster);

    const handleRemovePlayer = (playerId: number, playerName: string) => {
        setRoster(prev => prev.filter(p => p.id !== playerId));
        toast({
            variant: 'destructive',
            title: 'Игрок исключен',
            description: `${playerName} был удален из состава команды.`,
        });
    };

    const handleMakeCaptain = (playerName: string) => {
        toast({
            title: 'Капитан назначен',
            description: `${playerName} теперь является капитаном команды.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Управление составом</CardTitle>
                <CardDescription>Управление текущими игроками вашей команды.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Игрок</TableHead>
                            <TableHead>Роль</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roster.map(player => (
                            <TableRow key={player.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Avatar className="h-8 w-8"><AvatarImage src={player.avatar} /><AvatarFallback>{player.name.charAt(0)}</AvatarFallback></Avatar>
                                    {player.name}
                                </TableCell>
                                <TableCell>{player.role}</TableCell>
                                <TableCell className="text-right space-x-1">
                                    <Button variant="outline" size="sm" onClick={() => handleMakeCaptain(player.name)} disabled={player.role.includes('Капитан')}>
                                        <ShieldQuestion className="mr-2 h-4 w-4" /> Сделать капитаном
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleRemovePlayer(player.id, player.name)} disabled={player.role.includes('Капитан')}>
                                        <UserMinus className="mr-2 h-4 w-4" /> Исключить
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            {roster.length === 0 && (
                <CardFooter className="text-center text-muted-foreground justify-center">
                    В команде нет игроков.
                </CardFooter>
            )}
        </Card>
    );
}
