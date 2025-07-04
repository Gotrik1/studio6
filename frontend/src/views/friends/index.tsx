'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { MessageSquare, UserMinus, UserPlus, Check, X } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import {
    getFriends,
    getFriendRequests,
    getFriendSuggestions,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    addSuggestedFriend,
    type Friend,
    type FriendRequest,
    type FriendSuggestion
} from '@/entities/user/api/friends';

const FriendCardSkeleton = () => (
    <div className="p-4 flex items-center justify-between border rounded-lg">
        <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
            </div>
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
        </div>
    </div>
);

const renderContent = (loading: boolean, data: any[], Component: React.ComponentType<{data: any[], onAction: any, onAction2?: any}>, onAction: any, onAction2?: any, emptyMessage: string = 'Пусто') => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FriendCardSkeleton />
                <FriendCardSkeleton />
                <FriendCardSkeleton />
            </div>
        )
    }
    if (data.length === 0) {
        return <p className="col-span-full text-center text-muted-foreground py-8">{emptyMessage}</p>
    }
    return <Component data={data} onAction={onAction} onAction2={onAction2} />
};

export function FriendsPage() {
    const { toast } = useToast();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [friendsData, requestsData, suggestionsData] = await Promise.all([
                getFriends(),
                getFriendRequests(),
                getFriendSuggestions()
            ]);
            setFriends(friendsData);
            setRequests(requestsData);
            setSuggestions(suggestionsData);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить данные.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleAction = (action: (...args: any[]) => Promise<any>, successMessage: string, errorMessage: string, ...args: any[]) => {
        startTransition(async () => {
            try {
                await action(...args);
                toast({ title: successMessage });
                await fetchAllData();
            } catch (e) {
                console.error(e);
                toast({ variant: 'destructive', title: 'Ошибка', description: errorMessage });
            }
        });
    }

    const handleAcceptRequest = (request: FriendRequest) => handleAction(acceptFriendRequest, 'Запрос принят', 'Не удалось принять запрос', request.id);
    const handleDeclineRequest = (request: FriendRequest) => handleAction(declineFriendRequest, 'Запрос отклонен', 'Не удалось отклонить запрос', request.id);
    const handleRemoveFriend = (friend: Friend) => handleAction(removeFriend, 'Друг удален', 'Не удалось удалить друга', friend.id);
    const handleAddFriend = (suggestion: FriendSuggestion) => handleAction(addSuggestedFriend, 'Запрос отправлен', 'Не удалось отправить запрос', suggestion.id);

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Друзья</h1>
                <p className="text-muted-foreground">
                    Управляйте вашим списком друзей и находите новых.
                </p>
            </div>

            <Tabs defaultValue="friends">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="friends">
                        Мои друзья <Badge className="ml-2">{friends.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="requests">
                        Запросы <Badge className="ml-2">{requests.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="suggestions">Рекомендации</TabsTrigger>
                </TabsList>

                <TabsContent value="friends" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Список друзей</CardTitle></CardHeader>
                        <CardContent>
                            {renderContent(loading, friends, FriendsList, handleRemoveFriend, undefined, "У вас пока нет друзей.")}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="requests" className="mt-4">
                    <Card>
                         <CardHeader><CardTitle>Входящие запросы</CardTitle><CardDescription>Запросы на добавление в друзья от других игроков.</CardDescription></CardHeader>
                        <CardContent>
                           {renderContent(loading, requests, handleAcceptRequest, handleDeclineRequest, "Новых запросов нет.")}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="suggestions" className="mt-4">
                     <Card>
                         <CardHeader><CardTitle>Возможные друзья</CardTitle><CardDescription>Игроки, которых вы можете знать.</CardDescription></CardHeader>
                        <CardContent>
                            {renderContent(loading, suggestions, handleAddFriend, undefined, "Нет новых рекомендаций.")}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

const FriendsList = ({data, onAction}: {data: Friend[], onAction: (friend: Friend) => void}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(friend => (
            <Card key={friend.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint={friend.avatarHint} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{friend.name}</p>
                        <Badge variant={friend.status === 'Онлайн' ? 'default' : 'outline'}>{friend.status}</Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => {}}><MessageSquare className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onAction(friend)}><UserMinus className="h-4 w-4" /></Button>
                </div>
            </Card>
        ))}
    </div>
);

const RequestsList = ({data, onAction, onAction2}: {data: FriendRequest[], onAction: (req: FriendRequest) => void, onAction2: (req: FriendRequest) => void}) => (
    <div className="space-y-3">
        {data.map(request => (
           <Card key={request.id} className="p-4 flex items-center justify-between">
               <div className="flex items-center gap-4">
                   <Avatar className="h-12 w-12">
                       <AvatarImage src={request.avatar} alt={request.name} data-ai-hint={request.avatarHint} />
                       <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                   </Avatar>
                   <div>
                       <p className="font-semibold">{request.name}</p>
                       <p className="text-sm text-muted-foreground">{request.mutualFriends} общих друга</p>
                   </div>
               </div>
               <div className="flex gap-2">
                   <Button size="icon" variant="ghost" className="text-destructive" onClick={() => onAction2(request)}><X className="h-4 w-4" /></Button>
                   <Button size="icon" variant="ghost" className="text-green-500" onClick={() => onAction(request)}><Check className="h-4 w-4" /></Button>
               </div>
           </Card>
       ))}
   </div>
);

const SuggestionsList = ({data, onAction}: {data: FriendSuggestion[], onAction: (sug: FriendSuggestion) => void}) => (
    <div className="space-y-3">
      {data.map(suggestion => (
           <Card key={suggestion.id} className="p-4 flex items-center justify-between">
               <div className="flex items-center gap-4">
                   <Avatar className="h-12 w-12">
                       <AvatarImage src={suggestion.avatar} alt={suggestion.name} data-ai-hint={suggestion.avatarHint} />
                       <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                   </Avatar>
                   <div>
                       <p className="font-semibold">{suggestion.name}</p>
                       <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                   </div>
               </div>
               <Button onClick={() => onAction(suggestion)}>
                   <UserPlus className="mr-2 h-4 w-4"/> Добавить
               </Button>
           </Card>
       ))}
   </div>
);
