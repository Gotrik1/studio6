'use client';

import { Card, CardContent } from "@/shared/ui/card";
import type { coachAchievements as CoachAchievementsArray } from "@/shared/lib/mock-data/coach-profile";
import { ClipboardList, TrendingUp, Trophy, Users, Star, Award } from "lucide-react";

const iconComponents = {
    Trophy,
    Star,
    Users,
    ClipboardList,
    TrendingUp,
    Award,
};

type Achievement = (typeof CoachAchievementsArray)[0];

interface CoachAchievementsTabProps {
    achievements: Achievement[];
}

export function CoachAchievementsTab({ achievements }: CoachAchievementsTabProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                    {achievements.map((ach) => {
                        const Icon = iconComponents[ach.icon as keyof typeof iconComponents];
                        return (
                            <div key={ach.name} className={`flex flex-col items-center text-center ${ach.unlocked ? '' : 'opacity-40'}`}>
                                <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${ach.unlocked ? 'border-primary bg-primary/20 text-primary' : 'border-dashed'}`}>
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
