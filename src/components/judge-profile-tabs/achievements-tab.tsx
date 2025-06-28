'use client';

import { Card, CardContent } from "@/components/ui/card";
import type { judgeAchievements as JudgeAchievementsArray } from "@/lib/mock-data/judge-profile";
import { Gavel, Trophy, CalendarDays, Shield, Scale, ClipboardCheck } from "lucide-react";

const iconComponents = {
    Gavel,
    Trophy,
    CalendarDays,
    Shield,
    Scale,
    ClipboardCheck,
};

type Achievement = (typeof JudgeAchievementsArray)[0];

interface JudgeAchievementsTabProps {
    achievements: Achievement[];
}

export function JudgeAchievementsTab({ achievements }: JudgeAchievementsTabProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                    {achievements.map((ach) => {
                        const Icon = iconComponents[ach.icon as keyof typeof iconComponents];
                        return (
                            <div key={ach.name} className={`flex flex-col items-center text-center ${ach.unlocked ? '' : 'opacity-40'}`}>
                                <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${ach.unlocked ? 'border-secondary-foreground bg-secondary' : 'border-dashed'}`}>
                                    {Icon && <Icon className="h-8 w-8" />}
                                </div>
                                <p className="mt-2 font-semibold">{ach.name}</p>
                                <p className="text-xs text-muted-foreground">{ach.description}</p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
