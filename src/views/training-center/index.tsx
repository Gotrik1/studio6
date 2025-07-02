'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Dumbbell, Calendar, Users, Swords, BarChart3, Ruler, Award, HeartPulse, Gamepad2, Search } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProposeTrainingDialog } from '@/widgets/propose-training-dialog';

const FeatureCard = ({ title, description, icon: Icon, children }: { title: string, description: string, icon: React.ElementType, children: React.ReactNode }) => (
    <Card className="flex flex-col">
        <CardHeader>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-muted rounded-full">
                    <Icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
            {children}
        </CardContent>
    </Card>
);

const FeatureLink = ({ href, icon: Icon, label, onClick }: { href?: string, icon: React.ElementType, label: string, onClick?: () => void }) => {
    const content = (
         <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{label}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
    );
    if (href) {
        return <Link href={href} className="block">{content}</Link>
    }
    return <button onClick={onClick} className="block w-full text-left">{content}</button>
};


export function TrainingCenterPage() {
    const [isProposeTrainingOpen, setIsProposeTrainingOpen] = useState(false);

    return (
        <>
            <div className="space-y-8 opacity-0 animate-fade-in-up">
                <header className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Тренировочный центр</h1>
                    <p className="text-muted-foreground">
                        Ваш хаб для всех видов спортивной активности: от силовых тренировок до командных игр.
                    </p>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Fitness & Strength */}
                    <FeatureCard
                        title="Фитнес и сила"
                        description="Планируйте тренировки, создавайте программы и отслеживайте свои физические показатели."
                        icon={Dumbbell}
                    >
                        <FeatureLink href="/training/programs" icon={Gamepad2} label="Программы тренировок" />
                        <FeatureLink href="/training/exercises" icon={Dumbbell} label="Каталог упражнений" />
                        <FeatureLink href="/training/log" icon={Calendar} label="Дневник тренировок" />
                        <FeatureLink href="/training/nutrition-diary" icon={HeartPulse} label="Дневник питания" />
                    </FeatureCard>
                    
                    {/* Team & Game */}
                    <FeatureCard
                        title="Игры и спарринги"
                        description="Находите партнеров для игры, планируйте командные тренировки и бросайте вызовы."
                        icon={Swords}
                    >
                         <FeatureLink href="/lfg" icon={Search} label="Найти игру (LFG)" />
                         <FeatureLink onClick={() => setIsProposeTrainingOpen(true)} icon={Users} label="Предложить тренировку" />
                         <FeatureLink href="/matches/new" icon={Swords} label="Бросить вызов" />
                         <FeatureLink href="/teams" icon={Users} label="Мои команды" />
                    </FeatureCard>

                    {/* Analytics */}
                    <FeatureCard
                        title="Аналитика и прогресс"
                        description="Отслеживайте свои достижения и анализируйте результаты для дальнейшего роста."
                        icon={BarChart3}
                    >
                        <FeatureLink href="/training/analytics" icon={BarChart3} label="Общая аналитика" />
                        <FeatureLink href="/training/records" icon={Award} label="Личные рекорды" />
                        <FeatureLink href="/training/measurements" icon={Ruler} label="Замеры тела" />
                    </FeatureCard>
                </div>
            </div>
            <ProposeTrainingDialog isOpen={isProposeTrainingOpen} onOpenChange={setIsProposeTrainingOpen} />
        </>
    );
}
