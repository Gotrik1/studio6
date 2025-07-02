
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import Image from 'next/image';
import { mockPlaygroundActivity, type PlaygroundActivity } from '@/shared/lib/mock-data/playground-activity';
import { MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';

export function PlaygroundActivityFeed() {
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
                        {mockPlaygroundActivity.map(activity => (
                            <div key={activity.id} className="flex gap-4">
                                <Avatar>
                                    <AvatarImage src={activity.user.avatar} />
                                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-baseline justify-between">
                                        <p className="font-semibold text-sm">{activity.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
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
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
