'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition, useState } from 'react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { login } from '@/features/auth/actions';
import { loginSchema } from '@/features/auth/schemas';
import { Loader2, AlertCircle, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Logo } from '@/shared/ui/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Checkbox } from '@/shared/ui/checkbox';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/shared/ui/tooltip';
import { Label } from '@/shared/ui/label';
import { Separator } from '@/shared/ui/separator';

type FormValues = z.infer<typeof loginSchema>;

export const LoginForm = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
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
            const result = await login(values);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="flex justify-center mb-4">
                <Logo className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-4">Вход в ProDvor ID</h1>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Ошибка входа</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Tabs defaultValue="email" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="phone">Телефон</TabsTrigger>
                            <TabsTrigger value="email">Почта</TabsTrigger>
                        </TabsList>
                        <TabsContent value="phone" className="pt-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span role="img" aria-label="Russian Flag">🇷🇺</span>
                                </div>
                                <Input placeholder="+7 (___) ___-__-__" className="pl-10" />
                            </div>
                        </TabsContent>
                        <TabsContent value="email" className="pt-2 space-y-4">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </TabsContent>
                    </Tabs>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember-me" />
                        <Label htmlFor="remember-me" className="text-sm font-normal">Сохранить вход</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6"><HelpCircle className="h-4 w-4 text-muted-foreground"/></Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Ваши данные будут сохранены в этом браузере.</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Продолжить'}
                    </Button>
                </form>
            </Form>
                <Separator className="my-6" />
            <Button type="button" variant="secondary" className="w-full" onClick={onSwitchToRegister}>
                Создать аккаунт
            </Button>
        </div>
    );
};
