
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { useToast } from '@/shared/hooks/use-toast';
import { quests as initialQuests, type Quest } from '@/shared/config/gamification';
import { Award, Check, Repeat, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePDEconomy } from '@/app/providers/pd-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

function QuestCard({ quest, onClaim, claimed }: { quest: Quest, onClaim: (id: string, reward: number) => void, claimed: boolean }) {
    const isCompleted = quest.progress >= quest.goal;
    
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{quest.title}</CardTitle>
                {quest.description && <CardDescription>{quest.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Progress value={(quest.progress / quest.goal) * 100} />
                    <span>{quest.progress}/{quest.goal}</span>
                </div>
                 <div className="flex items-center gap-2 font-bold text-amber-500">
                    <Award className="h-5 w-5" />
                    <span>Награда: {quest.reward} PD</span>
                </div>
            </CardContent>
            <CardFooter>
                {quest.href && !isCompleted && (
                    <Button asChild variant="secondary" className="w-full">
                        <Link href={quest.href}>Перейти к выполнению</Link>
                    </Button>
                )}
                {isCompleted && (
                     <Button onClick={() => onClaim(quest.id, quest.reward)} disabled={claimed} className="w-full">
                        {claimed ? <><Check className="mr-2 h-4 w-4"/>Получено</> : "Забрать награду"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

function QuestsSection({ title, quests, onClaim, claimedQuests }: { title: string, quests: Quest[], onClaim: (id: string, reward: number) => void, claimedQuests: Set<string> }) {
    if (quests.length === 0) return null;
    return (
        <div className="space-y-4">
            <h2 className="font-headline text-2xl font-bold">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quests.map(quest => (
                    <QuestCard key={quest.id} quest={quest} onClaim={onClaim} claimed={claimedQuests.has(quest.id)} />
                ))}
            </div>
        </div>
    );
}


export function QuestsPage() {
    const { toast } = useToast();
    const { addTransaction } = usePDEconomy();
    const [quests, setQuests] = useState(initialQuests);
    const [claimedQuests, setClaimedQuests] = useState<Set<string>>(new Set(initialQuests.special.filter(q => q.progress >= q.goal).map(q => q.id)));

    const handleClaimReward = (questId: string, reward: number) => {
        setClaimedQuests(prev => new Set(prev).add(questId));
        addTransaction(`Награда за квест`, reward);
        const quest = [...quests.daily, ...quests.weekly, ...quests.special].find(q => q.id === questId);
        toast({
            title: `Награда получена!`,
            description: `Вы получили ${reward} PD за выполнение квеста "${quest?.title}".`
        });
    };
    
    // In a real app, this would be a server-side reset based on cron jobs
    const handleResetDailies = () => {
        setQuests(prev => ({
            ...prev,
            daily: prev.daily.map(q => ({...q, progress: 0}))
        }));
        // Remove daily quests from claimed set
        const dailyIds = new Set(quests.daily.map(q => q.id));
        setClaimedQuests(prev => new Set([...prev].filter(id => !dailyIds.has(id))));
        toast({ title: 'Ежедневные квесты обновлены!' });
    }

    return (
         <div className="space-y-8 opacity-0 animate-fade-in-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-primary"/>
                        Центр Квестов
                    </h1>
                    <p className="text-muted-foreground">
                        Выполняйте задания, чтобы заработать ProDvor Dollars (PD) и разблокировать достижения.
                    </p>
                </div>
                <Button variant="outline" onClick={handleResetDailies}>
                    <Repeat className="mr-2 h-4 w-4" />
                    Обновить ежедневные квесты (демо)
                </Button>
            </div>
            
            <Tabs defaultValue="daily">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="daily">Ежедневные</TabsTrigger>
                    <TabsTrigger value="weekly">Еженедельные</TabsTrigger>
                    <TabsTrigger value="special">Специальные</TabsTrigger>
                </TabsList>
                <TabsContent value="daily" className="mt-6">
                    <QuestsSection title="Ежедневные" quests={quests.daily} onClaim={handleClaimReward} claimedQuests={claimedQuests} />
                </TabsContent>
                <TabsContent value="weekly" className="mt-6">
                    <QuestsSection title="Еженедельные" quests={quests.weekly} onClaim={handleClaimReward} claimedQuests={claimedQuests} />
                </TabsContent>
                <TabsContent value="special" className="mt-6">
                    <QuestsSection title="Специальные" quests={quests.special} onClaim={handleClaimReward} claimedQuests={claimedQuests} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
