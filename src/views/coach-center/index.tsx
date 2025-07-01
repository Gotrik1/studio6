'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { coachedPlayers } from '@/shared/lib/mock-data/coach-players';
import { trainingPrograms } from '@/shared/lib/mock-data/training-programs';
import type { TrainingProgram } from '@/entities/training-program/model/types';
import { AssignProgramDialog } from '@/widgets/assign-program-dialog';
import { MyPlayersTab } from '@/entities/user/ui/coach-profile-tabs/my-players-tab';
import { MyProgramsTab } from '@/entities/user/ui/coach-profile-tabs/my-programs-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import {ClipboardList, Users, TrendingUp, BookOpen} from 'lucide-react';

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

export function CoachCenterPage() {
    const [isAssignProgramOpen, setIsAssignProgramOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

    const handleAssignProgram = (program: TrainingProgram) => {
        setSelectedProgram(program);
        setIsAssignProgramOpen(true);
    };

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
                    <StatCard title="Создано программ" value={String(trainingPrograms.filter(p => p.author === 'Coach Anna' || p.isAiGenerated).length)} icon={BookOpen} />
                    <StatCard title="Назначено программ" value="8" icon={ClipboardList} />
                </div>
                
                <Tabs defaultValue="players">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="players">Мои игроки</TabsTrigger>
                        <TabsTrigger value="programs">Мои программы</TabsTrigger>
                    </TabsList>
                    <TabsContent value="players" className="mt-4">
                        <MyPlayersTab players={coachedPlayers} />
                    </TabsContent>
                    <TabsContent value="programs" className="mt-4">
                         <MyProgramsTab programs={trainingPrograms} onAssignProgram={handleAssignProgram} />
                    </TabsContent>
                </Tabs>
            </div>
             <AssignProgramDialog
                isOpen={isAssignProgramOpen}
                onOpenChange={setIsAssignProgramOpen}
                program={selectedProgram}
            />
        </>
    );
}
