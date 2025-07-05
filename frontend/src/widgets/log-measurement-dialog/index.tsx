'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { useToast } from '@/shared/hooks/use-toast';
import type { Measurement } from '@/entities/user/model/types';
import { Loader2 } from 'lucide-react';

const measurementSchema = z.object({
    weight: z.coerce.number().min(30, "Слишком низкий вес").max(300, "Слишком большой вес"),
    bodyFat: z.coerce.number().min(1, "Неверное значение").max(70, "Неверное значение").optional().or(z.literal('')),
    chest: z.coerce.number().min(30).max(200).optional().or(z.literal('')),
    waist: z.coerce.number().min(30).max(200).optional().or(z.literal('')),
    hips: z.coerce.number().min(30).max(200).optional().or(z.literal('')),
    biceps: z.coerce.number().min(10).max(100).optional().or(z.literal('')),
    thigh: z.coerce.number().min(20).max(150).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof measurementSchema>;

interface LogMeasurementDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onLog: (data: Omit<Measurement, 'id' | 'date'>) => Promise<{ success: boolean; error?: string | undefined; data: any; status: number; }>;
    latestMeasurement?: Measurement;
}

export function LogMeasurementDialog({ isOpen, onOpenChange, onLog, latestMeasurement }: LogMeasurementDialogProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(measurementSchema),
    });

     useEffect(() => {
        if(isOpen && latestMeasurement) {
            form.reset({
                weight: latestMeasurement.weight,
                bodyFat: latestMeasurement.bodyFat,
                chest: latestMeasurement.chest,
                waist: latestMeasurement.waist,
                hips: latestMeasurement.hips,
                biceps: latestMeasurement.biceps,
                thigh: latestMeasurement.thigh,
            });
        }
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen, latestMeasurement, form]);

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        const cleanedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value === '' ? undefined : value])
        );

        const result = await onLog(cleanedData as Omit<Measurement, 'id' | 'date'>);
        
        if (result.success) {
            toast({ title: "Замеры сохранены!", description: "Ваш прогресс был успешно записан." });
            onOpenChange(false);
        } else {
             toast({ variant: 'destructive', title: 'Ошибка', description: result.error || 'Не удалось сохранить замеры.' });
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Новые замеры</DialogTitle>
                    <DialogDescription>Запишите текущие показатели. Заполните только те поля, которые хотите отслеживать.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="weight" render={({ field }) => (
                            <FormItem><FormLabel>Вес (кг)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="bodyFat" render={({ field }) => (
                             <FormItem><FormLabel>Жир (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="chest" render={({ field }) => (<FormItem><Label>Грудь (см)</Label><FormControl><Input type="number" step="0.5" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="waist" render={({ field }) => (<FormItem><Label>Талия (см)</Label><FormControl><Input type="number" step="0.5" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="hips" render={({ field }) => (<FormItem><Label>Бедра (см)</Label><FormControl><Input type="number" step="0.5" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="biceps" render={({ field }) => (<FormItem><Label>Бицепс (см)</Label><FormControl><Input type="number" step="0.5" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="thigh" render={({ field }) => (<FormItem><Label>Бедро (см)</Label><FormControl><Input type="number" step="0.5" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
                        </div>
                         <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Сохранить
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
