

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { PlusCircle, Trash2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, UtensilsCrossed, Bot, BookOpen, NotebookText } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { format, addDays, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { FoodLogEntry } from '@/entities/nutrition/model/types';
import type { FoodItem } from '@/entities/nutrition/model/types';
import { useToast } from '@/shared/hooks/use-toast';
import { useNutrition } from '@/shared/context/nutrition-provider';
import { Progress } from '@/shared/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { AiNutritionist } from '@/widgets/ai-nutritionist';
import { Input } from '@/shared/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { AddFoodDialog } from '@/widgets/add-food-dialog';
import { getFoodItems } from '@/entities/nutrition/api/nutrition';
import { Skeleton } from '@/shared/ui/skeleton';
import { MealType } from '@/entities/nutrition/model/enums';

// Diary Tab Component
function NutritionDiaryTab() {
    const { toast } = useToast();
    const [date, setDate] = useState<Date>(new Date());
    const { log, isLoading, totals, targets, deleteFoodLog } = useNutrition();

    const handleDelete = async (id: string, name: string) => {
        await deleteFoodLog(id);
        toast({
            title: 'Запись удалена',
            description: `${name} был(а) удален(а) из вашего дневника.`,
        });
    };
    
    const handleDateChange = (newDate: Date | undefined) => {
        if (newDate) {
            setDate(newDate);
        }
    };

    const meals = Object.values(MealType);

    interface StatCardProps {
        title: string;
        total: number;
        target: number;
        unit: string;
    }
    
    const StatCard = ({ title, total, target, unit }: StatCardProps) => {
        const progress = target > 0 ? (total / target) * 100 : 0;
        return (
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold">{total.toLocaleString('ru-RU')}</p>
                    <p className="text-xs text-muted-foreground">
                        Цель: {target.toLocaleString('ru-RU')} {unit}
                    </p>
                    <Progress value={progress} className="mt-2 h-2" />
                </CardContent>
            </Card>
        )
    };

    return (
        <div className="space-y-6">
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
                     <StatCard title="Калории" total={totals.calories} target={targets.calories} unit="ккал" />
                     <StatCard title="Белки" total={totals.protein} target={targets.protein} unit="г" />
                     <StatCard title="Жиры" total={totals.fat} target={targets.fat} unit="г" />
                     <StatCard title="Углеводы" total={totals.carbs} target={targets.carbs} unit="г" />
                </CardContent>
            </Card>

            <div className="space-y-6">
                {isLoading ? (
                    <Skeleton className="h-48 w-full" />
                ) : (
                    meals.map(meal => {
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
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, item.name)}>
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
                    })
                )}
            </div>
        </div>
    );
}

// Product Catalog Tab Component
function ProductCatalogTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

    useEffect(() => {
        async function loadItems() {
            setIsLoading(true);
            const items = await getFoodItems();
            setFoodItems(items as FoodItem[]);
            setIsLoading(false);
        }
        loadItems();
    }, []);

    const filteredItems = useMemo(() => {
        return foodItems.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [foodItems, searchQuery]);

    const handleAddClick = (item: FoodItem) => {
        setSelectedFoodItem(item);
        setIsAddDialogOpen(true);
    };

    const foodProducts = filteredItems.filter(item => item.category === 'Продукты');
    const supplements = filteredItems.filter(item => item.category === 'Спортивное питание');

    function NutritionCard({ item, onAdd }: { item: FoodItem, onAdd: (item: FoodItem) => void }) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="p-0 relative h-40">
                    <Image
                        src={item.image || 'https://placehold.co/600x400.png'}
                        alt={item.name}
                        fill
                        className="object-cover rounded-t-lg"
                        data-ai-hint={item.imageHint || 'food item'}
                    />
                </CardHeader>
                <CardContent className="p-4 flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="mt-2 text-xs text-muted-foreground space-y-1">
                        <p>К: {item.calories} | Б: {item.protein} | Ж: {item.fat} | У: {item.carbs}</p>
                        {item.description && <p className="italic pt-1">{item.description}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => onAdd(item)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить в рацион
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    const CatalogSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
        </div>
    );

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Поиск по названию..."
                            className="w-full pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="products">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="products">Продукты</TabsTrigger>
                            <TabsTrigger value="supplements">Спортивное питание</TabsTrigger>
                        </TabsList>
                        <TabsContent value="products" className="mt-6">
                            {isLoading ? <CatalogSkeleton /> : foodProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {foodProducts.map(item => (
                                        <NutritionCard key={item.id} item={item} onAdd={handleAddClick} />
                                    ))}
                                </div>
                            ) : (
                                <div className="col-span-full text-center py-16 text-muted-foreground">
                                    <UtensilsCrossed className="h-12 w-12 mx-auto mb-4" />
                                    <p>Ничего не найдено. Попробуйте другой запрос.</p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="supplements" className="mt-6">
                            {isLoading ? <CatalogSkeleton /> : supplements.length > 0 ? (
                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {supplements.map(item => (
                                        <NutritionCard key={item.id} item={item} onAdd={handleAddClick} />
                                    ))}
                                </div>
                            ) : (
                                <div className="col-span-full text-center py-16 text-muted-foreground">
                                     <UtensilsCrossed className="h-12 w-12 mx-auto mb-4" />
                                    <p>Ничего не найдено. Попробуйте другой запрос.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <AddFoodDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                foodItem={selectedFoodItem}
            />
        </>
    )
}

// Main Page Component
export function NutritionCenterPage() {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Центр питания</h1>
                <p className="text-muted-foreground">
                    Все для управления вашим рационом: от AI-диетолога до подробного дневника.
                </p>
            </div>
            
            <Tabs defaultValue="ai-nutritionist">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="ai-nutritionist"><Bot className="mr-2 h-4 w-4" />AI-Диетолог</TabsTrigger>
                    <TabsTrigger value="diary"><NotebookText className="mr-2 h-4 w-4" />Дневник питания</TabsTrigger>
                    <TabsTrigger value="catalog"><BookOpen className="mr-2 h-4 w-4" />База продуктов</TabsTrigger>
                </TabsList>
                <TabsContent value="ai-nutritionist" className="mt-6">
                    <AiNutritionist />
                </TabsContent>
                <TabsContent value="diary" className="mt-6">
                    <NutritionDiaryTab />
                </TabsContent>
                <TabsContent value="catalog" className="mt-6">
                    <ProductCatalogTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
