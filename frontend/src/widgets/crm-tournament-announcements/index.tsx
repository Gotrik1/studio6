

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Send, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { createAnnouncement, getAnnouncements } from '@/entities/tournament/api/announcements';
import { Skeleton } from '@/shared/ui/skeleton';

type Announcement = {
    id: string;
    subject: string;
    sentTo: number;
    createdAt: string;
    sender: { name: string; };
};

interface CrmTournamentAnnouncementsProps {
    tournamentId: string;
}

export function CrmTournamentAnnouncements({ tournamentId }: CrmTournamentAnnouncementsProps) {
    const { toast } = useToast();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const fetchAnnouncements = async () => {
        setIsLoading(true);
        const result = await getAnnouncements(tournamentId);
        if(result.success) {
            setAnnouncements(result.data);
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить рассылки.' });
        }
        setIsLoading(false);
    };
    
    useEffect(() => {
        fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tournamentId]);

    const handleSend = async () => {
        if (!subject || !message) {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Пожалуйста, заполните тему и сообщение.',
            });
            return;
        }

        setIsSending(true);
        const result = await createAnnouncement(tournamentId, { subject, message });

        if (result.success) {
            await fetchAnnouncements();
            setSubject('');
            setMessage('');
            toast({
                title: 'Рассылка отправлена!',
                description: 'Все участники турнира получили ваше сообщение.',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: result.error || 'Не удалось отправить рассылку.',
            });
        }
        setIsSending(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Новая рассылка</CardTitle>
                    <CardDescription>Создайте и отправьте объявление всем участникам турнира.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ann-subject">Тема</Label>
                        <Input 
                            id="ann-subject"
                            placeholder="Например, Изменение расписания"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            disabled={isSending}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ann-message">Сообщение</Label>
                        <Textarea 
                            id="ann-message"
                            placeholder="Введите текст вашего объявления..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isSending}
                            className="min-h-[150px]"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleSend} disabled={isSending}>
                        {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        <Send className="mr-2 h-4 w-4" />
                        {isSending ? 'Отправка...' : 'Отправить всем участникам'}
                    </Button>
                </CardFooter>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>История рассылок</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Тема</TableHead>
                                    <TableHead>Отправитель</TableHead>
                                    <TableHead className="hidden md:table-cell">Дата</TableHead>
                                    <TableHead className="text-right">Получатели</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {announcements.length > 0 ? announcements.map(ann => (
                                    <TableRow key={ann.id}>
                                        <TableCell className="font-medium">{ann.subject}</TableCell>
                                        <TableCell className="text-muted-foreground">{ann.sender.name}</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                                            {format(new Date(ann.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1 text-muted-foreground">
                                                <Users className="h-4 w-4" />
                                                <span>{ann.sentTo}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">Рассылок еще не было.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
