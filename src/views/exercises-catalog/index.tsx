'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { exercisesList, type Exercise } from '@/shared/lib/mock-data/exercises';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { ExerciseDetailsDialog } from '@/widgets/exercise-details-dialog';

const muscleGroups = ['Все', 'Грудь', 'Спина', 'Ноги', 'Плечи', 'Руки', 'Пресс'];
const equipmentTypes = ['Все', 'Штанга', 'Гантели', 'Тренажер', 'Собственный вес'];

export function ExercisesCatalogPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [muscleFilter, setMuscleFilter] = useState('Все');
    const [equipmentFilter, setEquipmentFilter] = useState('Все');

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const filteredExercises = useMemo(() => {
        return exercisesList.filter(exercise => {
            const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesMuscle = muscleFilter === 'Все' || exercise.muscleGroup === muscleFilter;
            const matchesEquipment = equipmentFilter === 'Все' || exercise.equipment === equipmentFilter;
            return matchesSearch && matchesMuscle && matchesEquipment;
        });
    }, [searchQuery, muscleFilter, equipmentFilter]);

    const handleCardClick = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setIsDetailsOpen(true);
    };

    return (
        <div className="space-y-6">
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
                        <span className="text-sm font-medium p-2">Мышцы:</span>
                        {muscleGroups.map(group => (
                            <Button
                                key={group}
                                variant={muscleFilter === group ? 'default' : 'outline'}
                                onClick={() => setMuscleFilter(group)}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredExercises.map((exercise: Exercise) => (
                    <Card 
                        key={exercise.id} 
                        className="flex flex-col overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                        onClick={() => handleCardClick(exercise)}
                    >
                        <CardHeader className="p-0 relative h-40">
                            <Image
                                src={exercise.image}
                                alt={exercise.name}
                                fill
                                className="object-cover"
                                data-ai-hint={exercise.imageHint}
                            />
                        </CardHeader>
                        <CardContent className="p-4 flex-1">
                            <CardTitle className="text-lg">{exercise.name}</CardTitle>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <Badge variant="secondary">{exercise.muscleGroup}</Badge>
                                <Badge variant="outline">{exercise.equipment}</Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="p-0">
                            <div className="w-full text-center p-2 text-sm font-medium text-primary bg-primary/10">
                                Подробнее
                            </div>
                        </CardFooter>
                    </Card>
                ))}
                 {filteredExercises.length === 0 && (
                    <div className="col-span-full text-center py-16 text-muted-foreground">
                        <p>Упражнения не найдены. Попробуйте изменить фильтры.</p>
                    </div>
                )}
            </div>
            <ExerciseDetailsDialog 
                isOpen={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                exercise={selectedExercise}
            />
        </div>
    );
}
