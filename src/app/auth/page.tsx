'use client'

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
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
import { AlertCircle, CalendarIcon, Users, Star, Award, Shield } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- Login Form ---
function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const { pending } = useFormStatus();

  return (
    <form action={dispatch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-login">Email</Label>
        <Input
          id="email-login"
          name="email"
          type="email"
          placeholder="admin@example.com"
          required
          defaultValue="admin@example.com"
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-login">Пароль</Label>
        <Input
          id="password-login"
          name="password"
          type="password"
          required
          defaultValue="superuser"
          disabled={pending}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember-me" disabled={pending} />
          <label
            htmlFor="remember-me"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Запомнить меня
          </label>
        </div>
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
      <Button type="submit" className="w-full" aria-disabled={pending} disabled={pending}>
        {pending ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  )
}

// --- Registration Form ---
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
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [pending, startTransition] = React.useTransition();

    const onSubmit = (values: z.infer<typeof registrationSchema>) => {
        setErrorMessage(undefined);
        setSuccessMessage(undefined);
        startTransition(async () => {
            const result = await register(values);
            if (result.error) {
                setErrorMessage(result.error);
            } else if (result.success) {
                setSuccessMessage(result.success);
                form.reset();
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
                                <FormLabel>
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
                {successMessage && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Успешно!</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}
                <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
            </form>
        </Form>
    );
}

// --- Main Page Component ---
export default function AuthPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/40">
      <div className="mx-auto mb-6 h-12 w-12 text-primary">
          <Logo />
      </div>
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
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
                <Button variant="outline"><Award className="mr-2" /> Яндекс</Button>
                <Button variant="outline"><Shield className="mr-2" /> Госуслуги</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
           <Card>
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
    </main>
  );
}
