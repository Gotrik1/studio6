'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { friendsList as initialFriends, pendingRequests as initialRequests, suggestedFriends as initialSuggestions } from '@/shared/lib/mock-data/friends';
import { MessageSquare, UserMinus, UserPlus, Check, X } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

export function FriendsPage() {
    const { toast } = useToast();

    // State for managing the lists
    const [friends, setFriends] = useState(initialFriends);
    const [requests, setRequests] = useState(initialRequests);
    const [suggestions, setSuggestions] = useState(initialSuggestions);

    const handleAcceptRequest = (request: typeof initialRequests[0]) => {
        // Remove from requests
        setRequests(prev => prev.filter(r => r.id !== request.id));
        // Add to friends
        const newFriend = {
            id: request.id,
            name: request.name,
            avatar: request.avatar,
            avatarHint: request.avatarHint,
            status: 'Онлайн', // Assume they become online
        };
        setFriends(prev => [newFriend, ...prev]);
        toast({ title: 'Запрос принят', description: `${request.name} теперь в вашем списке друзей.` });
    };

    const handleDeclineRequest = (requestId: string) => {
        const request = requests.find(r => r.id === requestId);
        setRequests(prev => prev.filter(r => r.id !== requestId));
        if (request) {
            toast({ title: 'Запрос отклонен', description: `Вы отклонили запрос от ${request.name}.` });
        }
    };

    const handleRemoveFriend = (friendId: string) => {
        const friend = friends.find(f => f.id === friendId);
        setFriends(prev => prev.filter(f => f.id !== friendId));
        if (friend) {
            toast({ variant: 'destructive', title: 'Друг удален', description: `${friend.name} был удален из вашего списка друзей.` });
        }
    };
    
    const handleAddFriend = (suggestion: typeof initialSuggestions[0]) => {
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
        // For demo, we'll simulate sending a request and it being accepted immediately.
        // In a real app, this would likely create an outgoing request.
        const newFriend = {
            id: suggestion.id,
            name: suggestion.name,
            avatar: suggestion.avatar,
            avatarHint: suggestion.avatarHint,
            status: 'Вне сети',
        };
        setFriends(prev => [newFriend, ...prev]);
        toast({ title: 'Запрос отправлен', description: `Вы отправили запрос в друзья ${suggestion.name}.` });
    }

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
                        <CardHeader>
                            <CardTitle>Список друзей</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {friends.map(friend => (
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
                                        <Button variant="ghost" size="icon" onClick={() => toast({title: `Сообщение для ${friend.name} открыто`})}><MessageSquare className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveFriend(friend.id)}><UserMinus className="h-4 w-4" /></Button>
                                    </div>
                                </Card>
                            ))}
                             {friends.length === 0 && <p className="col-span-full text-center text-muted-foreground">У вас пока нет друзей.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="requests" className="mt-4">
                    <Card>
                         <CardHeader>
                            <CardTitle>Входящие запросы</CardTitle>
                             <CardDescription>Запросы на добавление в друзья от других игроков.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             {requests.map(request => (
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
                                        <Button size="icon" className="bg-green-500 hover:bg-green-600" onClick={() => handleAcceptRequest(request)}><Check className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="destructive" onClick={() => handleDeclineRequest(request.id)}><X className="h-4 w-4" /></Button>
                                    </div>
                                </Card>
                            ))}
                            {requests.length === 0 && <p className="text-center text-muted-foreground">Новых запросов нет.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="suggestions" className="mt-4">
                     <Card>
                         <CardHeader>
                            <CardTitle>Возможные друзья</CardTitle>
                             <CardDescription>Игроки, которых вы можете знать.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           {suggestions.map(suggestion => (
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
                                    <Button onClick={() => handleAddFriend(suggestion)}>
                                        <UserPlus className="mr-2 h-4 w-4"/> Добавить
                                    </Button>
                                </Card>
                            ))}
                            {suggestions.length === 0 && <p className="text-center text-muted-foreground">Нет новых рекомендаций.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
