'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/shared/hooks/use-toast';
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
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/shared/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { playgroundsList } from '@/shared/lib/mock-data/playgrounds';
import { useState } from 'react';
import type { TeamPractice } from '@/shared/lib/mock-data/team-practices';

const practiceSchema = z.object({
  title: z.string().min(5, 'Название должно содержать не менее 5 символов.'),
  date: z.date({ required_error: "Выберите дату." }),
  time: z.string().regex(/^([01]\\d|2[0-3]):([0-5]\\d)$/, "Введите время в формате HH:MM."),
  playgroundId: z.string({ required_error: "Выберите площадку." }),
  description: z.string().min(10, 'Добавьте описание (минимум 10 символов).'),
});

type FormValues = z.infer<typeof practiceSchema>;

interface SchedulePracticeDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSchedule: (data: Omit<TeamPractice, 'id' | 'location' | 'date'> & { date: Date }) => void;
}

export function SchedulePracticeDialog({ isOpen, onOpenChange, onSchedule }: SchedulePracticeDialogProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(practiceSchema),
        defaultValues: {
            date: new Date(),
            time: '19:00',
        },
    });

    const onSubmit = (data: FormValues) => {
        setIsSubmitting(true);
        // Combine date and time
        const [hours, minutes] = data.time.split(':').map(Number);
        const combinedDate = new Date(data.date);
        combinedDate.setHours(hours, minutes, 0, 0);

        const playground = playgroundsList.find(p => p.id === data.playgroundId);
        if (!playground) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Выбранная площадка не найдена.' });
            setIsSubmitting(false);
            return;
        }

        setTimeout(() => {
            onSchedule({ ...data, date: combinedDate });
            toast({
                title: "Тренировка запланирована!",
                description: `Командная тренировка "${data.title}" добавлена в расписание.`
            });
            setIsSubmitting(false);
            onOpenChange(false);
            form.reset();
        }, 1000);
    };
    
    return (
         <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Запланировать командную тренировку</DialogTitle>
                            <DialogDescription>Все участники команды получат уведомление.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Тема тренировки</FormLabel><FormControl><Input placeholder="Например, Отработка стандартных положений" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Дата</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="time" render={({ field }) => (<FormItem><FormLabel>Время</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <FormField control={form.control} name="playgroundId" render={({ field }) => (
                                <FormItem><FormLabel>Место проведения</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите площадку" /></SelectTrigger></FormControl><SelectContent>{playgroundsList.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Описание</FormLabel><FormControl><Textarea placeholder="Опишите цели и задачи тренировки..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Запланировать
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
