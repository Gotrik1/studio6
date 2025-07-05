

'use client';

import { PlaygroundActivityFeed } from '@/widgets/playground-activity-feed';
import { PlaygroundCurrentActivity } from '@/widgets/playground-current-activity';
import type { PlayerActivityItem } from '@/widgets/player-activity-feed';
import { Skeleton } from '@/shared/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/shared/ui/card';

interface PlaygroundActivityTabProps {
    activities: PlayerActivityItem[];
    isLoading: boolean;
}

export function PlaygroundActivityTab({ activities, isLoading }: PlaygroundActivityTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                {isLoading ? (
                    <Card>
                        <CardHeader>
                             <Skeleton className="h-6 w-1/2" />
                             <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <PlaygroundActivityFeed activities={activities} />
                )}
            </div>
            <div className="lg:col-span-1">
                <PlaygroundCurrentActivity />
            </div>
        </div>
    );
}
