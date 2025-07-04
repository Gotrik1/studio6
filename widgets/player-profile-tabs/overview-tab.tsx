'use client';

import { PlayerActivityFeed } from '@/widgets/player-activity-feed';
import type { PlayerActivityItem } from '@/widgets/player-activity-feed';

interface OverviewTabProps {
    playerActivity: PlayerActivityItem[];
}

export function OverviewTab({ playerActivity }: OverviewTabProps) {
    return (
        <PlayerActivityFeed activities={playerActivity} />
    );
}