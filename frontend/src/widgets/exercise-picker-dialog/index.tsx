

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Checkbox } from '@/shared/ui/checkbox';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { exercisesList, type Exercise } from '@/shared/lib/mock-data/exercises';
import { Search } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

interface ExercisePickerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelectExercises: (exercises: Exercise[]) => void;
}

const muscleGroups = ['Все', 'Грудь', 'Спина', 'Ноги', 'Плечи', 'Руки', 'Пресс', 'Баскетбол', 'Футбол', 'Valorant'];
const equipmentTypes = ['Все', 'Штанга', 'Гантели', 'Тренажер', 'Собственный вес', 'Мяч', 'Компьютер'];

export function ExercisePickerDialog({ isOpen, onOpenChange, onSelectExercises }: ExercisePickerDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [muscleFilter, setMuscleFilter] = useState('Все');
  const [equipmentFilter, setEquipmentFilter] = useState('Все');

  useEffect(() => {
    if (!isOpen) {
      setSelectedIds(new Set());
      setSearchQuery('');
      setMuscleFilter('Все');
      setEquipmentFilter('Все');
    }
  }, [isOpen]);

  const filteredExercises = useMemo(() => {
    return exercisesList.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscle = muscleFilter === 'Все' || exercise.category === muscleFilter;
      const matchesEquipment = equipmentFilter === 'Все' || exercise.equipment === equipmentFilter;
      return matchesSearch && matchesMuscle && matchesEquipment;
    });
  }, [searchQuery, muscleFilter, equipmentFilter]);

  const handleSelect = (exerciseId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleAddExercises = () => {
    const selected = exercisesList.filter(ex => selectedIds.has(ex.id));
    onSelectExercises(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Выбрать упражнения</DialogTitle>
          <DialogDescription>Выберите одно или несколько упражнений для добавления в тренировочный день.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Поиск упражнений..."
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                 <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium p-2 self-center">Категория:</span>
                    {muscleGroups.map(group => (
                        <Button
                            key={group}
                            size="sm"
                            variant={muscleFilter === group ? 'default' : 'outline'}
                            onClick={() => setMuscleFilter(group)}
                        >
                            {group}
                        </Button>
                    ))}
                </div>
                 <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium p-2 self-center">Инвентарь:</span>
                    {equipmentTypes.map(type => (
                        <Button
                            key={type}
                            size="sm"
                            variant={equipmentFilter === type ? 'default' : 'outline'}
                            onClick={() => setEquipmentFilter(type)}
                        >
                            {type}
                        </Button>
                    ))}
                </div>
            </div>
        </div>

        <ScrollArea className="h-72 border rounded-md">
            <div className="p-4 space-y-2">
                {filteredExercises.length > 0 ? filteredExercises.map(exercise => (
                    <div key={exercise.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                        <Checkbox
                            id={`ex-picker-${exercise.id}`}
                            checked={selectedIds.has(exercise.id)}
                            onCheckedChange={() => handleSelect(exercise.id)}
                        />
                        <label htmlFor={`ex-picker-${exercise.id}`} className="font-medium text-sm cursor-pointer flex-1">
                            {exercise.name}
                             <Badge variant="secondary" className="ml-2">{exercise.category}</Badge>
                             <Badge variant="outline" className="ml-1">{exercise.equipment}</Badge>
                        </label>
                    </div>
                )) : (
                    <div className="text-center text-muted-foreground p-8">
                        Упражнения не найдены.
                    </div>
                )}
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleAddExercises} disabled={selectedIds.size === 0}>
            Добавить ({selectedIds.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
