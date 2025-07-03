
'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/card';
import Image from 'next/image';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';
import { MapPin, CheckCircle, List, MessagesSquare, Star, BarChart, AlertTriangle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { PlaygroundCheckInDialog } from '@/widgets/playground-check-in-dialog';
import { useSession } from '@/shared/lib/session/client';
import { mockPlaygroundReviews, type PlaygroundReview } from '@/shared/lib/mock-data/playground-reviews';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useLfg } from '@/app/providers/lfg-provider';

// Import Tab Widgets
import { PlaygroundInfoTab } from '@/widgets/playground-info-tab';
import { PlaygroundActivityTab } from '@/widgets/playground-activity-tab';
import { mockPlaygroundActivity, type PlaygroundActivity } from '@/shared/lib/mock-data/playground-activity';
import { PlaygroundReviewsTab } from '@/widgets/playground-reviews-tab';
import { PlaygroundLeaderboardTab } from '@/widgets/playground-leaderboard-tab';
import { PlaygroundMediaTab } from '@/widgets/playground-media-tab';
import { ReportPlaygroundIssueDialog, type FormValues as ReportFormValues } from '@/widgets/report-playground-issue-dialog';
import { analyzePlaygroundReport, type AnalyzePlaygroundReportOutput } from '@/shared/api/genkit/flows/analyze-playground-report-flow';
import { PlanGameDialog } from '@/widgets/plan-game-dialog';


export default function PlaygroundDetailsPage({ playground }: { playground: Playground }) {
    const { user } = useSession();
    const { toast } = useToast();
    const { addLobby } = useLfg();
    const [activities, setActivities] = useState<PlaygroundActivity[]>(mockPlaygroundActivity);
    const [reviews, setReviews] = useState<PlaygroundReview[]>(mockPlaygroundReviews);
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);
    const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
    const [latestIssueReport, setLatestIssueReport] = useState<AnalyzePlaygroundReportOutput | null>(null);
    const [isPlanGameOpen, setIsPlanGameOpen] = useState(false);


    const handleCheckIn = (comment: string) => {
        if (!user) return;
        const newActivity: PlaygroundActivity = {
            id: `act-${Date.now()}`,
            user: { name: user.name, avatar: user.avatar },
            comment,
            timestamp: 'Только что',
        };
        setActivities(prev => [newActivity, ...prev]);
        toast({
            title: "Вы отметились!",
            description: `Вы получили 10 PD за чекин на площадке "${playground.name}".`
        });
    };
    
    const handleAddReview = (reviewData: Omit<PlaygroundReview, 'id' | 'author' | 'timestamp'>) => {
        if (!user) return;
        const newReview: PlaygroundReview = {
            id: `rev-${Date.now()}`,
            author: { name: user.name, avatar: user.avatar },
            timestamp: 'Только что',
            ...reviewData
        };
        setReviews(prev => [newReview, ...prev]);
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
        } catch(e) {
            toast({
                variant: 'destructive',
                title: "Ошибка",
                description: "Не удалось отправить отчет. Пожалуйста, попробуйте еще раз."
            })
        }
    };
    
    const handlePlanGame = (data: { date: Date, time: string, duration: number }) => {
        if (!user) return;
        const startTime = new Date(data.date);
        const [hours, minutes] = data.time.split(':').map(Number);
        startTime.setHours(hours, minutes, 0, 0);
        
        addLobby({
            type: 'game',
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
            description: `Ваша игра на "${playground.name}" добавлена в расписание и LFG.`
        });
    };

    return (
        <>
            <div className="space-y-6">
                <Card className="overflow-hidden">
                    <div className="relative h-64 w-full">
                        <Image src={playground.coverImage} alt={playground.name} fill className="object-cover" data-ai-hint={playground.coverImageHint}/>
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
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
                        <TabsTrigger value="info"><List className="mr-2 h-4 w-4" />Обзор</TabsTrigger>
                        <TabsTrigger value="reviews"><MessagesSquare className="mr-2 h-4 w-4" />Отзывы</TabsTrigger>
                        <TabsTrigger value="activity"><MapPin className="mr-2 h-4 w-4" />Активность</TabsTrigger>
                        <TabsTrigger value="leaderboard"><Star className="mr-2 h-4 w-4" />Лидеры</TabsTrigger>
                        <TabsTrigger value="media"><BarChart className="mr-2 h-4 w-4" />Медиа</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info" className="mt-6">
                        <PlaygroundInfoTab playground={playground} issueReport={latestIssueReport} />
                    </TabsContent>
                    <TabsContent value="reviews" className="mt-6">
                        <PlaygroundReviewsTab reviews={reviews} onAddReview={handleAddReview} playgroundName={playground.name} />
                    </TabsContent>
                    <TabsContent value="activity" className="mt-6">
                        <PlaygroundActivityTab activities={activities} />
                    </TabsContent>
                    <TabsContent value="leaderboard" className="mt-6">
                        <PlaygroundLeaderboardTab />
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
            />
        </>
    );
}
