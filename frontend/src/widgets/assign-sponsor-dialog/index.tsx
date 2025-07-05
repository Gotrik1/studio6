'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { useToast } from '@/shared/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Sponsor } from '@/entities/sponsor/model/types';
import { assignSponsor } from '@/entities/tournament/api/sponsors';


const assignSchema = z.object({
  amount: z.coerce.number().min(1, 'Сумма должна быть больше нуля.'),
});

type FormValues = z.infer<typeof assignSchema>;

interface AssignSponsorDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    tournamentId: string;
    sponsor: Sponsor | null;
    onSuccess: () => void;
}

export function AssignSponsorDialog({ isOpen, onOpenChange, tournamentId, sponsor, onSuccess }: AssignSponsorDialogProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(assignSchema),
        defaultValues: { amount: 5000 },
    });
    
    if (!sponsor) return null;

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        const result = await assignSponsor(tournamentId, sponsor.id, data.amount);

        if (result.success) {
            toast({ title: "Спонсор назначен!", description: `${sponsor.name} теперь поддерживает турнир.` });
            onSuccess();
            onOpenChange(false);
        } else {
             toast({ variant: 'destructive', title: 'Ошибка', description: result.error || 'Не удалось назначить спонсора.' });
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Назначить спонсора: {sponsor.name}</DialogTitle>
                            <DialogDescription>Укажите сумму спонсорского взноса.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Сумма взноса (в PD)</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Подтвердить
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
