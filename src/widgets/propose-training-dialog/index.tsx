'use client';

import { useState } from 'react';
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
import { CalendarIcon, Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/shared/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { sportsList } from '@/shared/lib/mock-data/sports';
import { friendsList } from '@/shared/lib/mock-data/friends';

const trainingSchema = z.object({
  friendId: z.string({ required_error: "Выберите друга." }),
  sport: z.string({ required_error: "Выберите дисциплину." }),
  date: z.date({ required_error: "Выберите дату." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Введите время в формате HH:MM."),
  comment: z.string().max(200, 'Комментарий слишком длинный').optional(),
});

type FormValues = z.infer<typeof trainingSchema>;

interface ProposeTrainingDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function ProposeTrainingDialog({ isOpen, onOpenChange }: ProposeTrainingDialogProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(trainingSchema),
        defaultValues: {
            time: '18:00',
            comment: '',
        },
    });

    const onSubmit = (data: FormValues) => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            const friend = friendsList.find(f => f.id === data.friendId);
            toast({
                title: "Предложение отправлено!",
                description: `Ваше предложение о совместной тренировке отправлено игроку ${friend?.name}.`,
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
                            <DialogTitle>Предложить совместную тренировку</DialogTitle>
                            <DialogDescription>Выберите друга и детали тренировки. Отказ от этого предложения не несет штрафов.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                             <FormField control={form.control} name="friendId" render={({ field }) => (
                                <FormItem><FormLabel>Друг</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите друга из списка" /></SelectTrigger></FormControl><SelectContent>{friendsList.map(friend => <SelectItem key={friend.id} value={friend.id}>{friend.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="sport" render={({ field }) => (
                                <FormItem><FormLabel>Дисциплина</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите дисциплину" /></SelectTrigger></FormControl><SelectContent>{sportsList.map(sport => <SelectItem key={sport.id} value={sport.name}>{sport.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Дата</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="time" render={({ field }) => (<FormItem><FormLabel>Время</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                             <FormField control={form.control} name="comment" render={({ field }) => (
                                <FormItem><FormLabel>Комментарий (необязательно)</FormLabel><FormControl><Textarea placeholder="Любые детали или пожелания..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Send className="mr-2 h-4 w-4" />
                                Отправить предложение
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
