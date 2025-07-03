
'use client';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form';
import { useToast } from '@/shared/hooks/use-toast';
import type { Measurement } from '@/shared/lib/mock-data/measurements';

const measurementSchema = z.object({
    weight: z.coerce.number().min(30, "Слишком низкий вес").max(300, "Слишком большой вес"),
    bodyFat: z.coerce.number().optional().or(z.literal('')),
    chest: z.coerce.number().optional().or(z.literal('')),
    waist: z.coerce.number().optional().or(z.literal('')),
    hips: z.coerce.number().optional().or(z.literal('')),
    biceps: z.coerce.number().optional().or(z.literal('')),
    thigh: z.coerce.number().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof measurementSchema>;

interface LogMeasurementDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onLog: (data: Omit<Measurement, 'id' | 'date'>) => void;
    latestMeasurement?: Measurement;
}

export function LogMeasurementDialog({ isOpen, onOpenChange, onLog, latestMeasurement }: LogMeasurementDialogProps) {
    const { toast } = useToast();
    const form = useForm<FormValues>({
        resolver: zodResolver(measurementSchema),
    });

     const handleOpenChange = (open: boolean) => {
        if(open && latestMeasurement) {
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
        onOpenChange(open);
    }

    const onSubmit = (data: FormValues) => {
        const cleanedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value === '' ? undefined : value])
        );

        onLog(cleanedData as Omit<Measurement, 'id' | 'date'>);
        toast({ title: "Замеры сохранены!", description: "Ваш прогресс был успешно записан." });
        onOpenChange(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Новые замеры</DialogTitle>
                    <DialogDescription>Запишите текущие показатели. Заполните только те поля, которые хотите отслеживать.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="weight" render={({ field }) => (
                            <FormItem><Label>Вес (кг)</Label><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="bodyFat" render={({ field }) => (
                             <FormItem><Label>Жир (%)</Label><FormControl><Input type="number" step="0.1" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="chest" render={({ field }) => (<FormItem><Label>Грудь (см)</Label><FormControl><Input type="number" step="0.5" {...field} value={field.value ?? ''}/></FormControl></FormItem>)} />
                            <FormField control={form.control} name="waist" render={({ field }) => (<FormItem><Label>Талия (см)</Label><FormControl><Input type="number" step="0.5" {...field} value={field.value ?? ''}/></FormControl></FormItem>)} />
                            <FormField control={form.control} name="hips" render={({ field }) => (<FormItem><Label>Бедра (см)</Label><FormControl><Input type="number" step="0.5" {...field} value={field.value ?? ''}/></FormControl></FormItem>)} />
                            <FormField control={form.control} name="biceps" render={({ field }) => (<FormItem><Label>Бицепс (см)</Label><FormControl><Input type="number" step="0.5" {...field} value={field.value ?? ''}/></FormControl></FormItem>)} />
                            <FormField control={form.control} name="thigh" render={({ field }) => (<FormItem><Label>Бедро (см)</Label><FormControl><Input type="number" step="0.5" {...field} value={field.value ?? ''}/></FormControl></FormItem>)} />
                        </div>
                         <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                            <Button type="submit">Сохранить</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
