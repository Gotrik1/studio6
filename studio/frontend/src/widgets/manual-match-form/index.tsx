
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/shared/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { CalendarIcon, Loader2, Send } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { teams } from '@/shared/lib/mock-data/teams';
import { sportsList } from '@/shared/lib/mock-data/sports';
import { playgroundsList } from '@/shared/lib/mock-data/playgrounds';

const challengeSchema = z.object({
  opponentId: z.string({ required_error: "Выберите соперника." }),
  sport: z.string({ required_error: "Выберите дисциплину." }),
  date: z.date({ required_error: "Выберите дату." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Введите время в формате HH:MM."),
  venueId: z.string({ required_error: "Выберите площадку." }),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof challengeSchema>;

export function ManualMatchForm() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(challengeSchema),
        defaultValues: {
            time: '19:00',
            comment: '',
        },
    });

    const onSubmit = (data: FormValues) => {
        setIsSubmitting(true);
        console.log(data); // In a real app, this would be sent to an API
        
        setTimeout(() => {
            const opponent = teams.find(t => t.slug === data.opponentId);
            toast({
                title: "Вызов отправлен!",
                description: `Ваш вызов на матч отправлен команде "${opponent?.name}".`,
            });
            setIsSubmitting(false);
            router.push('/matches');
        }, 1000);
    };

    return (
        <Card className="max-w-3xl mx-auto mt-4">
            <CardHeader>
                <CardTitle>Ручной вызов</CardTitle>
                <CardDescription>Отправьте прямой вызов на матч конкретной команде.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField control={form.control} name="opponentId" render={({ field }) => (
                                <FormItem><FormLabel>Команда-соперник</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите команду" /></SelectTrigger></FormControl><SelectContent>{teams.map(team => <SelectItem key={team.slug} value={team.slug}>{team.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="sport" render={({ field }) => (
                                <FormItem><FormLabel>Дисциплина</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите дисциплину" /></SelectTrigger></FormControl><SelectContent>{sportsList.map(sport => <SelectItem key={sport.id} value={sport.name}>{sport.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Дата</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                              <FormField control={form.control} name="time" render={({ field }) => (
                                <FormItem><FormLabel>Время</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="venueId" render={({ field }) => (
                                <FormItem><FormLabel>Место проведения</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите площадку" /></SelectTrigger></FormControl><SelectContent>{playgroundsList.map(venue => <SelectItem key={venue.id} value={venue.id}>{venue.name} ({venue.address})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="comment" render={({ field }) => (
                                <FormItem><FormLabel>Комментарий (необязательно)</FormLabel><FormControl><Textarea placeholder="Любые детали или пожелания..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Send className="mr-2 h-4 w-4" />
                            Отправить вызов
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
