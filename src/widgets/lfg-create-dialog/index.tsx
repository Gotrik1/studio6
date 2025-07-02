
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { cn } from '@/shared/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { sportsList } from '@/shared/lib/mock-data/sports';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/shared/ui/dialog';
import type { LfgLobby } from '@/app/providers/lfg-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

const lfgSchema = z.object({
  sport: z.string({ required_error: "Выберите дисциплину." }),
  location: z.string().min(5, 'Укажите более точное местоположение.'),
  startTime: z.date({ required_error: "Выберите дату." }),
  duration: z.coerce.number().min(30, "Минимальная длительность 30 минут").max(180, "Максимальная длительность 3 часа"),
  playersNeeded: z.coerce.number().min(2, 'Нужно как минимум 2 игрока.').max(22, 'Слишком много игроков.'),
  comment: z.string().min(10, 'Добавьте комментарий, чтобы игрокам было понятнее.').max(200, 'Комментарий слишком длинный.'),
});

type FormValues = z.infer<typeof lfgSchema>;

interface LfgCreateDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onCreate: (data: Omit<LfgLobby, 'id' | 'creator' | 'playersJoined' | 'endTime'> & { duration: number }) => void;
}

export function LfgCreateDialog({ isOpen, onOpenChange, onCreate }: LfgCreateDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(lfgSchema),
        defaultValues: {
            duration: 60,
            playersNeeded: 4,
            startTime: new Date(),
        },
    });

    const onSubmit = (data: FormValues) => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            onCreate(data);
            setIsSubmitting(false);
            onOpenChange(false);
            form.reset();
        }, 1000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Создать лобби для поиска игры</DialogTitle>
                            <DialogDescription>Заполните детали, чтобы другие игроки могли присоединиться к вам.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="sport" render={({ field }) => (
                                    <FormItem><FormLabel>Вид спорта</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите дисциплину" /></SelectTrigger></FormControl><SelectContent>{sportsList.map(sport => <SelectItem key={sport.id} value={sport.name}>{sport.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="playersNeeded" render={({ field }) => (
                                    <FormItem><FormLabel>Сколько игроков нужно?</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                             <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem><FormLabel>Место</FormLabel><FormControl><Input placeholder="Например, Парк Горького, площадка #2" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="startTime" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Дата и время</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP HH:mm", {locale: ru})) : (<span>Выберите дату и время</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="duration" render={({ field }) => (<FormItem><FormLabel>Длительность (мин)</FormLabel><FormControl><Input type="number" step="15" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <FormField control={form.control} name="comment" render={({ field }) => (
                                <FormItem><FormLabel>Комментарий</FormLabel><FormControl><Textarea placeholder="Опишите детали игры: уровень игроков, цель (тренировка/развлечение) и т.д." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Создать лобби
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
