
'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/shared/ui/card';
import Image from 'next/image';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { MapPin, CheckCircle, AlertTriangle, MessageSquare, Users, Calendar, Wrench, Camera, BrainCircuit } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { PlaygroundOverviewTab } from '@/widgets/playground-overview-tab';
import { PlaygroundActivityTab } from '@/widgets/playground-activity-tab';
import { PlaygroundLeaderboardTab } from '@/widgets/playground-leaderboard-tab';
import { ReportPlaygroundIssueDialog } from '@/widgets/report-playground-issue-dialog';
import { PlaygroundConditionStatus } from '@/widgets/playground-condition-status';
import { analyzePlaygroundReport, type AnalyzePlaygroundReportOutput } from '@/shared/api/genkit/flows/analyze-playground-report-flow';
import { useToast } from '@/shared/hooks/use-toast';
import { PlaygroundCheckInDialog } from '@/widgets/playground-check-in-dialog';
import { mockPlaygroundActivity, type PlaygroundActivity } from '@/shared/lib/mock-data/playground-activity';
import { useSession } from '@/shared/lib/session/client';
import { PlaygroundReviewsTab } from '@/widgets/playground-reviews-tab';
import { PlaygroundScheduleTab } from '@/widgets/playground-schedule-tab';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { useLfg } from '@/app/providers/lfg-provider';
import type { FormValues } from '@/widgets/plan-game-dialog';
import { PlanGameDialog } from '@/widgets/plan-game-dialog';
import { format } from 'date-fns';
import { PlaygroundMediaTab } from '@/widgets/playground-media-tab';
import { AiPlaygroundAnalysis } from '@/widgets/ai-playground-analysis';
import { AiPlaygroundLore } from '@/widgets/ai-playground-lore';
import { PlaygroundWorkoutGenerator } from '@/widgets/playground-workout-generator';
import { AiPlaygroundTactic } from '@/widgets/ai-playground-tactic';
import { AiPlaygroundDrill } from '@/widgets/ai-playground-drill';
import { usePDEconomy } from '@/app/providers/pd-provider';


