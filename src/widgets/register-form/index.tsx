'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { register } from '@/features/auth/actions';
import { registerSchema } from '@/features/auth/schemas';
import { Loader2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Separator } from '@/shared/ui/separator';
import { YandexIcon, VkIcon, TelegramIcon, GosuslugiIcon } from '@/shared/ui/icons';

type FormValues = z.infer<typeof registerSchema>;

export const RegisterForm = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    
    const form = useForm<FormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            terms: false,
        },
    });

    const onSubmit = (values: FormValues) => {
        setError(undefined);
        startTransition(async () => {
           const result = await register(values);
           if (result?.error) {
               setError(result.error);
           }
        });
    };

    return (
        <Card className="w-full max-w-md shadow-2xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <CardHeader>
                        <CardTitle>Создать аккаунт</CardTitle>
                        <CardDescription>Присоединяйтесь к сообществу ProDvor.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Ошибка регистрации</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Имя</FormLabel><FormControl><Input placeholder="Иван Иванов" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                             <FormItem><FormLabel>Пароль</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="role" render={({ field }) => (
                             <FormItem><FormLabel>Роль</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Ваша основная роль" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Игрок">Игрок</SelectItem>
                                    <SelectItem value="Капитан">Капитан</SelectItem>
                                    <SelectItem value="Организатор">Организатор</SelectItem>
                                    <SelectItem value="Тренер">Тренер</SelectItem>
                                    <SelectItem value="Болельщик">Болельщик</SelectItem>
                                </SelectContent>
                             </Select><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="terms" render={({ field }) => (
                             <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Принять условия использования</FormLabel>
                                    <FormDescription>
                                        Вы соглашаетесь с нашими <Link href="/documents/terms-of-use" className="underline">Условиями</Link> и <Link href="/documents/privacy-policy" className="underline">Политикой конфиденциальности</Link>.
                                    </FormDescription>
                                </div>
                             </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Зарегистрироваться
                        </Button>
                        <Button type="button" variant="link" size="sm" onClick={onSwitchToLogin}>
                            Уже есть аккаунт? Войти
                        </Button>
                    </CardFooter>
                     <CardFooter className="flex flex-col gap-4">
                        <div className="relative w-full">
                            <Separator />
                            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                                Или через соцсети
                            </p>
                        </div>
                        <div className="grid grid-cols-4 gap-2 w-full">
                            <Button variant="outline" className="w-full" type="button"><YandexIcon /></Button>
                            <Button variant="outline" className="w-full" type="button"><VkIcon /></Button>
                            <Button variant="outline" className="w-full" type="button"><TelegramIcon /></Button>
                            <Button variant="outline" className="w-full" type="button"><GosuslugiIcon /></Button>
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};
