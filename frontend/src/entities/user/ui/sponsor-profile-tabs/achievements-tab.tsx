"use client";

import { Card, CardContent } from "@/shared/ui/card";
import type { sponsorAchievements as SponsorAchievementsArray } from "@/shared/lib/mock-data/sponsor-profile";
import {
  Handshake,
  Megaphone,
  DollarSign,
  Target,
  Users,
  Award,
} from "lucide-react";

const iconComponents = {
  Handshake,
  Megaphone,
  DollarSign,
  Target,
  Users,
  Award,
};

type Achievement = (typeof SponsorAchievementsArray)[0];

interface SponsorAchievementsTabProps {
  achievements: Achievement[];
}

export function SponsorAchievementsTab({
  achievements,
}: SponsorAchievementsTabProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {achievements.map((ach) => {
            const Icon =
              iconComponents[ach.icon as keyof typeof iconComponents];
            return (
              <div
                key={ach.name}
                className={`flex flex-col items-center text-center ${ach.unlocked ? "" : "opacity-40"}`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${ach.unlocked ? "border-accent bg-accent/20 text-accent" : "border-dashed"}`}
                >
                  {Icon && <Icon className="h-8 w-8" />}
                </div>
                <p className="mt-2 font-semibold">{ach.name}</p>
                <p className="text-xs text-muted-foreground">
                  {ach.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
