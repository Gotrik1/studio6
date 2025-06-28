
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Coins, CheckCircle, ClipboardList } from "lucide-react";
import { dailyQuests as initialDailyQuests, weeklyQuests as initialWeeklyQuests, eventQuests as initialEventQuests, type Quest } from "@/lib/mock-data/quests";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function QuestCard({ quest, onClaim }: { quest: Quest, onClaim: (questId: string, type: Quest['type']) => void }) {
    const progressPercentage = (quest.currentProgress / quest.goal) * 100;
    const isCompleted = quest.currentProgress >= quest.goal;
    
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <quest.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <CardTitle>{quest.title}</CardTitle>
                    <CardDescription>{quest.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
                <Progress value={progressPercentage} />
                <div className="text-sm text-muted-foreground flex justify-between">
                    <span>Прогресс: {quest.currentProgress} / {quest.goal}</span>
                    <Badge variant="secondary" className="flex items-center gap-1"><Coins className="h-3 w-3" />+{quest.reward} PD</Badge>
                </div>
            </CardContent>
            <CardFooter>
                 <Button 
                    className="w-full"
                    disabled={!isCompleted || quest.isClaimed}
                    onClick={() => onClaim(quest.id, quest.type)}
                >
                    {quest.isClaimed ? (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Награда получена
                        </>
                    ) : isCompleted ? (
                        'Забрать награду'
                    ) : (
                        'В процессе'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}


export default function QuestsPage() {
    const { toast } = useToast();
    const [dailyQuests, setDailyQuests] = useState(initialDailyQuests);
    const [weeklyQuests, setWeeklyQuests] = useState(initialWeeklyQuests);
    const [eventQuests, setEventQuests] = useState(initialEventQuests);

    const handleClaimQuest = (questId: string, type: Quest['type']) => {
        let questList: Quest[] = [];
        let setQuestList: React.Dispatch<React.SetStateAction<Quest[]>> = () => {};

        switch (type) {
            case 'daily':
                questList = dailyQuests;
                setQuestList = setDailyQuests;
                break;
            case 'weekly':
                questList = weeklyQuests;
                setQuestList = setWeeklyQuests;
                break;
            case 'event':
                 questList = eventQuests;
                setQuestList = setEventQuests;
                break;
        }
        
        const quest = questList.find(q => q.id === questId);

        if (quest && quest.currentProgress >= quest.goal && !quest.isClaimed) {
            setQuestList(prev => prev.map(q => q.id === questId ? { ...q, isClaimed: true } : q));
            toast({
                title: (
                  <div className="flex items-center">
                      <Coins className="mr-2 h-5 w-5 text-amber-400" />
                      <span>Награда получена!</span>
                  </div>
                ),
                description: `Вы получили +${quest.reward} PD за выполнение задания "${quest.title}".`,
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
                    <ClipboardList className="h-8 w-8 text-primary" />
                    Квесты и Задания
                </h1>
                <p className="text-muted-foreground">
                   Выполняйте задания, чтобы получать награды и ускорять свой прогресс на платформе.
                </p>
            </div>
            
            <Tabs defaultValue="daily" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="daily">Ежедневные</TabsTrigger>
                    <TabsTrigger value="weekly">Еженедельные</TabsTrigger>
                    <TabsTrigger value="event">Событийные</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="mt-4">
                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {dailyQuests.map(quest => <QuestCard key={quest.id} quest={quest} onClaim={handleClaimQuest} />)}
                    </div>
                </TabsContent>
                <TabsContent value="weekly" className="mt-4">
                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {weeklyQuests.map(quest => <QuestCard key={quest.id} quest={quest} onClaim={handleClaimQuest} />)}
                    </div>
                </TabsContent>
                <TabsContent value="event" className="mt-4">
                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {eventQuests.map(quest => <QuestCard key={quest.id} quest={quest} onClaim={handleClaimQuest} />)}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
