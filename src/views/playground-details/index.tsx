
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
import { useToast } from '@/shared/hooks/use-toast';


export default function PlaygroundDetailsPage({ playground }: { playground: Playground }) {
    const { toast } = useToast();
    const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
    const [conditionReport, setConditionReport] = useState<AnalyzePlaygroundReportOutput | null>(null);

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
    }


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
                    <Button className="w-full sm:w-auto" size="lg">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Отметиться (чекин)
                    </Button>
                     <Button className="w-full sm:w-auto" size="lg" variant="destructive" onClick={() => setIsReportIssueOpen(true)}>
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Сообщить о проблеме
                    </Button>
                </div>

                <Tabs defaultValue="overview">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Обзор</TabsTrigger>
                        <TabsTrigger value="activity">Активность</TabsTrigger>
                        <TabsTrigger value="leaderboard">Лидеры</TabsTrigger>
                        <TabsTrigger value="media">Медиа</TabsTrigger>
                        <TabsTrigger value="condition"><Wrench className="mr-2 h-4 w-4"/>Состояние</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-4">
                        <PlaygroundOverviewTab playground={playground} />
                    </TabsContent>
                    <TabsContent value="activity" className="mt-4">
                        <PlaygroundActivityTab />
                    </TabsContent>
                    <TabsContent value="leaderboard" className="mt-4">
                        <PlaygroundLeaderboardTab />
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
        </>
    );
}
