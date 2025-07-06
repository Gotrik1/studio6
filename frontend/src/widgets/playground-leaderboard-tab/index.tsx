
'use client';

import { PlaygroundLeaderboard } from '@/widgets/playground-leaderboard';
import { AiPlaygroundChallenge } from '@/widgets/ai-playground-challenge';
import type { Playground } from '@/entities/playground/model/types';


export function PlaygroundLeaderboardTab({ playground }: { playground: Playground }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlaygroundLeaderboard playgroundId={playground.id} />
            <AiPlaygroundChallenge playground={playground} />
        </div>
    );
}
