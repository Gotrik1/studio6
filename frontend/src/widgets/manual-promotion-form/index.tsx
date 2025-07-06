
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { cn } from '@/shared/lib/utils';
import { CalendarIcon, Loader2, PlusCircle, UploadCloud } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { createPromotion, type CreatePromotionData } from '@/entities/promotion/api/promotions';
import type { Sponsor } from '@/entities/sponsor/model/types';
import { getSponsors } from '@/entities/sponsor/api/sponsors';
import { Textarea } from '@/shared/ui/textarea';

const promotionSchema = z.object({
  name: z.string().min(5, 'Название должно быть не менее 5 символов.'),
  description: z.string().min(10, 'Описание должно быть не менее 10 символов.'),
  prize: z.string().min(3, 'Укажите приз.'),
  sponsorId: z.string().optional(),
  endDate: z.date({ required_error: "Выберите дату окончания." }),
  cost: z.coerce.string().min(0, "Стоимость не может быть отрицательной."),
});

type FormValues = z.infer<typeof promotionSchema>;

interface ManualPromotionFormProps {
    isEditMode?: boolean; // to reuse this form for editing
}


export function ManualPromotionForm({ isEditMode }: ManualPromotionFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    getSponsors().then(setSponsors);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: '',
      description: '',
      prize: '',
      cost: '0',
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    const promotionData: CreatePromotionData = {
        ...data,
        endDate: data.endDate.toISOString(), // Convert date to string for API
        imageDataUri: 'https://placehold.co/2560x720.png', // Mock image for manual form
        imageHint: 'promotion banner',
    };

    const result = await createPromotion(promotionData);

    if (result.success) {
        toast({
            title: 'Промо-акция создана!',
            description: `Акция "${data.name}" была успешно создана.`
        });
        router.push('/promotions');
    } else {
         toast({
            variant: 'destructive',
            title: 'Ошибка',
            description: result.error || 'Не удалось создать акцию.',
        });
    }
    setIsSubmitting(false);
  };
  
  return (
    <div className="mt-4">
        <Card className="max-w-2xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Параметры акции</CardTitle>
                        <CardDescription>Заполните все необходимые поля для создания новой акции или конкурса.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Название акции</FormLabel><FormControl><Input placeholder="Например, Конкурс на лучший игровой момент" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Описание</FormLabel><FormControl><Textarea placeholder="Подробно опишите условия и правила участия" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="prize" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Приз</FormLabel>
                                    <FormControl><Input placeholder="Например, 10,000 PD + игровая мышь" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="cost" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Стоимость участия (PD)</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="endDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Дата окончания</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                            )} />
                        <FormField control={form.control} name="sponsorId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Спонсор (необязательно)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Выберите спонсора из списка" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sponsors.map(sponsor => <SelectItem key={sponsor.id} value={sponsor.id}>{sponsor.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormItem>
                            <FormLabel>Баннер акции</FormLabel>
                            <FormControl>
                                <label htmlFor="media-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground">Нажмите, чтобы загрузить фото</p>
                                    </div>
                                    <input id="media-upload" type="file" className="hidden" accept="image/png, image/jpeg" />
                                </label>
                            </FormControl>
                             <FormDescription>Рекомендуемый размер 1200x400. Будет отображаться на странице акции.</FormDescription>
                        </FormItem>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditMode ? 'Сохранить изменения' : 'Создать промо-акцию'}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    </div>
  );
}
