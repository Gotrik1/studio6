'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition, useState } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { login } from '@/features/auth/actions';
import { loginSchema } from '@/features/auth/schemas';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Separator } from '@/shared/ui/separator';
import Link from 'next/link';

// --- Social Icons ---
const YandexIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11.5" fill="#FC3F1D" stroke="#FC3F1D"/>
        <path d="M12.916 16.94V10.748H14.152V9.032H12.916V7.328C12.916 6.812 12.976 6.536 13.096 6.5H14.152V5H12.1C10.42 5 9.784 5.9 9.784 7.364V9.032H8.5V10.748H9.784V16.94H12.916Z" fill="white"/>
    </svg>
);

const VkIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#0077FF"/>
        <path d="M13.805 17.5C13.21 17.5 12.44 17.203 11.5 16.61C10.141 15.753 9.073 14.542 8.297 13.25C7.611 12.102 7.268 11.17 7.268 10.453C7.268 10.195 7.317 9.98 7.415 9.807C7.513 9.634 7.64 9.5 7.796 9.402C7.952 9.304 8.113 9.255 8.279 9.255C8.387 9.255 8.495 9.274 8.603 9.313C8.711 9.352 8.789 9.416 8.838 9.502C8.922 9.61 9.011 9.814 9.104 10.116C9.197 10.418 9.275 10.669 9.338 10.869C10.044 13.119 11.139 14.244 12.624 14.244C12.956 14.244 13.224 14.122 13.428 13.877C13.632 13.632 13.734 13.33 13.734 12.971V10.228C13.734 9.931 13.656 9.697 13.5 9.524C13.344 9.351 13.129 9.265 12.855 9.265C12.655 9.265 12.472 9.319 12.306 9.427C12.14 9.535 12.004 9.686 11.898 9.881C11.792 10.076 11.739 10.291 11.739 10.525V11.953H9.75V6.733C10.59 6.538 11.43 6.44 12.27 6.44C13.435 6.44 14.372 6.747 15.08 7.36C15.788 7.973 16.142 8.799 16.142 9.837V13.081C16.142 13.882 15.996 14.542 15.704 15.06C15.412 15.578 15.019 16.033 14.524 16.425C14.029 16.817 13.5 17.134 12.937 17.376C13.229 17.449 13.511 17.5 13.805 17.5H16.25V19H13.805V17.5Z" fill="white"/>
    </svg>
);

const TelegramIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#2AABEE"/>
        <path d="M17.4368 7.05129L15.356 17.1565C15.143 18.0617 14.6217 18.2838 13.8996 17.8317L10.7496 15.5243L9.20798 16.9965C9.01382 17.1906 8.84095 17.3635 8.46944 17.3635L8.68246 14.1809L15.2238 8.19329C15.6166 7.84307 15.1528 7.64993 14.6528 7.97886L6.80434 13.1189L3.6968 12.1132C2.7916 11.825 2.76993 11.1963 3.88196 10.7442L16.4952 5.67914C17.2834 5.39097 17.797 5.82088 17.4368 7.05129Z" fill="white"/>
    </svg>
);

const GosuslugiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="4" fill="#0D47A1"/>
        <path d="M14 6L14.7939 8.79393L17.5879 9.58786L14.7939 10.3818L14 13.1758L13.2061 10.3818L10.4121 9.58786L13.2061 8.79393L14 6Z" fill="white"/>
        <path d="M8.58789 8.79395L9.04169 10.6318L10.8795 11.0856L9.04169 11.5394L8.58789 13.3772L8.13409 11.5394L6.29629 11.0856L8.13409 10.6318L8.58789 8.79395Z" fill="white"/>
        <path d="M19.4121 8.79395L18.9583 10.6318L17.1205 11.0856L18.9583 11.5394L19.4121 13.3772L19.8659 11.5394L21.7037 11.0856L19.8659 10.6318L19.4121 8.79395Z" fill="white"/>
        <path d="M14 14.7119C11.9649 14.7119 10.3018 16.3751 10.3018 18.4102V22H17.6982V18.4102C17.6982 16.3751 16.0351 14.7119 14 14.7119Z" fill="white"/>
    </svg>
);


type FormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();

    const form = useForm<FormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "admin@example.com",
            password: "superuser",
        },
    });
    
    const onSubmit = (values: FormValues) => {
        setError(undefined);
        startTransition(async () => {
            const result = await login(values.email);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Вход в аккаунт</CardTitle>
                        <CardDescription>Введите данные для входа в ваш аккаунт. Для демо, используйте предзаполненные данные.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Ошибка входа</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                             <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Пароль</FormLabel>
                                    <Link href="#" className="text-xs text-muted-foreground hover:text-primary">Забыли пароль?</Link>
                                </div>
                                <FormControl><Input type="password" {...field} /></FormControl><FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isPending}>
                             {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Войти
                        </Button>
                    </CardFooter>
                     <CardFooter className="flex flex-col gap-4">
                        <div className="relative w-full">
                            <Separator />
                            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                                Или войдите с помощью
                            </p>
                        </div>
                        <div className="grid grid-cols-4 gap-2 w-full">
                            <Button variant="outline" className="w-full" type="button"><YandexIcon /></Button>
                            <Button variant="outline" className="w-full" type="button"><VkIcon /></Button>
                            <Button variant="outline" className="w-full" type="button"><TelegramIcon /></Button>
                            <Button variant="outline" className="w-full" type="button"><GosuslugiIcon /></Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
