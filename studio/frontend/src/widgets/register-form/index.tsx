
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition, useState } from 'react';
import { useToast } from '@/shared/hooks/use-toast';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { register } from '@/features/auth/actions';
import { registerSchema } from '@/features/auth/schemas';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Logo } from '@/shared/ui/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import Link from 'next/link';
import { Separator } from '@/shared/ui/separator';


type FormValues = z.infer<typeof registerSchema>;

export const RegisterForm = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    
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
        setSuccess(undefined);
        startTransition(async () => {
           const result = await register(values);
           if (result?.error) {
               setError(result.error);
           }
           if (result?.success) {
                toast({
                    title: "Успех!",
                    description: result.success,
                });
                form.reset();
                onSwitchToLogin();
           }
        });
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="flex justify-center mb-4">
                <Logo className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-4">Создать ProDvor ID</h1>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Ошибка регистрации</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl><Input placeholder="Иван Иванов" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
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
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Принять условия использования</FormLabel>
                                <FormDescription className="text-xs">
                                    Вы соглашаетесь с нашими <Link href="/documents/terms-of-use" className="underline">Условиями</Link> и <Link href="/documents/privacy-policy" className="underline">Политикой конфиденциальности</Link>.
                                </FormDescription>
                                    <FormMessage />
                            </div>
                            </FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Создать аккаунт'}
                    </Button>
                </form>
            </Form>
                <Separator className="my-4" />
            <div className="text-center">
                <Button type="button" variant="link" size="sm" onClick={onSwitchToLogin}>
                    Уже есть аккаунт? Войти
                </Button>
            </div>
        </div>
    );
};
