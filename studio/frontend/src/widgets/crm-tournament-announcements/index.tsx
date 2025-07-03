'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Send, Users } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { crmAnnouncements as initialAnnouncements, type CrmAnnouncement } from '@/shared/lib/mock-data/crm-announcements';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function CrmTournamentAnnouncements() {
    const { toast } = useToast();
    const [announcements, setAnnouncements] = useState<CrmAnnouncement[]>(initialAnnouncements);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = () => {
        if (!subject || !message) {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Пожалуйста, заполните тему и сообщение.',
            });
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const newAnnouncement: CrmAnnouncement = {
                id: `ann-${Date.now()}`,
                subject,
                timestamp: new Date().toISOString(),
                sentTo: 16, // Mock value, in real app this would be participants count
            };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
            setSubject('');
            setMessage('');
            toast({
                title: 'Рассылка отправлена!',
                description: 'Все участники турнира получили ваше сообщение.',
            });
            setIsLoading(false);
        }, 1000);
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
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ann-message">Сообщение</Label>
                        <Textarea 
                            id="ann-message"
                            placeholder="Введите текст вашего объявления..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading}
                            className="min-h-[150px]"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleSend} disabled={isLoading}>
                        <Send className="mr-2 h-4 w-4" />
                        {isLoading ? 'Отправка...' : 'Отправить всем участникам'}
                    </Button>
                </CardFooter>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>История рассылок</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Тема</TableHead>
                                <TableHead className="hidden md:table-cell">Дата</TableHead>
                                <TableHead className="text-right">Получатели</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {announcements.map(ann => (
                                <TableRow key={ann.id}>
                                    <TableCell className="font-medium">{ann.subject}</TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                                        {format(new Date(ann.timestamp), 'd MMMM yyyy, HH:mm', { locale: ru })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1 text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>{ann.sentTo}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