export default function PlaygroundDetailsPage({ playground }: { playground: Playground }) {
    const { user } = useSession();
    const { toast } = useToast();
    const { lobbies, addLobby } = useLfg();
    const { addTransaction } = usePDEconomy();
    const [activities, setActivities] = useState<PlaygroundActivity[]>(mockPlaygroundActivity);
    const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
    const [conditionReport, setConditionReport] = useState<AnalyzePlaygroundReportOutput | null>(null);
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);
    const [isPlanGameOpen, setIsPlanGameOpen] = useState(false);
    const [dialogInitialData, setDialogInitialData] = useState<{ date: Date, time: string } | undefined>();

    const schedule = useMemo(() => lobbies.filter(l => l.playgroundId === playground.id), [lobbies, playground.id]);

    const handleReportSubmit = async (data: { category: string; comment: string }) => {
        try {
            const report = await analyzePlaygroundReport({
                playgroundName: playground.name,
                issueCategory: data.category,
                userComment: data.comment,
            });
            setConditionReport(report);
            toast({
                title: "Спасибо за ваше сообщение!",
                description: "Информация о состоянии площадки была обновлена.",
            });
        } catch (e) {
            console.error(e);
            toast({
                variant: 'destructive',
                title: "Ошибка",
                description: "Не удалось отправить отчет. Попробуйте позже."
            });
        }
    };
    
    const handleCheckIn = (comment: string, photo?: File) => {
        if (!user) return;
        const newActivity: PlaygroundActivity = {
            id: `act-${Date.now()}`,
            user: { name: user.name, avatar: user.avatar },
            comment,
            timestamp: 'Только что',
            photo: photo ? 'https://placehold.co/600x400.png' : undefined, // Use placeholder for demo
            photoHint: 'user uploaded photo',
        };
        setActivities(prev => [newActivity, ...prev]);
        
        addTransaction(`Чекин: ${playground.name}`, 10);
        
        toast({
            title: "Вы отметились!",
            description: `Вы получили 10 PD за отметку на площадке "${playground.name}".`
        });
    };
    
    const handlePlanGame = (data: FormValues) => {
        if (!user) return;
        const startTime = new Date(data.date);
        const [hours, minutes] = data.time.split(':').map(Number);
        startTime.setHours(hours, minutes, 0, 0);

        addLobby({
            sport: playground.type,
            location: playground.name,
            playgroundId: playground.id,
            startTime: startTime,
            duration: data.duration,
            comment: `Открытая игра на площадке ${playground.name}`,
            playersNeeded: 10,
        });
        
        toast({
            title: "Игра запланирована!",
            description: `Ваша игра на "${playground.name}" в ${format(startTime, 'HH:mm')} добавлена в расписание и LFG.`
        });
    };

    const handleOpenPlanDialog = (date: Date, hour: number) => {
        setDialogInitialData({ date, time: `${String(hour).padStart(2, '0')}:00` });
        setIsPlanGameOpen(true);
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
                        Отметиться
                    </Button>
                     <Button className="w-full sm:w-auto" size="lg" variant="destructive" onClick={() => setIsReportIssueOpen(true)}>
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Сообщить о проблеме
                    </Button>
                </div>

                <Tabs defaultValue="overview">
                    <ScrollArea className="w-full whitespace-nowrap rounded-md">
                        <TabsList className="inline-flex">
                            <TabsTrigger value="overview">Обзор</TabsTrigger>
                            <TabsTrigger value="ai-assistant"><BrainCircuit className="mr-2 h-4 w-4"/>AI Помощник</TabsTrigger>
                            <TabsTrigger value="schedule"><Calendar className="mr-2 h-4 w-4"/>Расписание</TabsTrigger>
                            <TabsTrigger value="activity">Активность</TabsTrigger>
                            <TabsTrigger value="leaderboard"><Users className="mr-2 h-4 w-4"/>Лидеры</TabsTrigger>
                            <TabsTrigger value="reviews"><MessageSquare className="mr-2 h-4 w-4"/>Отзывы</TabsTrigger>
                            <TabsTrigger value="media"><Camera className="mr-2 h-4 w-4"/>Медиа</TabsTrigger>
                            <TabsTrigger value="condition"><Wrench className="mr-2 h-4 w-4"/>Состояние</TabsTrigger>
                        </TabsList>
                    </ScrollArea>
                    <TabsContent value="overview" className="mt-4">
                        <PlaygroundOverviewTab playground={playground} />
                    </TabsContent>
                    
                    <TabsContent value="ai-assistant" className="mt-4">
                        <div className="space-y-6">
                             <AiPlaygroundAnalysis playground={playground} />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AiPlaygroundLore playground={playground} />
                                <PlaygroundWorkoutGenerator playground={playground} />
                                <AiPlaygroundTactic playground={playground} />
                                <AiPlaygroundDrill playground={playground} />
                             </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="schedule" className="mt-4">
                         <PlaygroundScheduleTab
                            schedule={schedule}
                            onPlanClick={handleOpenPlanDialog}
                         />
                    </TabsContent>
                    <TabsContent value="activity" className="mt-4">
                        <PlaygroundActivityTab activities={activities} />
                    </TabsContent>
                    <TabsContent value="leaderboard" className="mt-4">
                        <PlaygroundLeaderboardTab />
                    </TabsContent>
                     <TabsContent value="reviews" className="mt-4">
                        <PlaygroundReviewsTab playground={playground} />
                    </TabsContent>
                    <TabsContent value="media" className="mt-4">
                        <PlaygroundMediaTab />
                    </TabsContent>
                     <TabsContent value="condition" className="mt-4">
                        <PlaygroundConditionStatus
                            status={conditionReport ? 'issue' : 'ok'}
                            report={conditionReport || undefined}
                        />
                    </TabsContent>
                </Tabs>
            </div>
            <ReportPlaygroundIssueDialog
                isOpen={isReportIssueOpen}
                onOpenChange={setIsReportIssueOpen}
                playgroundName={playground.name}
                onReportSubmit={handleReportSubmit}
            />
            <PlaygroundCheckInDialog
                isOpen={isCheckInOpen}
                onOpenChange={setIsCheckInOpen}
                playgroundName={playground.name}
                onCheckIn={handleCheckIn}
            />
            <PlanGameDialog
                isOpen={isPlanGameOpen}
                onOpenChange={setIsPlanGameOpen}
                playgroundName={playground.name}
                onPlan={handlePlanGame}
                initialDate={dialogInitialData?.date}
                initialTime={dialogInitialData?.time}
            />
        </>
    );
}
