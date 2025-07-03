
'use client';

import { PlayerActivityFeed } from '@/widgets/player-activity-feed';
import type { PlayerActivityItem } from "@/shared/lib/mock-data/player-activity";

interface OverviewTabProps {
    playerActivity: PlayerActivityItem[];
}

export function OverviewTab({ playerActivity }: OverviewTabProps) {
    return (
        <PlayerActivityFeed activities={playerActivity} />
    );
}
