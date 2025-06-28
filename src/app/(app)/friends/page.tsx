'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { friendsList, incomingRequests as initialIncoming, outgoingRequests as initialOutgoing } from '@/lib/mock-data/friends';
import { Users, UserPlus, Send, Check, X, MessageSquare, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function FriendsPage() {
    const { toast } = useToast();
    const [incoming, setIncoming] = useState(initialIncoming);
    const [outgoing, setOutgoing] = useState(initialOutgoing);

    const handleAccept = (id: string) => {
        const request = incoming.find(r => r.id === id);
        if (!request) return;
        setIncoming(prev => prev.filter(r => r.id !== id));
        // In a real app, you'd add this user to the friends list
        toast({ title: "Заявка принята", description: `${request.name} теперь в вашем списке друзей.` });
    };

    const handleDecline = (id: string) => {
        const request = incoming.find(r => r.id === id);
        if (!request) return;
        setIncoming(prev => prev.filter(r => r.id !== id));
        toast({ title: "Заявка отклонена", description: `Вы отклонили заявку от ${request.name}.`, variant: 'destructive' });
    };
    
    const handleCancel = (id: string) => {
        const request = outgoing.find(r => r.id === id);
        if (!request) return;
        setOutgoing(prev => prev.filter(r => r.id !== id));
        toast({ title: "Заявка отменена", description: `Вы отменили заявку в друзья для ${request.name}.` });
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Друзья</h1>
                    <p className="text-muted-foreground">Управляйте вашими социальными связями на платформе.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Найти друга..." className="w-full sm:w-64 pl-10" />
                </div>
            </div>

            <Tabs defaultValue="friends">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="friends"><Users className="mr-2 h-4 w-4"/>Мои друзья</TabsTrigger>
                    <TabsTrigger value="incoming">
                        Входящие
                        {incoming.length > 0 && <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{incoming.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="outgoing"><Send className="mr-2 h-4 w-4"/>Отправленные</TabsTrigger>
                </TabsList>
                <TabsContent value="friends" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Список друзей</CardTitle>
                            <CardDescription>Люди, с которыми вы на связи.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {friendsList.map(friend => (
                                    <Card key={friend.id} className="p-4 flex items-center justify-between">
                                        <Link href={friend.profileUrl} className="flex items-center gap-3">
                                            <div className="relative">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={friend.avatar} data-ai-hint={friend.avatarHint} />
                                                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {friend.status === 'online' && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{friend.name}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{friend.status}</p>
                                            </div>
                                        </Link>
                                        <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4"/></Button>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="incoming" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Входящие заявки</CardTitle>
                            <CardDescription>Люди, которые хотят добавить вас в друзья.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {incoming.length > 0 ? incoming.map(req => (
                                <Card key={req.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <Link href={req.profileUrl} className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={req.avatar} data-ai-hint={req.avatarHint} />
                                            <AvatarFallback>{req.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{req.name}</p>
                                            <p className="text-xs text-muted-foreground">{req.mutualFriends} общих друзей</p>
                                        </div>
                                    </Link>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleAccept(req.id)}><Check className="mr-2 h-4 w-4"/>Принять</Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDecline(req.id)}><X className="mr-2 h-4 w-4"/>Отклонить</Button>
                                    </div>
                                </Card>
                            )) : (
                                <p className="text-center text-sm text-muted-foreground py-10">Нет входящих заявок.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="outgoing" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Отправленные заявки</CardTitle>
                            <CardDescription>Люди, которым вы отправили заявку в друзья.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {outgoing.length > 0 ? outgoing.map(req => (
                                <Card key={req.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <Link href={req.profileUrl} className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={req.avatar} data-ai-hint={req.avatarHint} />
                                            <AvatarFallback>{req.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-semibold">{req.name}</p>
                                    </Link>
                                    <Button size="sm" variant="destructive" onClick={() => handleCancel(req.id)}><Trash2 className="mr-2 h-4 w-4"/>Отменить</Button>
                                </Card>
                            )) : (
                                 <p className="text-center text-sm text-muted-foreground py-10">Нет отправленных заявок.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
