
'use client';

import { PlaygroundActivityFeed } from '@/widgets/playground-activity-feed';
import { PlaygroundCurrentActivity } from '@/widgets/playground-current-activity';

export function PlaygroundActivityTab() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <PlaygroundActivityFeed />
            </div>
            <div className="lg:col-span-1">
                <PlaygroundCurrentActivity />
            </div>
        </div>
    );
}
