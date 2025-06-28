'use client';

import { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { teamSports as initialTeamSports, individualSports as initialIndividualSports } from "@/lib/mock-data/sports";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast";

type Sport = { id: string, name: string };

export default function SportsAdminPage() {
    const { toast } = useToast();
    const [teamSports, setTeamSports] = useState<Sport[]>(initialTeamSports);
    const [individualSports, setIndividualSports] = useState<Sport[]>(initialIndividualSports);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newSportName, setNewSportName] = useState('');
    const [newSportId, setNewSportId] = useState('');
    const [newSportType, setNewSportType] = useState('team');

    const filteredTeamSports = useMemo(() => {
        return teamSports.filter(sport =>
            sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sport.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [teamSports, searchQuery]);

    const filteredIndividualSports = useMemo(() => {
        return individualSports.filter(sport =>
            sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sport.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [individualSports, searchQuery]);
    
    const handleAddSport = () => {
        if (!newSportName || !newSportId) {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Пожалуйста, заполните все поля.',
            });
            return;
        }

        const newSport = { name: newSportName, id: newSportId };

        if (newSportType === 'team') {
            setTeamSports(prev => [...prev, newSport].sort((a,b) => a.name.localeCompare(b.name)));
        } else {
            setIndividualSports(prev => [...prev, newSport].sort((a,b) => a.name.localeCompare(b.name)));
        }
        
        toast({
            title: 'Успех!',
            description: `Новый вид спорта "${newSportName}" был добавлен.`,
        });

        setNewSportName('');
        setNewSportId('');
        setNewSportType('team');
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Управление видами спорта</h1>
                    <p className="text-muted-foreground">
                        Просмотр и управление всеми доступными видами спорта на платформе.
                    </p>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Добавить новый вид спорта
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Добавить вид спорта</DialogTitle>
                            <DialogDescription>
                                Введите детали нового вида спорта. ID должен быть уникальным.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Название</Label>
                                <Input id="name" value={newSportName} onChange={(e) => setNewSportName(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="id" className="text-right">ID</Label>
                                <Input id="id" value={newSportId} onChange={(e) => setNewSportId(e.target.value)} className="col-span-3" placeholder="e.g., team_new_sport" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Тип</Label>
                                <RadioGroup defaultValue="team" onValueChange={setNewSportType} className="col-span-3 flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="team" id="r1" />
                                        <Label htmlFor="r1">Командный</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="individual" id="r2" />
                                        <Label htmlFor="r2">Индивидуальный</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddSport}>Добавить</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Поиск по названию или ID..." 
                    className="w-full pl-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Командные виды спорта</CardTitle>
                        <CardDescription>
                            Список всех командных дисциплин.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Название</TableHead>
                                        <TableHead>ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTeamSports.map((sport) => (
                                        <TableRow key={sport.id}>
                                            <TableCell className="font-medium">{sport.name}</TableCell>
                                            <TableCell className="font-mono text-xs">{sport.id}</TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredTeamSports.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">Виды спорта не найдены.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Индивидуальные виды спорта</CardTitle>
                        <CardDescription>
                            Список всех одиночных и парных дисциплин.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Название</TableHead>
                                        <TableHead>ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredIndividualSports.map((sport) => (
                                        <TableRow key={sport.id}>
                                            <TableCell className="font-medium">{sport.name}</TableCell>
                                            <TableCell className="font-mono text-xs">{sport.id}</TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredIndividualSports.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">Виды спорта не найдены.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
