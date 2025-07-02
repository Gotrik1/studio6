'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Trophy, CheckCircle } from 'lucide-react';

// Mock data, in a real app this would come from an API based on playground ID
const leaderboardData = [
    { rank: 1, name: 'Superuser', checkIns: 45, wins: 30, avatar: 'https://placehold.co/40x40.png' },
    { rank: 2, name: 'Echo', checkIns: 38, wins: 25, avatar: 'https://placehold.co/40x40.png' },
    { rank: 3, name: 'Viper', checkIns: 32, wins: 22, avatar: 'https://placehold.co/40x40.png' },
];

export function PlaygroundLeaderboard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Короли площадки
                </CardTitle>
                <CardDescription>Топ-3 игрока по активности и победам на этой площадке.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Игрок</TableHead>
                            <TableHead className="text-center">Чекины</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboardData.map((player) => (
                            <TableRow key={player.rank}>
                                <TableCell className="font-bold text-lg">{player.rank}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={player.avatar} alt={player.name} />
                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{player.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-mono">
                                    <div className="flex items-center justify-center gap-1">
                                         <CheckCircle className="h-4 w-4 text-green-500" />
                                        {player.checkIns}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
