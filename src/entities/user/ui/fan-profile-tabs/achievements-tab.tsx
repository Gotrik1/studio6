
'use client';

import { Card, CardContent } from "@/shared/ui/card";
import type { fanAchievements as FanAchievementsArray } from "@/shared/lib/mock-data/fan-profile";
import { Star, Ticket, MessageSquare, Heart, UserPlus, Award } from "lucide-react";

const iconComponents = {
    UserPlus,
    Star,
    Ticket,
    MessageSquare,
    Heart,
    Award,
};

type Achievement = (typeof FanAchievementsArray)[0];

interface FanAchievementsTabProps {
    achievements: Achievement[];
}

export function FanAchievementsTab({ achievements }: FanAchievementsTabProps) {
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
