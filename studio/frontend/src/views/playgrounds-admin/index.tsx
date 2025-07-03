'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Check, Trash2, Clock } from 'lucide-react';
import { playgroundsList as initialPlaygrounds, type Playground } from '@/shared/lib/mock-data/playgrounds';
import { useToast } from '@/shared/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import Link from 'next/link';

export function PlaygroundsAdminPage() {
    const { toast } = useToast();
    const [playgrounds, setPlaygrounds] = useState<Playground[]>(initialPlaygrounds);
    const [statusFilter, setStatusFilter] = useState('Все');

    const filteredPlaygrounds = useMemo(() => {
        return playgrounds.filter(p => statusFilter === 'Все' || (statusFilter === 'Одобренные' && p.status === 'approved') || (statusFilter === 'На модерации' && p.status === 'pending_moderation'));
    }, [playgrounds, statusFilter]);

    const handleApprove = (id: string) => {
        setPlaygrounds(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
        toast({ title: 'Площадка одобрена', description: 'Статус площадки изменен на "Одобрено".' });
    };

    const handleDelete = (id: string) => {
        setPlaygrounds(prev => prev.filter(p => p.id !== id));
        toast({ title: 'Площадка удалена', variant: 'destructive' });
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление площадками</h1>
                <p className="text-muted-foreground">Модерация, одобрение и удаление площадок, добавленных пользователями.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Список всех площадок</CardTitle>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Все">Все статусы</SelectItem>
                                <SelectItem value="Одобренные">Одобренные</SelectItem>
                                <SelectItem value="На модерации">На модерации</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Название</TableHead>
                                <TableHead className="hidden md:table-cell">Адрес</TableHead>
                                <TableHead className="hidden lg:table-cell">Добавил</TableHead>
                                <TableHead className="text-center">Статус</TableHead>
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPlaygrounds.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <Link href={`/playgrounds/${p.id}`} className="font-medium hover:underline">{p.name}</Link>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{p.address}</TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={p.creator.avatar} />
                                                <AvatarFallback>{p.creator.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>{p.creator.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {p.status === 'approved' ? (
                                            <Badge variant="default" className="bg-green-500 hover:bg-green-600"><Check className="mr-1 h-3 w-3"/> Одобрено</Badge>
                                        ) : (
                                            <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600"><Clock className="mr-1 h-3 w-3"/> На модерации</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {p.status === 'pending_moderation' && (
                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleApprove(p.id)}>
                                                <Check className="mr-1 h-4 w-4 text-green-500" /> Одобрить
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                        </Button>
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
