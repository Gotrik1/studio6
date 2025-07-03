
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
import { CalendarIcon, Loader2, Send, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/shared/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { sportsList } from '@/shared/lib/mock-data/sports';

const challengeSchema = z.object({
  sport: z.string({ required_error: "Выберите дисциплину." }),
  date: z.date({ required_error: "Выберите дату." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Введите время в формате HH:MM."),
  wager: z.coerce.number().min(0, "Ставка не может быть отрицательной.").optional(),
  comment: z.string().max(200, 'Комментарий слишком длинный').optional(),
});

type FormValues = z.infer<typeof challengeSchema>;

interface ProposeMatchDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    challengedPlayerName: string;
}

export function ProposeMatchDialog({ isOpen, onOpenChange, challengedPlayerName }: ProposeMatchDialogProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(challengeSchema),
        defaultValues: {
            time: '19:00',
            comment: '',
            date: new Date(),
            wager: 50,
        },
    });

    const onSubmit = (data: FormValues) => {
        setIsSubmitting(true);
        console.log("Submitting match challenge:", data); // In a real app, this would be sent to an API
        
        setTimeout(() => {
            toast({
                title: "Вызов брошен!",
                description: `Ваш вызов на матч отправлен игроку ${challengedPlayerName}.`,
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
                            <DialogTitle>Вызов на матч: {challengedPlayerName}</DialogTitle>
                            <DialogDescription>Выберите дисциплину, время и ставку. Игрок получит ваше предложение.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField control={form.control} name="sport" render={({ field }) => (
                                <FormItem><FormLabel>Дисциплина</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите дисциплину" /></SelectTrigger></FormControl><SelectContent>{sportsList.map(sport => <SelectItem key={sport.id} value={sport.name}>{sport.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Дата</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="time" render={({ field }) => (<FormItem><FormLabel>Время</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <FormField control={form.control} name="wager" render={({ field }) => (
                                <FormItem><FormLabel>Ставка (PD)</FormLabel>
                                    <div className="relative">
                                         <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                         <FormControl><Input type="number" {...field} className="pl-9" /></FormControl>
                                    </div>
                                <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="comment" render={({ field }) => (
                                <FormItem><FormLabel>Комментарий (необязательно)</FormLabel><FormControl><Textarea placeholder="Например: 'Давай 1 на 1, на 'Коробке за Пятерочкой'.'" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Send className="mr-2 h-4 w-4" />
                                Бросить вызов
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
