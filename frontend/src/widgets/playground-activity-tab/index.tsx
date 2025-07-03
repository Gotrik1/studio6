
'use client';

import { PlaygroundActivityFeed } from '@/widgets/playground-activity-feed';
import { PlaygroundCurrentActivity } from '@/widgets/playground-current-activity';
import type { PlaygroundActivity } from '@/shared/lib/mock-data/playground-activity';

interface PlaygroundActivityTabProps {
    activities: PlaygroundActivity[];
}

export function PlaygroundActivityTab({ activities }: PlaygroundActivityTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <PlaygroundActivityFeed activities={activities} />
            </div>
            <div className="lg:col-span-1">
                <PlaygroundCurrentActivity />
            </div>
        </div>
    );
}
