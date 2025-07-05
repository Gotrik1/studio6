
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { ClipboardList, Users, TrendingUp, BookOpen, BarChart3 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Skeleton } from '@/shared/ui/skeleton';
import { MyPlayersTab } from '@/entities/user/ui/coach-profile-tabs/my-players-tab';
import { MyProgramsTab } from '@/entities/user/ui/coach-profile-tabs/my-programs-tab';
import { TeamTrainingAnalytics } from '@/widgets/team-training-analytics';
import { AssignProgramDialog } from '@/widgets/assign-program-dialog';
import type { TrainingProgram } from '@/entities/training-program/model/types';
import { useSession } from '@/shared/lib/session/client';
import { getPlayerProfile, type FullUserProfile } from '@/entities/user/api/get-user';
import { useTraining } from '@/shared/context/training-provider';
import type { CoachedPlayer } from '@/entities/user/model/types';

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const PageSkeleton = () => (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96 w-full" />
    </div>
);


export function CoachCenterPage() {
    const { user } = useSession();
    const { toast } = useToast();
    const { programs } = useTraining();
    const [coachData, setCoachData] = useState<FullUserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isAssignProgramOpen, setIsAssignProgramOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

    useEffect(() => {
        if(user) {
            getPlayerProfile(user.id).then(data => {
                if(data) {
                    setCoachData(data.user);
                }
                setIsLoading(false);
            })
        }
    }, [user]);

    const handleAssignProgram = (program: TrainingProgram) => {
        setSelectedProgram(program);
        setIsAssignProgramOpen(true);
    };
    
    if (isLoading) {
        return <PageSkeleton />;
    }
    
    if (!coachData) {
        return <p>Не удалось загрузить данные тренера.</p>;
    }
    
    // In a real app, coachedPlayers would be fetched with full stats.
    // For now, we augment the basic user data from the backend with mock stats for UI compatibility.
    const coachedPlayers: CoachedPlayer[] = (coachData.coaching || []).map((player: any) => ({
        id: player.id,
        name: player.name,
        avatar: player.avatar || null,
        avatarHint: 'esports player portrait',
        role: player.role,
        // Mock stats and history as the backend doesn't provide this level of detail yet
        stats: { kda: '1.2', winRate: '55%', favoriteMap: 'Ascent' },
        matchHistory: 'W 13-8, L 10-13, W 13-2',
    }));

    const coachPrograms = programs.filter(p => p.author === coachData.name || p.isAiGenerated);

    return (
        <>
            <div className="space-y-6 opacity-0 animate-fade-in-up">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Тренерский центр</h1>
                    <p className="text-muted-foreground">
                        Ваша панель для управления учениками, программами и аналитикой.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Активных учеников" value={String(coachedPlayers.length)} icon={Users} />
                    <StatCard title="Средний прогресс" value="+15%" icon={TrendingUp} />
                    <StatCard title="Создано программ" value={String(coachPrograms.length)} icon={BookOpen} />
                    <StatCard title="Назначено программ" value="8" icon={ClipboardList} />
                </div>
                
                <Tabs defaultValue="players">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="players">Мои игроки</TabsTrigger>
                        <TabsTrigger value="programs">Мои программы</TabsTrigger>
                        <TabsTrigger value="analytics"><BarChart3 className="mr-2 h-4 w-4"/>Аналитика</TabsTrigger>
                    </TabsList>
                    <TabsContent value="players" className="mt-4">
                        <MyPlayersTab players={coachedPlayers} />
                    </TabsContent>
                    <TabsContent value="programs" className="mt-4">
                         <MyProgramsTab onAssignProgram={handleAssignProgram} authorName={coachData.name} />
                    </TabsContent>
                    <TabsContent value="analytics" className="mt-4">
                         <TeamTrainingAnalytics players={coachedPlayers} />
                    </TabsContent>
                </Tabs>
            </div>
             <AssignProgramDialog
                isOpen={isAssignProgramOpen}
                onOpenChange={setIsAssignProgramOpen}
                program={selectedProgram}
                players={coachedPlayers}
            />
        </>
    );
}
