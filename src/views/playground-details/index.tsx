
'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/card';
import Image from 'next/image';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { MapPin, Wrench, CheckCircle, AlertTriangle, MessageSquare, Star, Users, Calendar } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { PlaygroundOverviewTab } from '@/widgets/playground-overview-tab';
import { PlaygroundActivityTab } from '@/widgets/playground-activity-tab';
import { PlaygroundLeaderboardTab } from '@/widgets/playground-leaderboard-tab';
import { PlaygroundMediaTab } from '@/widgets/playground-media-tab';
import { ReportPlaygroundIssueDialog } from '@/widgets/report-playground-issue-dialog';
import { PlaygroundConditionStatus } from '@/widgets/playground-condition-status';
import { analyzePlaygroundReport, type AnalyzePlaygroundReportOutput } from '@/shared/api/genkit/flows/analyze-playground-report-flow';
import { PlaygroundWorkoutGenerator } from '@/widgets/playground-workout-generator';
import { PlaygroundReviewsTab } from '@/widgets/playground-reviews-tab';
import { PlanGameDialog } from '@/widgets/plan-game-dialog';
import { PlaygroundCheckInDialog } from '@/widgets/playground-check-in-dialog';
import { mockPlaygroundActivity, type PlaygroundActivity } from '@/shared/lib/mock-data/playground-activity';
import { playgroundSchedule as initialSchedule, type PlaygroundBooking } from '@/shared/lib/mock-data/playground-schedule';
import { useSession } from '@/shared/lib/session/client';
import { useToast } from '@/shared/hooks/use-toast';
import { PlaygroundScheduleTab } from '@/widgets/playground-schedule-tab';


export default function PlaygroundDetailsPage({ playground: initialPlayground }: { playground: Playground }) {
    const { user } = useSession();
    const { toast } = useToast();
    const [playground, setPlayground] = useState(initialPlayground);
    const [schedule, setSchedule] = useState(initialSchedule.filter(s => s.playgroundId === playground.id));
    const [activities, setActivities] = useState<PlaygroundActivity[]>(mockPlaygroundActivity);
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);
    const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
    const [conditionReport, setConditionReport] = useState<AnalyzePlaygroundReportOutput | null>(null);

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
        // addTransaction(`Чекин: ${playground.name}`, checkInReward);

        toast({
            title: "Вы отметились!",
            description: `Ваш чекин на площадке "${playground.name}" засчитан. Вы получили ${checkInReward} PD!`
        });
    };

    const handleReportSubmit = async (data: { category: string; comment: string }) => {
        toast({
            title: "Спасибо за ваше сообщение!",
            description: "Начинаем анализ проблемы с помощью AI...",
        });

        try {
            const analysis = await analyzePlaygroundReport({
                playgroundName: initialPlayground.name,
                issueCategory: data.category,
                userComment: data.comment,
            });
            setConditionReport(analysis);
            toast({
                title: "Проблема зарегистрирована",
                description: `Статус площадки обновлен. AI-анализ: "${analysis.summary}".`
            });
        } catch (e) {
            toast({
                variant: 'destructive',
                title: 'Ошибка анализа',
                description: 'Не удалось обработать ваше сообщение. Попробуйте позже.',
            });
        }
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
                     <Button className="w-full sm:w-auto" size="lg" variant="destructive" onClick={() => setIsReportIssueOpen(true)}>
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Сообщить о проблеме
                    </Button>
                </div>

                {playground.type === 'Воркаут' && (
                    <PlaygroundWorkoutGenerator equipment={playground.features} />
                )}

                <Tabs defaultValue="overview">
                    <TabsList className="grid w-full grid-cols-7">
                        <TabsTrigger value="overview">Обзор</TabsTrigger>
                        <TabsTrigger value="schedule">Расписание</TabsTrigger>
                        <TabsTrigger value="activity">Активность</TabsTrigger>
                        <TabsTrigger value="leaderboard">Лидеры</TabsTrigger>
                        <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                        <TabsTrigger value="media">Медиа</TabsTrigger>
                        <TabsTrigger value="condition"><Wrench className="mr-2 h-4 w-4"/>Состояние</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-4">
                        <PlaygroundOverviewTab playground={playground} />
                    </TabsContent>
                    <TabsContent value="schedule" className="mt-4">
                        <PlaygroundScheduleTab playground={playground} initialSchedule={schedule} setSchedule={setSchedule} />
                    </TabsContent>
                    <TabsContent value="activity" className="mt-4">
                         <PlaygroundActivityTab activities={activities} />
                    </TabsContent>
                    <TabsContent value="leaderboard" className="mt-4">
                        <PlaygroundLeaderboardTab playground={playground} />
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
            <PlaygroundCheckInDialog
                isOpen={isCheckInOpen}
                onOpenChange={setIsCheckInOpen}
                playgroundName={playground.name}
                onCheckIn={handleCheckIn}
            />
            <ReportPlaygroundIssueDialog
                isOpen={isReportIssueOpen}
                onOpenChange={setIsReportIssueOpen}
                playgroundName={playground.name}
                onReportSubmit={handleReportSubmit}
            />
        </>
    );
}
