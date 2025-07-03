
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { sportsList } from '@/shared/lib/mock-data/sports';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { Challenge } from '@/shared/lib/mock-data/challenges';

const challengeSchema = z.object({
  title: z.string().min(5, 'Название должно быть не менее 5 символов.').max(50, 'Название слишком длинное.'),
  description: z.string().min(10, 'Описание должно быть не менее 10 символов.').max(200, 'Описание слишком длинное.'),
  discipline: z.string({ required_error: "Выберите дисциплину." }),
  wager: z.coerce.number().min(0, "Ставка не может быть отрицательной.").max(10000, "Слишком большая ставка."),
});

type FormValues = Omit<Challenge, 'id' | 'creator' | 'status'>;

interface ChallengeCreateDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onCreate: (data: FormValues) => void;
}

export function ChallengeCreateDialog({ isOpen, onOpenChange, onCreate }: ChallengeCreateDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(challengeSchema),
        defaultValues: {
            wager: 0
        },
    });

    const onSubmit = (data: FormValues) => {
        setIsSubmitting(true);
        setTimeout(() => {
            onCreate(data);
            setIsSubmitting(false);
            onOpenChange(false);
            form.reset({ wager: 0, title: '', description: '', discipline: '' });
        }, 1000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Создать новый вызов</DialogTitle>
                            <DialogDescription>Заполните детали, и ваш вызов появится на доске для всех игроков.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                             <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Название вызова</FormLabel><FormControl><Input placeholder="Например, Дуэль 1 на 1" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="discipline" render={({ field }) => (
                                <FormItem><FormLabel>Дисциплина</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите дисциплину" /></SelectTrigger></FormControl><SelectContent>{sportsList.map(sport => <SelectItem key={sport.id} value={sport.name}>{sport.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="wager" render={({ field }) => (
                                <FormItem><FormLabel>Ставка (PD)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Описание</FormLabel><FormControl><Textarea placeholder="Опишите условия вашего вызова..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Опубликовать вызов
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
