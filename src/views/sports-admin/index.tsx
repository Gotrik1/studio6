'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { useToast } from '@/shared/hooks/use-toast';
import { sportsList as initialSports, type Sport } from '@/shared/lib/mock-data/sports';
import * as LucideIcons from 'lucide-react';

const iconComponents: { [key: string]: LucideIcons.LucideIcon } = LucideIcons;

export function SportsAdminPage() {
    const { toast } = useToast();
    const [sports, setSports] = useState<Sport[]>(initialSports);
    const [newSport, setNewSport] = useState({ name: '', type: 'Киберспорт' as const, icon: 'Gamepad2' });

    const handleAddSport = () => {
        if (!newSport.name || !newSport.icon) {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Пожалуйста, заполните все поля.',
            });
            return;
        }

        if (!iconComponents[newSport.icon as keyof typeof iconComponents]) {
             toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: `Иконка с именем "${newSport.icon}" не найдена в lucide-react.`,
            });
            return;
        }

        const newSportToAdd: Sport = {
            id: `sport-${Date.now()}`,
            ...newSport
        };

        setSports(prev => [...prev, newSportToAdd]);
        setNewSport({ name: '', type: 'Киберспорт', icon: 'Gamepad2' });
        toast({
            title: 'Дисциплина добавлена!',
            description: `Новая дисциплина "${newSport.name}" была успешно добавлена.`,
        });
    };

    const handleDeleteSport = (sportId: string) => {
        setSports(prev => prev.filter(s => s.id !== sportId));
        toast({
            title: 'Дисциплина удалена',
        });
    };

    const IconForSport = ({ iconName }: { iconName: string }) => {
        const Icon = iconComponents[iconName as keyof typeof iconComponents] || LucideIcons.HelpCircle;
        return <Icon className="h-5 w-5 text-muted-foreground" />;
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Управление видами спорта</h1>
                <p className="text-muted-foreground">
                    Добавляйте, редактируйте и удаляйте спортивные дисциплины, доступные на платформе.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Список дисциплин</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Иконка</TableHead>
                                    <TableHead>Название</TableHead>
                                    <TableHead>Тип</TableHead>
                                    <TableHead className="text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sports.map(sport => (
                                    <TableRow key={sport.id}>
                                        <TableCell>
                                            <IconForSport iconName={sport.icon} />
                                        </TableCell>
                                        <TableCell className="font-medium">{sport.name}</TableCell>
                                        <TableCell>{sport.type}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSport(sport.id)}>
                                                <LucideIcons.Trash2 className="h-4 w-4 text-destructive" />
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
                        <CardTitle>Добавить дисциплину</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sport-name">Название</Label>
                            <Input 
                                id="sport-name" 
                                placeholder="Например, Valorant" 
                                value={newSport.name}
                                onChange={(e) => setNewSport(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="sport-type">Тип</Label>
                            <Select 
                                value={newSport.type} 
                                onValueChange={(value: 'Киберспорт' | 'Спорт') => setNewSport(prev => ({...prev, type: value}))}
                            >
                                <SelectTrigger id="sport-type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Киберспорт">Киберспорт</SelectItem>
                                    <SelectItem value="Спорт">Спорт</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sport-icon">Название иконки (Lucide)</Label>
                            <Input 
                                id="sport-icon" 
                                placeholder="Например, Gamepad2" 
                                value={newSport.icon}
                                onChange={(e) => setNewSport(prev => ({ ...prev, icon: e.target.value }))}
                            />
                        </div>
                        <Button className="w-full" onClick={handleAddSport}>
                           <LucideIcons.PlusCircle className="mr-2 h-4 w-4" /> Добавить
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
