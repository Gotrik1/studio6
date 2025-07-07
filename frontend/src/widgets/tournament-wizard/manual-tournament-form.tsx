

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
import { CalendarIcon, Loader2, Trophy, UploadCloud } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { createTournament, type CreateTournamentDto } from '@/entities/tournament/api/tournaments';
import { getSports, type Sport } from '@/entities/sport/api/sports';
import { Textarea } from '@/shared/ui/textarea';
import { Separator } from '@/shared/ui/separator';

const tournamentSchema = z.object({
  name: z.string().min(5, 'Название должно быть не менее 5 символов.'),
  description: z.string().optional(),
  game: z.string({ required_error: 'Выберите вид спорта.' }),
  type: z.enum(['team', 'individual'], { required_error: 'Выберите тип турнира.' }),
  format: z.enum(['single_elimination', 'round_robin', 'groups'], { required_error: 'Выберите формат.' }),
  participantCount: z.coerce.number().min(4, 'Минимум 4 участника.').max(128, 'Максимум 128 участников.'),
  registrationStartDate: z.date({required_error: "Выберите дату."}),
  registrationEndDate: z.date({required_error: "Выберите дату."}),
  tournamentStartDate: z.date({required_error: "Выберите дату."}),
  category: z.string().min(3, "Укажите категорию"),
  location: z.string().min(3, "Укажите место проведения"),
  prizePool: z.string().optional(),
  rules: z.string().optional(),
  coverImage: z.string().optional(),
  coverImageHint: z.string().optional(),
});

type FormValues = z.infer<typeof tournamentSchema>;

interface ManualTournamentFormProps {
    isEditMode?: boolean; // to reuse this form for editing
}


export function ManualTournamentForm({ isEditMode }: ManualTournamentFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);

  useEffect(() => {
      getSports().then(setSports);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'team',
      format: 'single_elimination',
      participantCount: 16,
      category: 'Киберспорт',
      location: 'Онлайн',
      registrationStartDate: new Date(),
      registrationEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tournamentStartDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    const tournamentData: CreateTournamentDto = {
        ...data,
        bannerImage: 'https://placehold.co/2560x720.png', // Mock image for manual form
        bannerImageHint: 'esports tournament banner',
    };
    
    const result = await createTournament(tournamentData);
    
    if (result.success) {
        toast({
            title: 'Турнир создан!',
            description: `Турнир "${data.name}" был успешно создан и скоро появится в списке.`
        });
        router.push(`/tournaments/${result.data.slug}`);
    } else {
         toast({
            variant: 'destructive',
            title: 'Ошибка создания турнира',
            description: result.error,
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
                        <CardTitle>Параметры турнира</CardTitle>
                        <CardDescription>Заполните все необходимые поля для создания нового турнира.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-6">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Название турнира</FormLabel><FormControl><Input placeholder="Например, ProDvor Summer Cup" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Краткое описание (необязательно)</FormLabel><FormControl><Textarea placeholder="Для кого этот турнир, какие его цели?" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <Separator/>
                         <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="game" render={({ field }) => (
                                    <FormItem><FormLabel>Дисциплина</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите дисциплину" /></SelectTrigger></FormControl><SelectContent>{sports.map(sport => <SelectItem key={sport.id} value={sport.name}>{sport.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="type" render={({ field }) => (
                                    <FormItem><FormLabel>Тип турнира</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Командный или индивидуальный" /></SelectTrigger></FormControl><SelectContent><SelectItem value="team">Командный</SelectItem><SelectItem value="individual">Индивидуальный</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="format" render={({ field }) => (
                                    <FormItem><FormLabel>Формат проведения</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите формат" /></SelectTrigger></FormControl><SelectContent><SelectItem value="single_elimination">Single Elimination</SelectItem><SelectItem value="round_robin">Round Robin</SelectItem><SelectItem value="groups">Групповой этап + Плей-офф</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="participantCount" render={({ field }) => (
                                    <FormItem><FormLabel>Кол-во участников</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>
                         <Separator/>
                        <div className="space-y-6">
                            <h4 className="font-medium text-sm">Ключевые даты</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField control={form.control} name="registrationStartDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Начало регистрации</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="registrationEndDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Конец регистрации</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="tournamentStartDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Начало турнира</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                            </div>
                        </div>
                         <Separator/>
                         <div className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Категория</FormLabel><FormControl><Input placeholder="Например, Любительский" {...field} /></FormControl></FormItem>)} />
                                <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Место проведения</FormLabel><FormControl><Input placeholder="Онлайн / Название площадки" {...field} /></FormControl></FormItem>)} />
                            </div>
                            <FormField control={form.control} name="prizePool" render={({ field }) => (<FormItem><FormLabel>Призовой фонд (необязательно)</FormLabel><FormControl><Input placeholder="Например, 50,000 PD + девайсы от спонсора" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name="rules" render={({ field }) => (<FormItem><FormLabel>Правила (необязательно)</FormLabel><FormControl><Textarea placeholder="Опишите основные правила и регламент турнира..." {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Trophy className="mr-2 h-4 w-4" /> {isEditMode ? 'Сохранить изменения' : 'Создать турнир'}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    </div>
  );
}
