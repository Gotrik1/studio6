'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { register } from '@/features/auth/actions';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/shared/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import Link from 'next/link';

const registerFormSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов." }),
  email: z.string().email({ message: "Введите корректный email." }),
  password: z.string().min(8, { message: "Пароль должен содержать не менее 8 символов." }),
  dob: z.date({ required_error: "Выберите дату рождения." }),
  role: z.string({ required_error: "Выберите вашу основную роль." }),
  terms: z.boolean().refine(val => val === true, { message: "Вы должны принять условия." }),
});

type FormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            terms: false,
        },
    });

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            const result = await register(values);
            if (result?.error) {
                toast({
                    variant: 'destructive',
                    title: 'Ошибка регистрации',
                    description: result.error,
                });
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Создать аккаунт</CardTitle>
                        <CardDescription>Присоединяйтесь к сообществу ProDvor.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Имя</FormLabel><FormControl><Input placeholder="Иван Иванов" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                             <FormItem><FormLabel>Пароль</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="dob" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Дата рождения</FormLabel>
                                <Popover><PopoverTrigger asChild>
                                <FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? (format(field.value, "PPP")) : (<span>Выберите дату</span>)}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button></FormControl>
                                </PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                                </PopoverContent></Popover><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="role" render={({ field }) => (
                                 <FormItem><FormLabel>Роль</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Ваша основная роль" /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="Игрок">Игрок</SelectItem><SelectItem value="Капитан">Капитан</SelectItem><SelectItem value="Организатор">Организатор</SelectItem></SelectContent>
                                 </Select><FormMessage /></FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="terms" render={({ field }) => (
                             <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Принять условия использования</FormLabel>
                                    <FormDescription>
                                        Вы соглашаетесь с нашими <Link href="#" className="underline">Условиями</Link> и <Link href="#" className="underline">Политикой конфиденциальности</Link>.
                                    </FormDescription>
                                </div>
                             </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Зарегистрироваться
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
