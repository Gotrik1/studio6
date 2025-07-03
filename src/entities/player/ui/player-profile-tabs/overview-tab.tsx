
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { PlayerActivityFeed } from '@/widgets/player-activity-feed';
import type { playerActivity as PlayerActivityArray } from "@/shared/lib/mock-data/profiles";

interface OverviewTabProps {
    playerActivity: typeof PlayerActivityArray;
}

export function OverviewTab({ playerActivity }: OverviewTabProps) {
    return (
        <PlayerActivityFeed activities={playerActivity} />
    );
}
