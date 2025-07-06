


'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/shared/ui/card';
import Image from 'next/image';
import type { Playground } from '@/entities/playground/model/types';
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
import { ReportPlaygroundIssueDialog } from '@/widgets/report-playground-issue-dialog';
import type { PlaygroundActivity } from '@/widgets/playground-activity-feed';
import { getPlaygroundActivity, createCheckIn } from '@/entities/playground/api/activity';
import { createReview, getReviews, type CreateReviewData, type PlaygroundReview } from '@/entities/playground/api/reviews';
import type { PlaygroundConditionReport } from '@/entities/playground/api/condition';
import type { LfgLobby } from '@/entities/lfg/model/types';
import { getPlaygroundSchedule } from '@/entities/playground/api/schedule';
import { reportPlaygroundIssue } from '@/entities/playground/api/report';


export default function PlaygroundDetailsPage({ playground, initialConditionReport }: { playground: Playground, initialConditionReport: PlaygroundConditionReport | null }) {
    const { user } = useSession();
    const { toast } = useToast();
    const [activities, setActivities] = useState<PlaygroundActivity[]>([]);
    const [isLoadingActivities, setIsLoadingActivities] = useState(true);
    const [reviews, setReviews] = useState<PlaygroundReview[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);
    const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
    const [latestIssueReport, setLatestIssueReport] = useState<PlaygroundConditionReport | null>(initialConditionReport);
    const { addLobby } = useLfg();
    const [isPlanGameOpen, setIsPlanGameOpen] = useState(false);
    const [initialDateTime, setInitialDateTime] = useState<{date: Date, time: string}>();
    
    const [schedule, setSchedule] = useState<LfgLobby[]>([]);
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);

    const loadActivities = useCallback(async () => {
        setIsLoadingActivities(true);
        try {
            const activityData = await getPlaygroundActivity(playground.id);
            const formattedActivities: PlaygroundActivity[] = activityData.map((act: { id: string; user: { name: string; avatar: string | null; }; metadata: { comment: string; photo: string | null; }; createdAt: string; }) => ({
                id: act.id,
                user: {
                    name: act.user.name,
                    avatar: act.user.avatar,
                },
                comment: act.metadata.comment || 'Отметился на площадке.',
                photo: act.metadata.photo,
                photoHint: 'playground check-in',
                timestamp: act.createdAt,
            }));
            setActivities(formattedActivities);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить ленту активности.' });
        } finally {
            setIsLoadingActivities(false);
        }
    }, [playground.id, toast]);
    
     const loadReviews = useCallback(async () => {
        setIsLoadingReviews(true);
        try {
            const reviewsResult = await getReviews(playground.id);
            if (reviewsResult.success && reviewsResult.data) {
                // The data is already formatted by the API client, so we can use it directly
                setReviews(reviewsResult.data);
            } else {
                 toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить отзывы.' });
            }
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить отзывы.' });
        } finally {
            setIsLoadingReviews(false);
        }
    }, [playground.id, toast]);

    const loadSchedule = useCallback(async () => {
        setIsLoadingSchedule(true);
        try {
            const scheduleData = await getPlaygroundSchedule(playground.id);
            setSchedule(scheduleData);
        } catch (error) {
            console.error('Failed to load schedule', error);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить расписание площадки.' });
        } finally {
            setIsLoadingSchedule(false);
        }
    }, [playground.id, toast]);

    useEffect(() => {
        loadActivities();
        loadReviews();
        loadSchedule();
    }, [loadActivities, loadReviews, loadSchedule]);

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
    
    const handleAddReview = async (reviewData: CreateReviewData) => {
        const result = await createReview(playground.id, reviewData);
        if (result.success) {
            toast({ title: 'Спасибо за ваш отзыв!', description: 'Ваш отзыв был опубликован.' });
            await loadReviews();
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось опубликовать отзыв.' });
        }
    };
    
    const handleReportSubmit = async (data: { category: string; comment: string; }) => {
        const result = await reportPlaygroundIssue({
            playgroundId: playground.id,
            ...data
        });
        if (result.success && result.data) {
             setLatestIssueReport(result.data as PlaygroundConditionReport);
              toast({
                title: "Спасибо за ваше сообщение!",
                description: "Информация о проблеме была передана модераторам."
            });
        } else {
             toast({
                variant: "destructive",
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
            await loadSchedule();
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
                        <PlaygroundScheduleTab schedule={schedule} onPlanClick={openPlanGameDialog} isLoading={isLoadingSchedule} />
                    </TabsContent>
                    <TabsContent value="reviews" className="mt-6">
                        <PlaygroundReviewsTab 
                            playgroundId={playground.id}
                            playgroundName={playground.name}
                            reviews={reviews} 
                            onAddReview={handleAddReview} 
                            isLoading={isLoadingReviews} 
                        />
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
                playgroundId={playground.id}
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
