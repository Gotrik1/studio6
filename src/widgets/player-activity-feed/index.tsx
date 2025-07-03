
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll-area';
import type { PlayerActivityItem } from '@/shared/lib/mock-data/player-activity';

interface PlayerActivityFeedProps {
    activities: PlayerActivityItem[];
}

export function PlayerActivityFeed({ activities }: PlayerActivityFeedProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Лента активности</CardTitle>
                <CardDescription>Хронология ваших последних действий и достижений на платформе.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96 pr-4">
                    <div className="relative pl-6">
                        {/* Vertical Line */}
                        <div className="absolute left-[15px] top-0 h-full w-px bg-border -z-10" />
                        
                        <div className="space-y-8">
                            {activities.map((activity) => (
                                <div key={activity.id} className="relative flex items-start gap-4">
                                    <div className="absolute -left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary">
                                        <activity.icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 ml-10">
                                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: activity.text }} />
                                        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
