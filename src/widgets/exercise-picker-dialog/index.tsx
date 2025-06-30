
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Checkbox } from '@/shared/ui/checkbox';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { exercisesList, type Exercise } from '@/shared/lib/mock-data/exercises';
import { Search } from 'lucide-react';

interface ExercisePickerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelectExercises: (exercises: Exercise[]) => void;
}

export function ExercisePickerDialog({ isOpen, onOpenChange, onSelectExercises }: ExercisePickerDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Reset state when dialog is closed/opened
    if (!isOpen) {
      setSelectedIds(new Set());
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredExercises = useMemo(() => {
    return exercisesList.filter(exercise => 
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Выбрать упражнения</DialogTitle>
          <DialogDescription>Выберите одно или несколько упражнений для добавления в тренировочный день.</DialogDescription>
        </DialogHeader>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Поиск упражнений..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <ScrollArea className="h-96 border rounded-md">
            <div className="p-4 space-y-2">
                {filteredExercises.map(exercise => (
                    <div key={exercise.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                        <Checkbox
                            id={`ex-${exercise.id}`}
                            checked={selectedIds.has(exercise.id)}
                            onCheckedChange={() => handleSelect(exercise.id)}
                        />
                        <label htmlFor={`ex-${exercise.id}`} className="font-medium text-sm cursor-pointer flex-1">
                            {exercise.name}
                             <span className="text-xs text-muted-foreground ml-2">({exercise.muscleGroup})</span>
                        </label>
                    </div>
                ))}
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
