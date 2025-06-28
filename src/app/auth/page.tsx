
'use client'

import { useState } from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import * as React from 'react';

import { authenticate, register } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CalendarIcon, Users, Star, Loader2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email({ message: "Введите корректный email." }),
  password: z.string().min(1, { message: "Пароль не может быть пустым." }),
  remember: z.boolean().default(false).optional(),
});

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "superuser",
      remember: false,
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setErrorMessage('');
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);
      const result = await authenticate(undefined, formData);
      if (result) {
        setErrorMessage(result);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@example.com" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">Запомнить меня</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Link href="#" className="text-sm text-primary hover:underline">
            Забыли пароль?
          </Link>
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ошибка входа</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Войти
        </Button>
      </form>
    </Form>
  )
}

const registrationSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов." }),
  email: z.string().email({ message: "Введите корректный email." }),
  password: z.string().min(8, { message: "Пароль должен содержать не менее 8 символов." }),
  dob: z.date({ required_error: "Выберите дату рождения." }),
  role: z.string({ required_error: "Выберите вашу роль." }),
  terms: z.boolean().refine(val => val === true, { message: "Вы должны принять условия использования." }),
});

function RegistrationForm() {
    const form = useForm<z.infer<typeof registrationSchema>>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            terms: false,
        },
    });

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [pending, startTransition] = React.useTransition();

    const onSubmit = (values: z.infer<typeof registrationSchema>) => {
        setErrorMessage(undefined);
        startTransition(async () => {
            const result = await register(values);
            if (result?.error) {
                setErrorMessage(result.error);
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Полное имя</FormLabel>
                            <FormControl>
                                <Input placeholder="Иван Иванов" {...field} disabled={pending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="example@prodvor.com" {...field} disabled={pending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} disabled={pending}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Дата рождения</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                disabled={pending}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: ru })
                                                ) : (
                                                    <span>Выберите дату</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Роль</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={pending}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите роль" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="player">Игрок</SelectItem>
                              <SelectItem value="captain">Капитан</SelectItem>
                              <SelectItem value="judge">Судья</SelectItem>
                              <SelectItem value="fan">Болельщик</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={pending}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="cursor-pointer">
                                    Я согласен с <Link href="#" className="text-primary hover:underline">условиями использования</Link> и <Link href="#" className="text-primary hover:underline">политикой конфиденциальности</Link>.
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                 {errorMessage && (
                    <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Ошибка регистрации</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
                <Button type="submit" className="w-full" disabled={pending}>
                    {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Зарегистрироваться
                </Button>
            </form>
        </Form>
    );
}

// --- Main Page Component ---
export default function AuthPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col items-center justify-center bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Фон"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
            data-ai-hint="esports stadium lights"
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
             <Logo className="mr-2 h-6 w-6 text-primary" />
             ProDvor
          </div>
           <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Эта платформа изменила все для нашей команды. Организация, поиск игроков, участие в турнирах — все стало в разы проще.&rdquo;
              </p>
              <footer className="text-sm">Алексей 'CyberCat' Иванов</footer>
            </blockquote>
          </div>
      </div>
      <div className="flex items-center justify-center p-4">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                <Card className="border-0 shadow-none">
                    <CardHeader>
                    <CardTitle className="font-headline text-2xl">С возвращением!</CardTitle>
                    <CardDescription>Введите свои данные для входа в аккаунт.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <LoginForm />
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Или войдите через
                        </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline"><Users className="mr-2" /> Google</Button>
                        <Button variant="outline"><Star className="mr-2" /> ВКонтакте</Button>
                    </div>
                    </CardContent>
                </Card>
                </TabsContent>
                <TabsContent value="register">
                <Card className="border-0 shadow-none">
                    <CardHeader>
                    <CardTitle className="font-headline text-2xl">Создать аккаунт</CardTitle>
                    <CardDescription>Начните свой путь в ProDvor заполнив форму ниже.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RegistrationForm />
                    </CardContent>
                </Card>
                </TabsContent>
            </Tabs>
          </div>
      </div>
    </main>
  );
}
