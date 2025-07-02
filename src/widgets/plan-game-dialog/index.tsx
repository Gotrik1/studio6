'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/shared/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { cn } from '@/shared/lib/utils';
import { CalendarIcon, Loader2, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/shared/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';

const planGameSchema = z.object({
  date: z.date({ required_error: "Выберите дату." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Введите время в формате HH:MM."),
  duration: z.coerce.number().min(30, "Минимальная длительность 30 минут").max(180, "Максимальная длительность 3 часа"),
});

export type FormValues = z.infer<typeof planGameSchema>;

interface PlanGameDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    playgroundName: string;
    onPlan: (data: FormValues) => void;
    initialDate?: Date;
    initialTime?: string;
}

export function PlanGameDialog({ isOpen, onOpenChange, playgroundName, onPlan, initialDate, initialTime }: PlanGameDialogProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(planGameSchema),
        defaultValues: {
            date: initialDate || new Date(),
            time: initialTime || '19:00',
            duration: 60,
        },
    });
    
    useEffect(() => {
        if(isOpen) {
            form.reset({
                date: initialDate || new Date(),
                time: initialTime || '19:00',
                duration: 60,
            })
        }
    }, [isOpen, initialDate, initialTime, form]);

    const onSubmit = (data: FormValues) => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            onPlan(data);
            toast({
                title: "Игра запланирована!",
                description: `Ваша игра на площадке "${playgroundName}" была добавлена в расписание.`,
            });
            setIsSubmitting(false);
            onOpenChange(false);
        }, 1000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Планирование игры на &quot;{playgroundName}&quot;</DialogTitle>
                            <DialogDescription>Выберите дату и время. Это поможет другим игрокам узнать о ваших планах.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Alert variant="destructive" className="border-yellow-500/50 text-yellow-500 [&>svg]:text-yellow-500">
                                <Info className="h-4 w-4" />
                                <AlertTitle>Важный принцип: Уважение</AlertTitle>
                                <AlertDescription>
                                    Помните, что дворовые площадки — это общественные места. Ваше "бронирование" — это лишь уведомление для других. Относитесь с уважением к тем, кто уже играет на площадке. В случае жалоб на неспортивное поведение могут быть применены санкции.
                                </AlertDescription>
                            </Alert>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Дата</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="time" render={({ field }) => (
                                    <FormItem><FormLabel>Время</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="duration" render={({ field }) => (
                                <FormItem><FormLabel>Продолжительность (в минутах)</FormLabel><FormControl><Input type="number" step="15" {...field} /></FormControl><FormMessage /></FormItem>
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
