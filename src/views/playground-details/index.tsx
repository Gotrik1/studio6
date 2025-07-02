'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/card';
import Image from 'next/image';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { MapPin } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { PlusCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { playgroundSchedule, type PlaygroundBooking } from '@/shared/lib/mock-data/playground-schedule';
import { PlanGameDialog } from '@/widgets/plan-game-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { PlaygroundCheckInDialog } from '@/widgets/playground-check-in-dialog';
import { mockPlaygroundActivity, type PlaygroundActivity } from '@/shared/lib/mock-data/playground-activity';
import { useSession } from '@/shared/lib/session/client';
import { usePDEconomy } from '@/app/providers/pd-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { PlaygroundOverviewTab } from '@/widgets/playground-overview-tab';
import { PlaygroundActivityTab } from '@/widgets/playground-activity-tab';
import { PlaygroundLeaderboardTab } from '@/widgets/playground-leaderboard-tab';
import { PlaygroundMediaTab } from '@/widgets/playground-media-tab';

export function PlaygroundDetailsPage({ playground: initialPlayground }: { playground: Playground }) {
    const { user } = useSession();
    const { toast } = useToast();
    const { addTransaction } = usePDEconomy();
    const [playground, setPlayground] = useState(initialPlayground);
    const [schedule, setSchedule] = useState(playgroundSchedule.filter(s => s.playgroundId === playground.id));
    const [activities, setActivities] = useState<PlaygroundActivity[]>(mockPlaygroundActivity);
    const [isPlanGameOpen, setIsPlanGameOpen] = useState(false);
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);

    const handlePlanGame = (data: { date: Date, time: string, duration: number }) => {
        const [hours, minutes] = data.time.split(':').map(Number);
        const startTime = new Date(data.date);
        startTime.setHours(hours, minutes, 0, 0);
        
        const endTime = new Date(startTime.getTime() + data.duration * 60000);

        const newBooking: PlaygroundBooking = {
            id: `booking-${Date.now()}`,
            playgroundId: playground.id,
            team: { name: 'Ваша команда', avatar: 'https://placehold.co/100x100.png', avatarHint: 'user team logo' },
            startTime,
            endTime,
        };
        setSchedule(prev => [...prev, newBooking].sort((a,b) => a.startTime.getTime() - b.startTime.getTime()));
    };

    const handleCheckIn = (comment: string) => {
        if (!user) return;
        const newActivity: PlaygroundActivity = {
            id: `act-${Date.now()}`,
            user: { name: user.name, avatar: user.avatar },
            comment,
            timestamp: 'Только что',
        };
        setActivities(prev => [newActivity, ...prev]);
        setPlayground(prev => ({...prev, checkIns: prev.checkIns + 1}));
        
        const checkInReward = 10;
        addTransaction(`Чекин: ${playground.name}`, checkInReward);

        toast({
            title: "Вы отметились!",
            description: `Ваш чекин на площадке "${playground.name}" засчитан. Вы получили ${checkInReward} PD!`
        });
    };

    return (
        <>
            <div className="space-y-6">
                <Card className="overflow-hidden">
                    <div className="relative h-64 w-full">
                        <Image src={playground.coverImage} alt={playground.name} fill className="object-cover" data-ai-hint={playground.coverImageHint}/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <Badge variant="secondary">{playground.type}</Badge>
                            <h1 className="font-headline text-4xl font-bold mt-1">{playground.name}</h1>
                            <p className="flex items-center gap-2 mt-1"><MapPin className="h-4 w-4" /> {playground.address}</p>
                        </div>
                    </div>
                </Card>

                 {playground.status === 'pending_moderation' && (
                    <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/50 text-yellow-600 [&>svg]:text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>На модерации</AlertTitle>
                        <AlertDescription>
                            Эта площадка ожидает проверки модератором. Она может быть удалена, если является дубликатом или нарушает правила.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="w-full sm:w-auto" size="lg" onClick={() => setIsCheckInOpen(true)}>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Отметиться (чекин)
                    </Button>
                    <Button className="w-full sm:w-auto" size="lg" variant="outline" onClick={() => setIsPlanGameOpen(true)}>
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Запланировать игру
                    </Button>
                </div>

                <Tabs defaultValue="overview">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Обзор</TabsTrigger>
                        <TabsTrigger value="activity">Активность</TabsTrigger>
                        <TabsTrigger value="leaderboard">Лидеры</TabsTrigger>
                        <TabsTrigger value="media">Медиа</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-4">
                        <PlaygroundOverviewTab playground={playground} />
                    </TabsContent>
                    <TabsContent value="activity" className="mt-4">
                         <PlaygroundActivityTab schedule={schedule} activities={activities} onPlanClick={() => setIsPlanGameOpen(true)} />
                    </TabsContent>
                    <TabsContent value="leaderboard" className="mt-4">
                        <PlaygroundLeaderboardTab playground={playground} />
                    </TabsContent>
                    <TabsContent value="media" className="mt-4">
                        <PlaygroundMediaTab />
                    </TabsContent>
                </Tabs>
            </div>
            <PlanGameDialog 
                isOpen={isPlanGameOpen}
                onOpenChange={setIsPlanGameOpen}
                playgroundName={playground.name}
                onPlan={handlePlanGame}
            />
            <PlaygroundCheckInDialog
                isOpen={isCheckInOpen}
                onOpenChange={setIsCheckInOpen}
                playgroundName={playground.name}
                onCheckIn={handleCheckIn}
            />
        </>
    );
}
