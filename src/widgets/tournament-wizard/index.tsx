
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { cn } from '@/shared/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { sportsList } from '@/shared/lib/mock-data/sports';
import { useToast } from '@/shared/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const tournamentSchema = z.object({
  name: z.string().min(3, 'Название должно содержать не менее 3 символов.'),
  sport: z.string({ required_error: 'Выберите вид спорта.' }),
  description: z.string().optional(),
  type: z.enum(['team', 'individual'], { required_error: 'Выберите тип турнира.' }),
  format: z.enum(['single_elimination', 'round_robin', 'groups'], { required_error: 'Выберите формат.' }),
  category: z.string({ required_error: 'Выберите категорию.' }),
  location: z.string({ required_error: 'Выберите географию.' }),
  participantCount: z.coerce.number().min(4, 'Минимум 4 участника.').max(128, 'Максимум 128 участников.'),
  registrationStartDate: z.date({required_error: "Выберите дату."}),
  registrationEndDate: z.date({required_error: "Выберите дату."}),
  tournamentStartDate: z.date({required_error: "Выберите дату."}),
  prizePool: z.string().optional(),
}).refine(data => {
    if (data.registrationStartDate && data.registrationEndDate) {
        return data.registrationEndDate > data.registrationStartDate;
    }
    return true;
}, {
    message: 'Конец регистрации должен быть после начала.',
    path: ['registrationEndDate'],
}).refine(data => {
    if (data.registrationEndDate && data.tournamentStartDate) {
        return data.tournamentStartDate > data.registrationEndDate;
    }
    return true;
}, {
    message: 'Начало турнира должно быть после конца регистрации.',
    path: ['tournamentStartDate'],
});

type FormValues = z.infer<typeof tournamentSchema>;

export function ManualTournamentForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: '',
      sport: undefined,
      description: '',
      type: undefined,
      format: undefined,
      category: undefined,
      location: 'online',
      participantCount: 16,
      registrationStartDate: new Date(),
      registrationEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tournamentStartDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      prizePool: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    console.log('Tournament data:', data); // In a real app, send to backend
    setTimeout(() => {
        toast({
            title: 'Турнир создан!',
            description: `Турнир "${data.name}" был успешно создан.`
        });
        router.push('/administration/tournament-crm/dashboard');
    }, 1000);
  };
  
  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
        <div className="space-y-2 text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tight">Создание турнира</h1>
            <p className="text-muted-foreground">Заполните все необходимые поля для создания нового соревнования.</p>
        </div>
        <Card className="max-w-4xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Параметры турнира</CardTitle>
                        <CardDescription>Полная настройка всех аспектов вашего события на одной странице.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="space-y-4 p-4 border rounded-lg">
                             <h3 className="font-semibold text-lg">Основная информация</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Название турнира</FormLabel><FormControl><Input placeholder="Например, Осенний Кубок ProDvor" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="sport" render={({ field }) => (<FormItem><FormLabel>Вид спорта</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите дисциплину" /></SelectTrigger></FormControl><SelectContent>{sportsList.map(sport => <SelectItem key={sport.id} value={sport.name}>{sport.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                             </div>
                             <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Краткое описание (необязательно)</FormLabel><FormControl><Textarea placeholder="Опишите главные особенности турнира" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        
                        {/* Section 2: Format & Dates */}
                         <div className="space-y-4 p-4 border rounded-lg">
                            <h3 className="font-semibold text-lg">Формат и даты</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Тип турнира</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите тип" /></SelectTrigger></FormControl><SelectContent><SelectItem value="team">Командный</SelectItem><SelectItem value="individual">Индивидуальный</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="format" render={({ field }) => (<FormItem><FormLabel>Формат проведения</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите формат" /></SelectTrigger></FormControl><SelectContent><SelectItem value="single_elimination">Олимпийская система (Single-Elimination)</SelectItem><SelectItem value="groups">Групповой этап + Плей-офф</SelectItem><SelectItem value="round_robin">Круговая система</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Категория</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите категорию" /></SelectTrigger></FormControl><SelectContent><SelectItem value="open">Открытая</SelectItem><SelectItem value="male">Мужская</SelectItem><SelectItem value="female">Женская</SelectItem><SelectItem value="mix">Микс</SelectItem><SelectItem value="juniors">Юниоры</SelectItem><SelectItem value="veterans">Ветераны</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>География</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите географию" /></SelectTrigger></FormControl><SelectContent><SelectItem value="online">Онлайн</SelectItem><SelectItem value="city">Город</SelectItem><SelectItem value="international">Международный</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField control={form.control} name="registrationStartDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Начало регистрации</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="registrationEndDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Конец регистрации</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="tournamentStartDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Начало турнира</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP", {locale: ru})) : (<span>Выберите дату</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                            </div>
                        </div>

                         {/* Section 3: Participants & Prizes */}
                        <div className="space-y-4 p-4 border rounded-lg">
                             <h3 className="font-semibold text-lg">Участники и призы</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="participantCount" render={({ field }) => (<FormItem><FormLabel>Макс. количество участников/команд</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="prizePool" render={({ field }) => (<FormItem><FormLabel>Призовой фонд (необязательно)</FormLabel><FormControl><Input placeholder="Например, 10,000 PD" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                             </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Создать турнир
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    </div>
  );
}
