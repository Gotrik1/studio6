

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/shared/ui/card';
import Image from 'next/image';
import type { Playground, PlaygroundReview } from '@/entities/playground/model/types';
import { MapPin, CheckCircle, List, MessagesSquare, Star, BarChart, AlertTriangle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { PlaygroundCheckInDialog } from '@/widgets/playground-check-in-dialog';
import { useSession } from '@/shared/lib/session/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useLfg } from '@/app/providers/lfg-provider';
import { PlanGameDialog, type FormValues as PlanGameFormValues } from '@/widgets/plan-game-dialog';
import { PlaygroundInfoTab } from '@/widgets/playground-info-tab';
import { PlaygroundActivityTab } from '@/widgets/playground-activity-tab';
import { PlaygroundReviewsTab } from '@/widgets/playground-reviews-tab';
import { PlaygroundLeaderboardTab } from '@/widgets/playground-leaderboard-tab';
import { PlaygroundMediaTab } from '@/widgets/playground-media-tab';
import { PlaygroundScheduleTab } from '@/widgets/playground-schedule-tab';
import { ReportPlaygroundIssueDialog, type FormValues as ReportFormValues } from '@/widgets/report-playground-issue-dialog';
import { analyzePlaygroundReport, type AnalyzePlaygroundReportOutput } from '@/shared/api/genkit/flows/analyze-playground-report-flow';
import type { PlaygroundActivity } from '@/widgets/playground-activity-feed';
import { getPlaygroundActivity, createCheckIn } from '@/entities/playground/api/activity';
import { createReview } from '@/entities/playground/api/reviews';
import { useRouter } from 'next/navigation';


export default function PlaygroundDetailsPage({ playground }: { playground: Playground }) {
    const { user } = useSession();
    const { toast } = useToast();
    const router = useRouter();
    const [activities, setActivities] = useState<PlaygroundActivity[]>([]);
    const [isLoadingActivities, setIsLoadingActivities] = useState(true);
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);
    const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
    const [latestIssueReport, setLatestIssueReport] = useState<AnalyzePlaygroundReportOutput | null>(null);
    const { lobbies, addLobby } = useLfg();
    const [isPlanGameOpen, setIsPlanGameOpen] = useState(false);
    const [initialDateTime, setInitialDateTime] = useState<{date: Date, time: string}>();

    const loadActivities = useCallback(async () => {
        setIsLoadingActivities(true);
        try {
            const activityData = await getPlaygroundActivity(playground.id);
            const formattedActivities: PlaygroundActivity[] = activityData.map((act: any) => ({
                id: act.id,
                user: {
                    name: act.user.name,
                    avatar: act.user.avatar,
                },
                comment: act.metadata.comment || 'Отметился на площадке.',
                photo: act.metadata.photo,
                photoHint: 'playground check-in',
                timestamp: act.timestamp,
            }));
            setActivities(formattedActivities);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить ленту активности.' });
        } finally {
            setIsLoadingActivities(false);
        }
    }, [playground.id, toast]);
    
    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    const handleCheckIn = async (comment: string, photo?: string) => {
        if (!user) return;
        const result = await createCheckIn({ playgroundId: playground.id, comment, photo });
        
        if (result.success) {
            toast({
                title: "Вы отметились!",
                description: `Вы получили 10 PD за чекин на площадке "${playground.name}".`
            });
            await loadActivities(); // Refresh data
        } else {
             toast({
                variant: "destructive",
                title: "Ошибка",
                description: "Не удалось отметиться. Попробуйте снова."
            });
        }
    };
    
    const handleAddReview = async (reviewData: { rating: number, comment: string }) => {
        const result = await createReview(playground.id, reviewData);
        if (result.success) {
            toast({ title: 'Спасибо за ваш отзыв!', description: 'Ваш отзыв был опубликован.' });
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось опубликовать отзыв.' });
        }
    };

    const handleReportSubmit = async (data: ReportFormValues) => {
        try {
            const reportAnalysis = await analyzePlaygroundReport({
                playgroundName: playground.name,
                issueCategory: data.category,
                userComment: data.comment,
            });
            setLatestIssueReport(reportAnalysis);
            toast({
                title: "Спасибо за ваше сообщение!",
                description: "Информация о проблеме была передана модераторам."
            });
        } catch (e) {
             console.error(e);
            toast({
                variant: 'destructive',
                title: "Ошибка",
                description: "Не удалось отправить отчет. Пожалуйста, попробуйте еще раз."
            })
        }
    };
    
    const openPlanGameDialog = (day: Date, hour: number) => {
        const time = `${String(hour).padStart(2, '0')}:00`;
        setInitialDateTime({ date: day, time });
        setIsPlanGameOpen(true);
    };

    const handlePlanGame = async (data: PlanGameFormValues) => {
        if (!user) return;

        const [hours, minutes] = data.time.split(':').map(Number);
        const combinedDate = new Date(data.date);
        combinedDate.setHours(hours, minutes, 0, 0);

        const success = await addLobby({
            type: 'GAME',
            sport: playground.type,
            location: playground.name,
            playgroundId: playground.id,
            startTime: combinedDate,
            duration: data.duration,
            comment: data.comment || `Игра на площадке ${playground.name}`,
            playersNeeded: 10,
        });

        if (success) {
            toast({
                title: "Игра запланирована!",
                description: "Ваш план отобразится в расписании и разделе LFG.",
            });
        } else {
             toast({
                variant: "destructive",
                title: "Ошибка",
                description: "Не удалось запланировать игру.",
            });
        }
    };


    return (
        <>
            <div className="space-y-6">
                <Card className="overflow-hidden">
                    <div className="relative h-64 w-full">
                        <Image src={playground.coverImage!} alt={playground.name} fill className="object-cover" data-ai-hint={playground.coverImageHint!}/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <Badge variant="secondary">{playground.type}</Badge>
                            <h1 className="font-headline text-4xl font-bold mt-1">{playground.name}</h1>
                            <p className="flex items-center gap-2 mt-1"><MapPin className="h-4 w-4" /> {playground.address}</p>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                             <Button variant="destructive" onClick={() => setIsReportIssueOpen(true)}>
                                <AlertTriangle className="mr-2 h-5 w-5" />
                                Сообщить о проблеме
                            </Button>
                            <Button onClick={() => setIsCheckInOpen(true)}>
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Отметиться
                            </Button>
                        </div>
                    </div>
                </Card>

                <Tabs defaultValue="info">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6">
                        <TabsTrigger value="info"><List className="mr-2 h-4 w-4" />Обзор</TabsTrigger>
                        <TabsTrigger value="schedule">Расписание</TabsTrigger>
                        <TabsTrigger value="reviews"><MessagesSquare className="mr-2 h-4 w-4" />Отзывы</TabsTrigger>
                        <TabsTrigger value="activity"><MapPin className="mr-2 h-4 w-4" />Активность</TabsTrigger>
                        <TabsTrigger value="leaderboard"><Star className="mr-2 h-4 w-4" />Лидеры</TabsTrigger>
                        <TabsTrigger value="media"><BarChart className="mr-2 h-4 w-4" />Медиа</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info" className="mt-6">
                        <PlaygroundInfoTab playground={playground} issueReport={latestIssueReport} />
                    </TabsContent>
                    <TabsContent value="schedule" className="mt-6">
                        <PlaygroundScheduleTab schedule={lobbies.filter(l => l.playgroundId === playground.id)} onPlanClick={openPlanGameDialog} />
                    </TabsContent>
                    <TabsContent value="reviews" className="mt-6">
                        <PlaygroundReviewsTab reviews={playground.reviews} onAddReview={handleAddReview} playgroundName={playground.name} />
                    </TabsContent>
                    <TabsContent value="activity" className="mt-6">
                        <PlaygroundActivityTab activities={activities} isLoading={isLoadingActivities} />
                    </TabsContent>
                    <TabsContent value="leaderboard" className="mt-6">
                        <PlaygroundLeaderboardTab playground={playground} />
                    </TabsContent>
                    <TabsContent value="media" className="mt-6">
                        <PlaygroundMediaTab />
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
            <PlanGameDialog 
                isOpen={isPlanGameOpen}
                onOpenChange={setIsPlanGameOpen}
                playgroundName={playground.name}
                onPlan={handlePlanGame}
                initialDate={initialDateTime?.date}
                initialTime={initialDateTime?.time}
            />
        </>
    );
}
