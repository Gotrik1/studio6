
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import type { FoodItem } from '@/entities/nutrition/model/types';
import { useNutrition } from '@/shared/context/nutrition-provider';
import { useToast } from '@/shared/hooks/use-toast';
import { MealType } from '@/entities/nutrition/model/enums';

const addFoodSchema = z.object({
  grams: z.coerce.number().min(1, 'Вес должен быть больше 0.'),
  meal: z.nativeEnum(MealType, { required_error: 'Выберите прием пищи.' }),
});

type FormValues = z.infer<typeof addFoodSchema>;


interface AddFoodDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    foodItem: FoodItem | null;
}

export function AddFoodDialog({ isOpen, onOpenChange, foodItem }: AddFoodDialogProps) {
    const { addFoodLog } = useNutrition();
    const { toast } = useToast();
    const meals = Object.values(MealType);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(addFoodSchema),
        defaultValues: {
            grams: 100,
            meal: MealType.Snack,
        },
    });

    useEffect(() => {
        if (!isOpen) {
            form.reset({ grams: 100, meal: MealType.Snack });
        }
    }, [isOpen, form]);
    
    if (!foodItem) return null;

    const onSubmit = async (data: FormValues) => {
        try {
            await addFoodLog(foodItem, data.grams, data.meal);
            toast({ title: "Добавлено!", description: `${foodItem.name} (${data.grams}г) добавлен(о) в дневник.` });
            onOpenChange(false);
        } catch(e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось добавить запись в дневник.' });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Добавить &quot;{foodItem.name}&quot;</DialogTitle>
                            <DialogDescription>Укажите вес и прием пищи, чтобы добавить продукт в дневник.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="grams" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Вес (граммы)</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                 <FormField control={form.control} name="meal" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Прием пищи</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>{meals.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                <PlusCircle className="mr-2 h-4 w-4" /> Добавить
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
