
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import { CheckCircle, Circle, Award } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { useSession } from '@/shared/lib/session/client';
import { getOnboardingSuggestions, type OnboardingOutput } from '@/shared/api/genkit/flows/onboarding-assistant-flow';
import { Skeleton } from '@/shared/ui/skeleton';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: { [key: string]: LucideIcon } = LucideIcons as any;

const QuestSkeleton = () => (
    <>
        <Card>
            <CardHeader><CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
    </>
);

export function QuestsPage() {
    const { user, loading: userLoading } = useSession();
    const [questsData, setQuestsData] = useState<OnboardingOutput['suggestions'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getOnboardingSuggestions({ userName: user.name, userRole: user.role })
                .then((data) => setQuestsData(data.suggestions))
                .catch(console.error)
                .finally(() => setIsLoading(false));
        } else if (!userLoading) {
            setIsLoading(false);
        }
    }, [user, userLoading]);

    // Mock completion status for demo purposes
    const completedQuests = questsData ? Math.floor(questsData.length / 2) : 0;
    const totalQuests = questsData ? questsData.length : 0;
    const completionPercentage = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;
    const totalReward = questsData ? questsData.slice(0, completedQuests).reduce((sum, q) => sum + (parseInt(q.reward?.replace('+', '').replace(' PD', '')) || 0), 0) : 0;

    if (userLoading || isLoading) {
        return (
            <div className="space-y-6">
                 <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Квесты</h1>
                    <p className="text-muted-foreground">
                        Выполняйте персонализированные задания, чтобы заработать ProDvor Dollars (PD) и разблокировать достижения.
                    </p>
                </div>
                <QuestSkeleton />
            </div>
        )
    }
    
    if (!questsData) {
        return (
             <div className="space-y-6">
                 <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Квесты</h1>
                    <p className="text-muted-foreground">
                        Выполняйте персонализированные задания, чтобы заработать ProDvor Dollars (PD) и разблокировать достижения.
                    </p>
                </div>
                <Card className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Не удалось загрузить квесты.</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Квесты</h1>
                <p className="text-muted-foreground">
                    Выполняйте персонализированные задания, чтобы заработать ProDvor Dollars (PD) и разблокировать достижения.
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
                {questsData.map((quest, index) => {
                    const isCompleted = index < completedQuests; // Mock logic
                    const Icon = iconMap[quest.icon] || LucideIcons.HelpCircle;
                    return (
                    <Link key={quest.title} href={isCompleted ? '#' : quest.href} className={cn("block h-full", isCompleted && "pointer-events-none")}>
                        <Card className={cn("flex flex-col h-full transition-all hover:border-primary", isCompleted ? 'opacity-60 bg-muted/50' : 'cursor-pointer hover:shadow-2xl')}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {isCompleted ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                                    {quest.title}
                                </CardTitle>
                                <CardDescription>{quest.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                {quest.reward && (
                                    <Badge variant="secondary" className="flex items-center gap-1.5 w-fit">
                                        <Award className="h-4 w-4 text-amber-500" />
                                        Награда: {quest.reward}
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    </Link>
                )})}
            </div>
        </div>
    );
}
