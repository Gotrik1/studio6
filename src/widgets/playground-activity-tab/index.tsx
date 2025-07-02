'use client';

import { PlaygroundSchedule } from '@/widgets/playground-schedule';
import { PlaygroundActivityFeed } from '@/widgets/playground-activity-feed';
import { PlaygroundCurrentActivity } from '@/widgets/playground-current-activity';
import type { PlaygroundBooking } from '@/shared/lib/mock-data/playground-schedule';
import type { PlaygroundActivity } from '@/shared/lib/mock-data/playground-activity';

interface PlaygroundActivityTabProps {
    schedule: PlaygroundBooking[];
    activities: PlaygroundActivity[];
    onPlanClick: () => void;
}

export function PlaygroundActivityTab({ schedule, activities, onPlanClick }: PlaygroundActivityTabProps) {
    return (
        <div className="space-y-6">
            <PlaygroundSchedule schedule={schedule} onPlanClick={onPlanClick} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PlaygroundActivityFeed activities={activities} />
                </div>
                <div className="lg:col-span-1">
                    <PlaygroundCurrentActivity />
                </div>
            </div>
        </div>
    );
}
