'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { PlusCircle, Trash2, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { format, addDays, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { nutritionDiaryData, type FoodLogEntry } from '@/shared/lib/mock-data/nutrition-diary';
import { useToast } from '@/shared/hooks/use-toast';
import Link from 'next/link';

const meals: FoodLogEntry['meal'][] = ['Завтрак', 'Обед', 'Ужин', 'Перекус'];

export function NutritionDiaryPage() {
    const { toast } = useToast();
    const [date, setDate] = useState<Date>(new Date());
    const [log, setLog] = useState<FoodLogEntry[]>(nutritionDiaryData);

    const totals = log.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        fat: acc.fat + item.fat,
        carbs: acc.carbs + item.carbs,
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

    const handleDelete = (id: string) => {
        setLog(prev => prev.filter(item => item.id !== id));
        toast({
            title: 'Запись удалена',
            description: 'Продукт был удален из вашего дневника.',
        });
    };
    
    // In a real app, changing the date would fetch new data.
    // For this demo, we'll just show the same mock data for any date.
    const handleDateChange = (newDate: Date | undefined) => {
        if (newDate) {
            setDate(newDate);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Дневник питания</h1>
                    <p className="text-muted-foreground">Отслеживайте свой рацион, чтобы достигать целей быстрее.</p>
                </div>
                 <Button asChild>
                    <Link href="/training/nutrition">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить продукт
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <Button variant="outline" size="icon" onClick={() => handleDateChange(subDays(date, 1))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-64">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(date, 'EEEE, d MMMM yyyy', { locale: ru })}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                         <Button variant="outline" size="icon" onClick={() => handleDateChange(addDays(date, 1))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Калории</CardDescription>
                            <CardTitle className="text-3xl">{totals.calories.toLocaleString()}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Белки</CardDescription>
                            <CardTitle className="text-3xl">{totals.protein} г</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Жиры</CardDescription>
                            <CardTitle className="text-3xl">{totals.fat} г</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Углеводы</CardDescription>
                            <CardTitle className="text-3xl">{totals.carbs} г</CardTitle>
                        </CardHeader>
                    </Card>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {meals.map(meal => {
                    const mealItems = log.filter(item => item.meal === meal);
                    if (mealItems.length === 0) return null;

                    return (
                        <Card key={meal}>
                            <CardHeader>
                                <CardTitle>{meal}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Продукт</TableHead>
                                            <TableHead className="text-center">Граммы</TableHead>
                                            <TableHead className="text-center">Ккал</TableHead>
                                            <TableHead className="text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mealItems.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell className="text-center">{item.grams}</TableCell>
                                                <TableCell className="text-center">{item.calories}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
