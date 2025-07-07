

'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { UserMinus, ShieldQuestion, Loader2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { useParams } from 'next/navigation';
import { getTeamBySlug, type TeamDetails } from '@/entities/team/api/teams';
import type { TeamRosterMember } from '@/entities/team/model/types';
import { Skeleton } from '@/shared/ui/skeleton';
import { removeMember, setCaptain } from '@/entities/team/api/teams';
import { useSession } from '@/shared/lib/session/client';


export function RosterManagementTab() {
    const { toast } = useToast();
    const params = useParams<{ slug: string }>();
    const { user: currentUser } = useSession();
    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const fetchTeam = useCallback(async () => {
        if (!params.slug) return;
        setIsLoading(true);
        const teamData = await getTeamBySlug(params.slug as string);
        setTeam(teamData);
        setIsLoading(false);
    }, [params.slug]);

    useEffect(() => {
        fetchTeam();
    }, [fetchTeam]);
    
    const handleRemovePlayer = (playerId: string, playerName: string) => {
        if (!team) return;
        startTransition(async () => {
            const result = await removeMember(team.id, playerId);
            if (result.success) {
                toast({ variant: 'destructive', title: 'Игрок исключен', description: `${playerName} был удален из состава команды.` });
                await fetchTeam();
            } else {
                toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
            }
        });
    };

    const handleMakeCaptain = (playerId: string, playerName: string) => {
        if (!team) return;
        startTransition(async () => {
             const result = await setCaptain(team.id, playerId);
             if (result.success) {
                toast({ title: 'Капитан назначен', description: `${playerName} теперь является капитаном команды.` });
                await fetchTeam();
             } else {
                  toast({ variant: 'destructive', title: 'Ошибка', description: result.error });
             }
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    if (!team) {
        return <p>Команда не найдена.</p>;
    }
    
    const roster: TeamRosterMember[] = team.roster;
    const isCurrentUserCaptain = currentUser?.id === team.captainId;

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
                            {isCurrentUserCaptain && <TableHead className="text-right">Действия</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roster.map((player) => (
                            <TableRow key={player.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Avatar className="h-8 w-8"><AvatarImage src={player.avatar || ''} /><AvatarFallback>{player.name.charAt(0)}</AvatarFallback></Avatar>
                                    {player.name}
                                </TableCell>
                                <TableCell>{player.id === team.captainId ? 'Капитан' : player.role}</TableCell>
                                {isCurrentUserCaptain && (
                                    <TableCell className="text-right space-x-1">
                                        <Button 
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleMakeCaptain(player.id, player.name)}
                                            disabled={player.id === team.captainId || isPending}
                                        >
                                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldQuestion className="mr-2 h-4 w-4" />}
                                            Сделать капитаном
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleRemovePlayer(player.id, player.name)}
                                            disabled={player.id === team.captainId || isPending}
                                        >
                                             {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserMinus className="mr-2 h-4 w-4" />}
                                             Исключить
                                        </Button>
                                    </TableCell>
                                )}
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
