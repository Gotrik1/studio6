'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { activityFeed, type ActivityItem } from "@/shared/lib/mock-data/activity-feed";
import Link from "next/link";
import { ThumbsUp, MessageSquare } from "lucide-react";

export function ActivityFeed() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Лента активности</CardTitle>
                <CardDescription>Последние события от вас и ваших друзей.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {activityFeed.map((item: ActivityItem) => (
                    <div key={item.id} className="flex items-start gap-4">
                        <item.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm">
                                <Link href={item.user.profileUrl} className="font-semibold hover:underline">{item.user.name}</Link>
                                {' '}{item.text}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                            <div className="mt-2 flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-muted-foreground h-auto p-1">
                                    <ThumbsUp className="h-4 w-4" /> <span>Нравится</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-muted-foreground h-auto p-1">
                                    <MessageSquare className="h-4 w-4" /> <span>Комментировать</span>
                                </Button>
                            </div>
                        </div>
                         <Avatar className="h-10 w-10">
                            <AvatarImage src={item.user.avatar} alt={item.user.name} data-ai-hint={item.user.avatarHint} />
                            <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
