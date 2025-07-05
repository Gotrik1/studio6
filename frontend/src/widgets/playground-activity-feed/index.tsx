
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import Image from 'next/image';
import { MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export type PlaygroundActivity = {
    id: string;
    user: {
        name: string;
        avatar: string | null;
    };
    comment: string;
    photo?: string | null;
    photoHint?: string;
    timestamp: string;
};

interface PlaygroundActivityFeedProps {
    activities: PlaygroundActivity[];
}

export function PlaygroundActivityFeed({ activities }: PlaygroundActivityFeedProps) {
    return (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Активность
                </CardTitle>
                <CardDescription>Последние чекины и комментарии от игроков.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96 pr-4">
                    <div className="space-y-6">
                        {activities.map(activity => (
                            <div key={activity.id} className="flex gap-4">
                                <Avatar>
                                    <AvatarImage src={activity.user.avatar || undefined} />
                                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-baseline justify-between">
                                        <p className="font-semibold text-sm">{activity.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: ru })}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">&quot;{activity.comment}&quot;</p>
                                    {activity.photo && (
                                        <div className="relative aspect-video w-full overflow-hidden rounded-md border mt-2">
                                            <Image src={activity.photo} alt={`Photo from ${activity.user.name}`} fill className="object-cover" data-ai-hint={activity.photoHint} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                         {activities.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground">
                                <p>На этой площадке еще не было активности.</p>
                                <p className="text-sm">Станьте первым, кто отметится!</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
