'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition, useState } from 'react';
import Image from 'next/image';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { login } from '@/features/auth/actions';
import { loginSchema } from '@/features/auth/schemas';
import { Loader2, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Logo } from '@/shared/ui/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Checkbox } from '@/shared/ui/checkbox';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/shared/ui/tooltip';
import { Label } from '@/shared/ui/label';

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
        <div className="w-full max-w-[960px] mx-auto">
            <Card className="flex flex-col md:flex-row overflow-hidden shadow-2xl">
                {/* Left Side: QR Code */}
                <div className="w-full md:w-[40%] bg-background p-8 flex flex-col items-center justify-center text-center order-2 md:order-1">
                    <h2 className="text-xl font-bold">Быстрый вход по QR-коду</h2>
                    <div className="relative my-4">
                        <Image src="https://placehold.co/160x160.png" width={160} height={160} alt="QR Code" data-ai-hint="qr code" className="rounded-lg" />
                        <Button variant="ghost" size="icon" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/70 rounded-full h-10 w-10 backdrop-blur-sm">
                            <RefreshCw className="h-6 w-6 text-primary" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Отсканируйте QR-код сканером в приложении ProDvor или камерой устройства
                    </p>
                    <Button variant="link" className="mt-2 text-primary">Подробнее</Button>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-[60%] p-8 flex flex-col justify-center bg-card order-1 md:order-2">
                    <div className="max-w-sm mx-auto w-full">
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
                                            <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground"/></TooltipTrigger>
                                            <TooltipContent><p>Ваши данные будут сохранены в этом браузере.</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <Button type="submit" className="w-full" disabled={isPending}>
                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Продолжить'}
                                </Button>
                            </form>
                        </Form>
                        <Button type="button" variant="secondary" className="w-full mt-2" onClick={onSwitchToRegister}>
                            Создать аккаунт
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-4">Нажимая «Продолжить», вы принимаете пользовательское соглашение и политику конфиденциальности</p>
                    </div>
                </div>
            </Card>
             <div className="text-center mt-4">
                <Button variant="link" className="text-muted-foreground">Узнать больше о ProDvor ID</Button>
            </div>
        </div>
    );
};
