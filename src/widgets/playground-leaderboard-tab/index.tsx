'use client';

import { PlaygroundLeaderboard } from '@/widgets/playground-leaderboard';
import { AiPlaygroundChallenge } from '@/widgets/ai-playground-challenge';
import type { Playground } from '@/shared/lib/mock-data/playgrounds';

interface PlaygroundLeaderboardTabProps {
    playground: Playground;
}

export function PlaygroundLeaderboardTab({ playground }: PlaygroundLeaderboardTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlaygroundLeaderboard />
            <AiPlaygroundChallenge playground={playground} />
        </div>
    );
}
