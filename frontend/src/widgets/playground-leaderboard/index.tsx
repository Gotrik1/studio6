
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Trophy, CheckCircle } from 'lucide-react';


export function PlaygroundLeaderboard() {
    // This data would be fetched based on playground ID.
    // For now, it will be empty.
    const leaderboardData: any[] = [];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Лидеры площадки
                </CardTitle>
                <CardDescription>Топ-3 игрока по количеству чекинов на этой площадке.</CardDescription>
            </CardHeader>
            <CardContent>
                {leaderboardData.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead>Игрок</TableHead>
                                <TableHead className="text-center">Отметки</TableHead>
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
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                        <p>Данные о лидерах пока отсутствуют.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
