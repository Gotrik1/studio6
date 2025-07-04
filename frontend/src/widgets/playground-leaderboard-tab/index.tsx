
'use client';

import { PlaygroundLeaderboard } from '@/widgets/playground-leaderboard';
import { AiPlaygroundChallenge } from '@/widgets/ai-playground-challenge';
import { playgroundsList } from '@/shared/lib/mock-data/playgrounds';

export function PlaygroundLeaderboardTab() {
    const playground = playgroundsList[0]; // Mock: use the first playground for the demo

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlaygroundLeaderboard />
            <AiPlaygroundChallenge playground={playground} />
        </div>
    );
}
