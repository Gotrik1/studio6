'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { nutritionItems, type FoodItem } from '@/shared/lib/mock-data/nutrition';
import Image from 'next/image';
import { Search, PlusCircle, Salad, Bot } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

function NutritionCard({ item }: { item: FoodItem }) {
    const { toast } = useToast();

    const handleAddItem = () => {
        toast({
            title: `"${item.name}" добавлено`,
            description: "Продукт добавлен в ваш дневник питания.",
        });
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="p-0 relative h-40">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-t-lg"
                    data-ai-hint={item.imageHint}
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
                <Button className="w-full" onClick={handleAddItem}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить в рацион
                </Button>
            </CardFooter>
        </Card>
    );
}


export function NutritionCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        return nutritionItems.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const foodProducts = filteredItems.filter(item => item.category === 'Продукты');
    const supplements = filteredItems.filter(item => item.category === 'Спортивное питание');

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Центр питания</h1>
                <p className="text-muted-foreground">
                    Каталог продуктов и спортивного питания для составления вашего идеального рациона.
                </p>
            </div>

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
                    <Card className="bg-primary/5 border-primary/20">
                         <CardHeader className="flex flex-row items-center gap-4">
                            <Bot className="h-8 w-8 text-primary flex-shrink-0" />
                            <div>
                                <CardTitle>AI-Диетолог (Скоро)</CardTitle>
                                <CardDescription>
                                    Получайте персональные рекомендации по питанию на основе ваших тренировок и целей.
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </CardContent>
            </Card>

            <Tabs defaultValue="products">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="products">Продукты</TabsTrigger>
                    <TabsTrigger value="supplements">Спортивное питание</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {foodProducts.map(item => (
                            <NutritionCard key={item.id} item={item} />
                        ))}
                    </div>
                     {foodProducts.length === 0 && (
                        <div className="col-span-full text-center py-16 text-muted-foreground">
                            <Salad className="h-12 w-12 mx-auto mb-4" />
                            <p>Ничего не найдено. Попробуйте другой запрос.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="supplements" className="mt-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {supplements.map(item => (
                            <NutritionCard key={item.id} item={item} />
                        ))}
                    </div>
                     {supplements.length === 0 && (
                        <div className="col-span-full text-center py-16 text-muted-foreground">
                             <Salad className="h-12 w-12 mx-auto mb-4" />
                            <p>Ничего не найдено. Попробуйте другой запрос.</p>
                        </div>
                    )}
                </TabsContent>

            </Tabs>
        </div>
    );
}
