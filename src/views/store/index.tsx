
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { storeItems, type StoreItem } from '@/shared/lib/mock-data/store';
import { Coins, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/shared/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

const categories = ['Все', ...Array.from(new Set(storeItems.map(item => item.category)))];

export function StorePage() {
    const { toast } = useToast();
    const [categoryFilter, setCategoryFilter] = useState('Все');
    const [sortOrder, setSortOrder] = useState('default');

    const filteredAndSortedItems = useMemo(() => {
        let items = [...storeItems];

        // Filter
        if (categoryFilter !== 'Все') {
            items = items.filter(item => item.category === categoryFilter);
        }

        // Sort
        if (sortOrder === 'price-asc') {
            items.sort((a, b) => {
                if (a.isRealMoney && !b.isRealMoney) return 1;
                if (!a.isRealMoney && b.isRealMoney) return -1;
                return a.price - b.price;
            });
        } else if (sortOrder === 'price-desc') {
            items.sort((a, b) => {
                if (a.isRealMoney && !b.isRealMoney) return 1;
                if (!a.isRealMoney && b.isRealMoney) return -1;
                return b.price - a.price;
            });
        }
        
        return items;
    }, [categoryFilter, sortOrder]);


    const handlePurchase = (item: StoreItem) => {
        toast({
            title: 'Покупка совершена!',
            description: `Вы успешно приобрели "${item.name}".`,
        });
    };

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Магазин</h1>
                <p className="text-muted-foreground">
                    Приобретайте подписки, бустеры и предметы кастомизации за ProDvor Dollars (PD).
                </p>
            </div>
            
            <Card>
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex flex-wrap gap-2 flex-1">
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant={categoryFilter === category ? 'default' : 'outline'}
                                onClick={() => setCategoryFilter(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                    <div className="w-full md:w-auto">
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Сортировка" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">По умолчанию</SelectItem>
                                <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                                <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedItems.map(item => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader className="p-0 relative h-40">
                            <Image src={item.image} alt={item.name} fill className="object-cover rounded-t-lg" data-ai-hint={item.imageHint} />
                        </CardHeader>
                        <CardContent className="p-6 flex-1">
                            <CardTitle>{item.name}</CardTitle>
                            <CardDescription className="mt-2">{item.description}</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handlePurchase(item)}>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                {item.isRealMoney ? `Купить за $${item.price}` : (
                                    <>
                                        Купить за {item.price}
                                        <Coins className="ml-1.5 h-4 w-4 text-amber-300" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {filteredAndSortedItems.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>Товары не найдены. Попробуйте изменить фильтры.</p>
                </div>
            )}
        </div>
    );
}
