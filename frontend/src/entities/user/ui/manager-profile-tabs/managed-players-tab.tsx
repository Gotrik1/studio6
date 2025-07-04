
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import Link from 'next/link';

// Mock data, in a real app this would be passed as a prop
import { userList } from "@/shared/lib/mock-data/users";

const managedPlayers = userList.slice(0, 3).map(u => ({
    ...u,
    game: 'Valorant', // Add mock game
}));

export function ManagedPlayersTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Управляемые игроки</CardTitle>
                <CardDescription>Список игроков, находящихся под вашим управлением.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Игрок</TableHead>
                            <TableHead className="hidden md:table-cell">Дисциплина</TableHead>
                            <TableHead className="text-right">Действие</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {managedPlayers.map((player) => (
                            <TableRow key={player.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={player.avatar} alt={player.name} />
                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{player.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{player.game}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={player.profileUrl}>Профиль</Link>
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
