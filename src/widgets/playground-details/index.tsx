
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import Image from 'next/image';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { MapPin, Check, Star, User, Home, Calendar, PlusCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { useToast } from '@/shared/hooks/use-toast';
import { format } from 'date-fns';
import { PlanGameDialog } from '@/widgets/plan-game-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { AiPlaygroundSummary } from '@/widgets/ai-playground-summary';
import { AiPlaygroundChallenge } from '@/widgets/ai-playground-challenge';
import { PlaygroundLeaderboard } from '@/widgets/playground-leaderboard';
import { AiPlaygroundLore } from '@/widgets/ai-playground-lore';
import { PlaygroundSchedule } from '@/widgets/playground-schedule';
import { PlaygroundActivityFeed } from '@/widgets/playground-activity-feed';
import { PlaygroundCheckInDialog } from '@/widgets/playground-check-in-dialog';
import { mockPlaygroundActivity, type PlaygroundActivity } from '@/shared/lib/mock-data/playground-activity';
import { useSession } from '@/shared/lib/session/client';
import { useLfg } from '@/app/providers/lfg-provider';
import type { LfgLobby } from '@/app/providers/lfg-provider';

export function PlaygroundDetails({ playground: initialPlayground }: { playground: Playground }) {
    const { user } = useSession();
    const { toast } = useToast();
    const { lobbies, addLobby } = useLfg();

    const [playground, setPlayground] = useState(initialPlayground);
    const [activities, setActivities] = useState<PlaygroundActivity[]>(mockPlaygroundActivity);
    const [isPlanGameOpen, setIsPlanGameOpen] = useState(false);
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);

    const schedule = useMemo(() => lobbies.filter(l => l.playgroundId === playground.id), [lobbies, playground.id]);

    const handleSetHome = () => {
        toast({
            title: 'Домашняя площадка установлена!',
            description: `Площадка "${playground.name}" теперь ваша домашняя.`
        });
    };

    const handlePlanGame = (data: { date: Date, time: string, duration: number }) => {
        if (!user) return;
        const startTime = new Date(data.date);
        const [hours, minutes] = data.time.split(':').map(Number);
        startTime.setHours(hours, minutes, 0, 0);
        
        addLobby({
            sport: playground.type,
            location: playground.name,
            playgroundId: playground.id,
            startTime,
            duration: data.duration,
            comment: `Открытая игра на площадке ${playground.name}`,
            playersNeeded: 10,
        });

        toast({
            title: "Игра запланирована!",
            description: `Ваша игра на "${playground.name}" в ${format(startTime, 'HH:mm')} добавлена в расписание и LFG.`
        });
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <AiPlaygroundSummary playground={playground} />
                        <PlaygroundSchedule schedule={schedule} onPlanClick={() => setIsPlanGameOpen(true)} />
                        <PlaygroundActivityFeed activities={activities} />
                    </div>
                    <div className="space-y-6">
                        <Button className="w-full" size="lg" onClick={() => setIsCheckInOpen(true)}>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Отметиться (чекин)
                        </Button>
                        <AiPlaygroundChallenge playground={playground} />
                        <AiPlaygroundLore playground={playground} />
                        <PlaygroundLeaderboard />
                        <Card>
                           <CardHeader><CardTitle>Основная информация</CardTitle></CardHeader>
                           <CardContent className="space-y-3 text-sm">
                               <div className="flex justify-between"><span>Покрытие:</span><span className="font-semibold">{playground.surface}</span></div>
                               <div className="flex justify-between"><span>Рейтинг:</span><span className="font-semibold flex items-center gap-1">{playground.rating}/5.0 <Star className="h-4 w-4 text-amber-500"/></span></div>
                               <div className="flex justify-between"><span>Чекинов:</span><span className="font-semibold">{playground.checkIns}</span></div>
                               <div>
                                   <p>Особенности:</p>
                                   <div className="flex flex-wrap gap-2 mt-1">
                                       {playground.features.map(f => <Badge key={f}>{f}</Badge>)}
                                   </div>
                               </div>
                           </CardContent>
                         </Card>
                         <Card>
                           <CardHeader><CardTitle>Создатель</CardTitle></CardHeader>
                           <CardContent className="flex items-center gap-3">
                               <Avatar><AvatarImage src={playground.creator.avatar} /><AvatarFallback><User className="h-5 w-5"/></AvatarFallback></Avatar>
                               <p className="font-semibold">{playground.creator.name}</p>
                           </CardContent>
                         </Card>
                         <div className="space-y-2">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="w-full"><Home className="mr-2 h-4 w-4"/> Сделать домашней</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Вы собираетесь отметить эту площадку как вашу "домашнюю". Помните, что это общественное место. В случае препятствования играм других команд (физически, угрозами или иным способом), ваша команда и все ее участники будут дисквалифицированы на срок от 1 года до пожизненного.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSetHome}>Подтвердить</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                         </div>
                    </div>
                </div>
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
