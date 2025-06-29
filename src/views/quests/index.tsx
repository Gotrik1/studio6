
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import { CheckCircle, Circle, Award } from 'lucide-react';
import { quests } from '@/shared/lib/mock-data/gamification';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

export function QuestsPage() {
    const completedQuests = quests.filter(q => q.isCompleted).length;
    const totalQuests = quests.length;
    const completionPercentage = (completedQuests / totalQuests) * 100;
    const totalReward = quests.reduce((sum, q) => q.isCompleted ? sum + q.reward : sum, 0);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Квесты</h1>
                <p className="text-muted-foreground">
                    Выполняйте задания, чтобы заработать ProDvor Dollars (PD) и разблокировать достижения.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ваш прогресс</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">Выполнено квестов</span>
                            <span>{completedQuests} из {totalQuests}</span>
                        </div>
                        <Progress value={completionPercentage} />
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Заработано PD за квесты</span>
                        <span className="font-bold text-primary">{totalReward} PD</span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quests.map(quest => (
                    <Link key={quest.id} href={quest.isCompleted ? '#' : quest.href} className={cn("block h-full", quest.isCompleted && "pointer-events-none")}>
                        <Card className={cn("flex flex-col h-full transition-all hover:border-primary", quest.isCompleted ? 'opacity-60 bg-muted/50' : 'cursor-pointer hover:shadow-2xl')}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {quest.isCompleted ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                                    {quest.title}
                                </CardTitle>
                                <CardDescription>{quest.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <Badge variant="secondary" className="flex items-center gap-1.5 w-fit">
                                    <Award className="h-4 w-4 text-amber-500" />
                                    Награда: {quest.reward} PD
                                </Badge>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
