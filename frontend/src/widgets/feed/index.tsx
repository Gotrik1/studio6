'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Bot, MessageSquare, Trophy, Award, Heart, MessageCircle, Share2, Users, UserPlus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/shared/ui/skeleton';
import { getFeed, type Activity } from '@/entities/feed/api/feed';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const iconMap = {
    MATCH_PLAYED: Trophy,
    ACHIEVEMENT_UNLOCKED: Award,
    STATUS_POSTED: MessageSquare,
    TEAM_JOINED: Users,
    TOURNAMENT_REGISTERED: Trophy,
    default: MessageSquare
};

const formatActivityText = (activity: Activity): string => {
    const metadata = activity.metadata as any;
    switch(activity.type) {
        case 'STATUS_POSTED':
            return metadata.text;
        case 'MATCH_PLAYED':
            return `Сыграл матч за <a href="${metadata.teamHref}" class="font-bold hover:underline">${metadata.team}</a> против <a href="#" class="font-bold hover:underline">${metadata.opponent}</a>. <span class="${metadata.result === 'Победа' ? 'text-green-500' : 'text-red-500'} font-bold">${metadata.result} ${metadata.score}</span>.`;
        case 'TEAM_JOINED':
            return `Присоединился к команде <a href="${metadata.teamHref}" class="font-bold hover:underline">${metadata.teamName}</a>.`;
        case 'TOURNAMENT_REGISTERED':
             return `Зарегистрировал команду <a href="#" class="font-bold hover:underline">${metadata.teamName}</a> на турнир <a href="${metadata.tournamentHref}" class="font-bold hover:underline">${metadata.tournamentName}</a>.`;
        case 'ACHIEVEMENT_UNLOCKED':
             return `Разблокировано достижение: <span class="font-bold">${metadata.title}</span>`;
        default:
            return 'Совершил(а) новое действие.';
    }
}


const FeedItemHeader = ({ user, timestamp, icon: Icon }: { user: Activity['user'], timestamp: string, icon: React.ElementType }) => (
    <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
        <Avatar className="h-10 w-10">
            {user.avatar ? <AvatarImage src={user.avatar} data-ai-hint="user avatar"/> : <AvatarFallback><Bot /></AvatarFallback>}
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: ru })}</p>
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

const GenericFeedItem = ({ item }: { item: Activity }) => {
    const Icon = iconMap[item.type as keyof typeof iconMap] || iconMap.default;
    return (
        <Card>
            <FeedItemHeader user={item.user} timestamp={item.timestamp} icon={Icon} />
            <CardContent className="p-4 pt-0">
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: formatActivityText(item) }} />
            </CardContent>
            <Separator />
            <FeedItemFooter />
        </Card>
    )
};

const FeedSkeleton = () => (
    <>
        <Skeleton className="h-[124px] w-full" />
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[188px] w-full" />
    </>
);

export function Feed() {
    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const fetchFeed = async () => {
            setIsLoading(true);
            const data = await getFeed();
            setActivities(data);
            setIsLoading(false);
        };

        fetchFeed();
        
        // Also poll for new activities
        const intervalId = setInterval(fetchFeed, 30000);
        
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="space-y-6">
            {isLoading && activities.length === 0 ? (
                <FeedSkeleton />
            ) : (
                activities.map(item => <GenericFeedItem key={item.id} item={item} />)
            )}
        </div>
    );
}
