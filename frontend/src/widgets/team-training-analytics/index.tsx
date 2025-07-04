'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Progress } from '@/shared/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { teamTrainingAnalyticsData } from '@/shared/lib/mock-data/team-training-analytics';

const StatCard = ({ title, value, icon: Icon, description }: { title: string, value: string, icon: React.ElementType, description: string }) => (
    <Card>
        <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
                <span>{title}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{value}</CardTitle>
        </CardHeader>
        <CardContent>
             <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);


export function TeamTrainingAnalytics() {
    const overallAdherence = teamTrainingAnalyticsData.reduce((acc, player) => acc + player.adherence, 0) / teamTrainingAnalyticsData.length;
    const mostDiligent = teamTrainingAnalyticsData.reduce((prev, current) => (prev.adherence > current.adherence) ? prev : current);
    const leastDiligent = teamTrainingAnalyticsData.reduce((prev, current) => (prev.adherence < current.adherence) ? prev : current);
    
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Общая посещаемость" value={`${overallAdherence.toFixed(0)}%`} icon={CheckCircle} description="Процент выполненых тренировок" />
                <StatCard title="Самый усердный" value={mostDiligent.playerName} icon={TrendingUp} description={`${mostDiligent.adherence}% посещаемости`} />
                <StatCard title="Нуждается во внимании" value={leastDiligent.playerName} icon={TrendingDown} description={`${leastDiligent.adherence}% посещаемости`} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Прогресс игроков</CardTitle>
                    <CardDescription>Отслеживайте выполнение назначенных программ каждым игроком.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Игрок</TableHead>
                                <TableHead>Программа</TableHead>
                                <TableHead>Посещаемость</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamTrainingAnalyticsData.map(player => (
                                <TableRow key={player.playerId}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={player.avatar} alt={player.playerName} />
                                                <AvatarFallback>{player.playerName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{player.playerName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{player.assignedProgram}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={player.adherence} className="w-24 h-2" />
                                            <span className="text-sm font-medium">{player.adherence}%</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
