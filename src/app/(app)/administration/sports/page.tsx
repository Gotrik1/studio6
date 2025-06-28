
'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { PlusCircle, Search, Trash2, Pencil } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast";

type Sport = { id: string, name: string };
type SportType = 'team' | 'individual';

export default function SportsAdminPage() {
    const { toast } = useToast();
    const [teamSports, setTeamSports] = useState<Sport[]>(initialTeamSports);
    const [individualSports, setIndividualSports] = useState<Sport[]>(initialIndividualSports);
    const [searchQuery, setSearchQuery] = useState('');
    
    // State for the modal
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [sportToEdit, setSportToEdit] = useState<Sport | null>(null);
    const [sportName, setSportName] = useState('');
    const [sportId, setSportId] = useState('');
    const [sportType, setSportType] = useState<SportType>('team');

    const isEditMode = sportToEdit !== null;

    useEffect(() => {
        if (!isDialogOpen) {
            setSportToEdit(null);
        } else {
            if (isEditMode && sportToEdit) {
                setSportName(sportToEdit.name);
                setSportId(sportToEdit.id);
                // Find which list it belongs to for the radio button
                if (teamSports.some(s => s.id === sportToEdit.id)) {
                    setSportType('team');
                } else {
                    setSportType('individual');
                }
            } else {
                // Reset for add mode
                setSportName('');
                setSportId('');
                setSportType('team');
            }
        }
    }, [isDialogOpen, isEditMode, sportToEdit, teamSports]);
    
    const handleOpenDialog = (sport: Sport | null = null) => {
        setSportToEdit(sport);
        setIsDialogOpen(true);
    };

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
    
    const handleSaveSport = () => {
        if (!sportName || !sportId) {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Пожалуйста, заполните все поля.',
            });
            return;
        }

        if (isEditMode) {
            const updateList = (list: Sport[]) => list.map(s => s.id === sportId ? { ...s, name: sportName } : s);

            if (sportType === 'team') {
                setTeamSports(updateList);
            } else {
                setIndividualSports(updateList);
            }

            toast({
                title: 'Успех!',
                description: `Вид спорта "${sportName}" был обновлен.`,
            });

        } else {
            const newSport = { name: sportName, id: sportId };
            if (sportType === 'team') {
                setTeamSports(prev => [...prev, newSport].sort((a,b) => a.name.localeCompare(b.name)));
            } else {
                setIndividualSports(prev => [...prev, newSport].sort((a,b) => a.name.localeCompare(b.name)));
            }
            
            toast({
                title: 'Успех!',
                description: `Новый вид спорта "${sportName}" был добавлен.`,
            });
        }

        setIsDialogOpen(false);
    };

    const handleDeleteSport = (sportId: string, sportType: 'team' | 'individual') => {
        const sportName = (sportType === 'team' ? teamSports : individualSports).find(s => s.id === sportId)?.name;
        if (sportType === 'team') {
            setTeamSports(prev => prev.filter(s => s.id !== sportId));
        } else {
            setIndividualSports(prev => prev.filter(s => s.id !== sportId));
        }
        toast({
            title: 'Вид спорта удален',
            description: `Дисциплина "${sportName}" была успешно удалена.`,
        });
    };
    
    const dialogTitle = isEditMode ? "Редактировать вид спорта" : "Добавить вид спорта";
    const dialogDescription = isEditMode ? "Измените название вида спорта. ID изменить нельзя." : "Введите детали нового вида спорта. ID должен быть уникальным.";
    const dialogButtonText = isEditMode ? "Сохранить изменения" : "Добавить";

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Управление видами спорта</h1>
                    <p className="text-muted-foreground">
                        Просмотр и управление всеми доступными видами спорта на платформе.
                    </p>
                </div>
                 <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить новый вид спорта
                </Button>
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
                                        <TableHead className="w-[120px] text-right">Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTeamSports.map((sport) => (
                                        <TableRow key={sport.id}>
                                            <TableCell className="font-medium">{sport.name}</TableCell>
                                            <TableCell className="font-mono text-xs">{sport.id}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={() => handleOpenDialog(sport)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Это действие необратимо. Вы действительно хотите удалить вид спорта "{sport.name}"?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteSport(sport.id, 'team')}
                                                                className="bg-destructive hover:bg-destructive/90"
                                                            >
                                                                Удалить
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredTeamSports.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Виды спорта не найдены.</TableCell></TableRow>}
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
                                        <TableHead className="w-[120px] text-right">Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredIndividualSports.map((sport) => (
                                        <TableRow key={sport.id}>
                                            <TableCell className="font-medium">{sport.name}</TableCell>
                                            <TableCell className="font-mono text-xs">{sport.id}</TableCell>
                                            <TableCell className="text-right">
                                                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={() => handleOpenDialog(sport)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Это действие необратимо. Вы действительно хотите удалить вид спорта "{sport.name}"?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                             <AlertDialogAction
                                                                onClick={() => handleDeleteSport(sport.id, 'individual')}
                                                                className="bg-destructive hover:bg-destructive/90"
                                                            >
                                                                Удалить
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredIndividualSports.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Виды спорта не найдены.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>{dialogDescription}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Название</Label>
                            <Input id="name" value={sportName} onChange={(e) => setSportName(e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id" className="text-right">ID</Label>
                            <Input id="id" value={sportId} onChange={(e) => setSportId(e.target.value)} className="col-span-3" placeholder="e.g., team_new_sport" disabled={isEditMode} />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Тип</Label>
                            <RadioGroup value={sportType} onValueChange={(v) => setSportType(v as SportType)} className="col-span-3 flex gap-4" disabled={isEditMode}>
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
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Отмена</Button>
                        <Button onClick={handleSaveSport}>{dialogButtonText}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
