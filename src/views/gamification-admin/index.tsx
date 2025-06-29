'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useToast } from '@/shared/hooks/use-toast';
import { Award, PlusCircle, Trash2 } from 'lucide-react';
import { RANKS } from '@/shared/config/ranks';
import { quests as initialQuests } from '@/shared/lib/mock-data/gamification';
import { cn } from '@/shared/lib/utils';

type Quest = (typeof initialQuests)[0];

export function GamificationAdminPage() {
    const { toast } = useToast();
    const [quests, setQuests] = useState<Quest[]>(initialQuests);
    const [newQuest, setNewQuest] = useState({ title: '', description: '', reward: 100, href: '/' });

    const handleAddQuest = () => {
        if (!newQuest.title || !newQuest.description) {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Пожалуйста, заполните все поля для нового квеста.',
            });
            return;
        }

        const questToAdd: Quest = {
            id: `q-${Date.now()}`,
            ...newQuest,
            isCompleted: false, // New quests are always not completed
        };

        setQuests(prev => [...prev, questToAdd]);
        setNewQuest({ title: '', description: '', reward: 100, href: '/' });
        toast({
            title: 'Квест добавлен!',
            description: `Новый квест "${newQuest.title}" был успешно добавлен.`,
        });
    };
    
    const handleDeleteQuest = (questId: string) => {
        setQuests(prev => prev.filter(q => q.id !== questId));
        toast({
            title: 'Квест удален',
        });
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление геймификацией</h1>
                <p className="text-muted-foreground">
                    Настройте ранги, квесты и другие игровые элементы платформы.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Управление квестами</CardTitle>
                            <CardDescription>Добавляйте и удаляйте квесты для пользователей.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Название</TableHead>
                                        <TableHead>Награда (PD)</TableHead>
                                        <TableHead className="text-right">Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quests.map(quest => (
                                        <TableRow key={quest.id}>
                                            <TableCell className="font-medium">{quest.title}</TableCell>
                                            <TableCell>{quest.reward}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteQuest(quest.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Добавить новый квест</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="quest-title">Название</Label>
                                <Input 
                                    id="quest-title" 
                                    placeholder="Например, 'Душа компании'" 
                                    value={newQuest.title}
                                    onChange={(e) => setNewQuest(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="quest-desc">Описание</Label>
                                <Input 
                                    id="quest-desc" 
                                    placeholder="Например, 'Добавьте 5 друзей'" 
                                    value={newQuest.description}
                                    onChange={(e) => setNewQuest(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                    <Label htmlFor="quest-reward">Награда (PD)</Label>
                                    <Input 
                                        id="quest-reward" 
                                        type="number"
                                        value={newQuest.reward}
                                        onChange={(e) => setNewQuest(prev => ({ ...prev, reward: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quest-href">Ссылка</Label>
                                    <Input 
                                        id="quest-href" 
                                        placeholder="/friends" 
                                        value={newQuest.href}
                                        onChange={(e) => setNewQuest(prev => ({ ...prev, href: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                         <CardFooter>
                            <Button className="w-full" onClick={handleAddQuest}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Добавить квест
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Ранги пользователей</CardTitle>
                        <CardDescription>Ранги, которые пользователи получают за накопление PD.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ранг</TableHead>
                                    <TableHead className="text-right">Очки (PD)</TableHead>
                                </TableRow>
                            </TableHeader>
                             <TableBody>
                                {RANKS.map(rank => (
                                    <TableRow key={rank.name}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Award className={cn("h-4 w-4", rank.color)} />
                                                <span className="font-medium">{rank.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{rank.minPoints.toLocaleString('ru-RU')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
