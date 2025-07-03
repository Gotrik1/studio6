'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { PlusCircle } from "lucide-react";
import type { FoodItem } from '@/shared/lib/mock-data/nutrition';
import { useNutrition } from '@/shared/context/nutrition-provider';
import { useToast } from '@/shared/hooks/use-toast';
import type { FoodLogEntry } from '@/shared/lib/mock-data/nutrition-diary';

const meals: FoodLogEntry['meal'][] = ['Завтрак', 'Обед', 'Ужин', 'Перекус'];

interface AddFoodDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    foodItem: FoodItem | null;
}

export function AddFoodDialog({ isOpen, onOpenChange, foodItem }: AddFoodDialogProps) {
    const { addFoodLog } = useNutrition();
    const { toast } = useToast();
    const [grams, setGrams] = useState('100');
    const [meal, setMeal] = useState<FoodLogEntry['meal']>('Перекус');

    useEffect(() => {
        if (isOpen) {
            setGrams('100');
            setMeal('Перекус');
        }
    }, [isOpen]);
    
    if (!foodItem) return null;

    const handleAdd = () => {
        const numGrams = parseInt(grams);
        if (isNaN(numGrams) || numGrams <= 0) {
            toast({ variant: "destructive", title: "Ошибка", description: "Введите корректный вес." });
            return;
        }

        addFoodLog(foodItem, numGrams, meal);
        toast({ title: "Добавлено!", description: `${foodItem.name} (${grams}г) добавлен(о) в дневник.` });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить &quot;{foodItem.name}&quot;</DialogTitle>
                    <DialogDescription>Укажите вес и прием пищи, чтобы добавить продукт в дневник.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="grams">Вес (граммы)</Label>
                            <Input id="grams" type="number" value={grams} onChange={e => setGrams(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meal">Прием пищи</Label>
                             <Select value={meal} onValueChange={(value) => setMeal(value as FoodLogEntry['meal'])}>
                                <SelectTrigger id="meal"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {meals.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                    <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" /> Добавить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
