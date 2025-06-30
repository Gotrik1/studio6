
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { friendsList, pendingRequests, suggestedFriends } from '@/shared/lib/mock-data/friends';
import { MessageSquare, UserMinus, UserPlus, Check, X } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

export function FriendsPage() {
    const { toast } = useToast();

    const handleAction = (message: string) => {
        toast({
            title: message,
        });
    };

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
                        Мои друзья <Badge className="ml-2">{friendsList.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="requests">
                        Запросы <Badge className="ml-2">{pendingRequests.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="suggestions">Рекомендации</TabsTrigger>
                </TabsList>

                <TabsContent value="friends" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Список друзей</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {friendsList.map(friend => (
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
                                        <Button variant="ghost" size="icon" onClick={() => handleAction(`Сообщение для ${friend.name} открыто`)}><MessageSquare className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleAction(`${friend.name} удален из друзей`)}><UserMinus className="h-4 w-4" /></Button>
                                    </div>
                                </Card>
                            ))}
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
                             {pendingRequests.map(request => (
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
                                        <Button size="icon" className="bg-green-500 hover:bg-green-600" onClick={() => handleAction(`${request.name} добавлен в друзья`)}><Check className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="destructive" onClick={() => handleAction(`Запрос от ${request.name} отклонен`)}><X className="h-4 w-4" /></Button>
                                    </div>
                                </Card>
                            ))}
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
                           {suggestedFriends.map(suggestion => (
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
                                    <Button onClick={() => handleAction(`Запрос отправлен ${suggestion.name}`)}>
                                        <UserPlus className="mr-2 h-4 w-4"/> Добавить
                                    </Button>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
