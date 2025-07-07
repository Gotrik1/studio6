

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { getExercises } from '@/entities/exercise/api/get-exercises';
import type { Exercise } from '@/entities/exercise/model/types';
import { Skeleton } from '@/shared/ui/skeleton';
import { useToast } from '@/shared/hooks/use-toast';
import Image from 'next/image';

const categories = ['Все', 'Грудь', 'Спина', 'Ноги', 'Плечи', 'Руки', 'Пресс', 'Баскетбол', 'Футбол', 'Valorant'];
const equipmentTypes = ['Все', 'Штанга', 'Гантели', 'Тренажер', 'Собственный вес', 'Мяч', 'Компьютер'];

export function ExercisesCatalogPage() {
    const { toast } = useToast();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Все');
    const [equipmentFilter, setEquipmentFilter] = useState('Все');

    useEffect(() => {
        async function loadExercises() {
            setLoading(true);
            try {
                const data = await getExercises();
                setExercises(data);
            } catch {
                toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить упражнения.' });
            } finally {
                setLoading(false);
            }
        }
        loadExercises();
    }, [toast]);

    const filteredExercises = useMemo(() => {
        return exercises.filter(exercise => {
            const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'Все' || exercise.category === categoryFilter;
            const matchesEquipment = equipmentFilter === 'Все' || exercise.equipment === equipmentFilter;
            return matchesSearch && matchesCategory && matchesEquipment;
        });
    }, [exercises, searchQuery, categoryFilter, equipmentFilter]);

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Каталог упражнений</h1>
                <p className="text-muted-foreground">
                    Найдите идеальные упражнения для вашей следующей тренировки.
                </p>
            </div>

            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Поиск упражнений..."
                            className="w-full pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium p-2">Категория:</span>
                        {categories.map(group => (
                            <Button
                                key={group}
                                variant={categoryFilter === group ? 'default' : 'outline'}
                                onClick={() => setCategoryFilter(group)}
                            >
                                {group}
                            </Button>
                        ))}
                    </div>
                     <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium p-2">Оборудование:</span>
                        {equipmentTypes.map(type => (
                            <Button
                                key={type}
                                variant={equipmentFilter === type ? 'default' : 'outline'}
                                onClick={() => setEquipmentFilter(type)}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            {loading ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredExercises.map((exercise: Exercise) => (
                        <Link key={exercise.id} href={`/training/exercises/${exercise.id}`} className="block h-full">
                            <Card 
                                className="flex flex-col overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-primary h-full"
                            >
                                <CardHeader className="p-0 relative h-40">
                                    <Image
                                        src={exercise.image || 'https://placehold.co/600x400.png'}
                                        alt={exercise.name}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={exercise.imageHint || ''}
                                    />
                                </CardHeader>
                                <CardContent className="p-4 flex-1">
                                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <Badge variant="secondary">{exercise.category}</Badge>
                                        <Badge variant="outline">{exercise.equipment}</Badge>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-0">
                                    <div className="w-full text-center p-2 text-sm font-medium text-primary bg-primary/10">
                                        Подробнее
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                    {filteredExercises.length === 0 && (
                        <div className="col-span-full text-center py-16 text-muted-foreground">
                            <p>Упражнения не найдены. Попробуйте изменить фильтры.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
