'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/shared/ui/card';
import { type FeedItemData, type StatusFeedItem, type MatchResultFeedItem, type AchievementFeedItem, feedData } from '@/shared/lib/mock-data/feed';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Bot, MessageSquare, Trophy, Award, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/shared/ui/skeleton';

const FeedItemHeader = ({ user, timestamp, icon: Icon }: { user: FeedItemData['user'], timestamp: string, icon: FeedItemData['icon'] }) => (
    <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
        <Avatar className="h-10 w-10">
            {user.avatar ? <AvatarImage src={user.avatar} data-ai-hint={user.avatarHint}/> : <AvatarFallback><Bot /></AvatarFallback>}
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">{timestamp}</p>
        </div>
        <Icon className="h-5 w-5 text-muted-foreground ml-auto" />
    </CardHeader>
);

const FeedItemFooter = () => (
    <CardFooter className="p-2 px-4 flex justify-between">
        <Button variant="ghost" size="sm" className="text-muted-foreground"><Heart className="mr-2 h-4 w-4"/>Нравится</Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground"><MessageCircle className="mr-2 h-4 w-4"/>Комментировать</Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground"><Share2 className="mr-2 h-4 w-4"/>Поделиться</Button>
    </CardFooter>
);

// Specific card types
const StatusPost = ({ item }: { item: StatusFeedItem }) => (
    <Card>
        <FeedItemHeader user={item.user} timestamp={item.timestamp} icon={MessageSquare} />
        <CardContent className="p-4 pt-0">
            <p className="text-sm">{item.content.text}</p>
        </CardContent>
        <Separator />
        <FeedItemFooter />
    </Card>
);

const MatchResultPost = ({ item }: { item: MatchResultFeedItem }) => (
    <Card>
        <FeedItemHeader user={item.user} timestamp={item.timestamp} icon={Trophy} />
        <CardContent className="p-4 pt-0">
            <CardDescription>{item.content.tournament}</CardDescription>
            <div className="mt-2 flex items-center justify-around rounded-lg border p-4">
                <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={item.user.avatar} data-ai-hint={item.user.avatarHint} />
                        <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{item.user.name}</p>
                </div>
                <div className="text-center">
                    <p className={`font-bold text-2xl ${item.content.result === 'Победа' ? 'text-green-500' : 'text-red-500'}`}>{item.content.result}</p>
                    <p className="font-bold text-xl">{item.content.score}</p>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={item.content.opponent.avatar} data-ai-hint={item.content.opponent.avatarHint} />
                        <AvatarFallback>{item.content.opponent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{item.content.opponent.name}</p>
                </div>
            </div>
        </CardContent>
         <Separator />
        <FeedItemFooter />
    </Card>
);

const AchievementPost = ({ item }: { item: AchievementFeedItem }) => (
    <Card className="bg-gradient-to-br from-amber-50/50 to-purple-50/50 dark:from-amber-950/20 dark:to-purple-950/20 shadow-none">
        <FeedItemHeader user={item.user} timestamp={item.timestamp} icon={Award} />
        <CardContent className="p-4 pt-0 text-center">
            <Award className="h-12 w-12 text-amber-500 mx-auto mb-2"/>
            <p className="text-sm">Разблокировано достижение:</p>
            <p className="text-lg font-bold">{item.content.title}</p>
            <p className="text-xs text-muted-foreground">{item.content.description}</p>
        </CardContent>
         <Separator />
        <FeedItemFooter />
    </Card>
);

const FeedSkeleton = () => (
    <>
        <Skeleton className="h-[124px] w-full" />
        <Skeleton className="h-[218px] w-full" />
        <Skeleton className="h-[188px] w-full" />
    </>
);

export function Feed() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); 

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-6">
            {isLoading ? (
                <FeedSkeleton />
            ) : (
                feedData.map(item => {
                    switch (item.type) {
                        case 'status':
                            return <StatusPost key={item.id} item={item} />;
                        case 'match_result':
                            return <MatchResultPost key={item.id} item={item} />;
                        case 'achievement':
                            return <AchievementPost key={item.id} item={item} />;
                        default:
                            return null;
                    }
                })
            )}
        </div>
    );
}
