'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTransition } from "react";
import { useSession } from '@/shared/lib/session/client';
import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { updateProfileSettings, updatePassword } from "@/app/(app)/settings/actions";
import { Loader2 } from "lucide-react";
import { SecuritySettingsTab } from "@/widgets/security-settings-tab";

// --- Profile Form ---
const profileFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать не менее 2 символов."),
  city: z.string().min(2, "Город должен содержать не менее 2 символов."),
  sport: z.string().min(2, "Вид спорта должен содержать не менее 2 символов."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function ProfileSettingsForm() {
  const { user } = useSession();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      city: 'Москва', // mock data
      sport: 'Valorant', // mock data
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    startTransition(async () => {
      const result = await updateProfileSettings(values);
      if (result.success) {
        toast({ title: "Успех!", description: result.success });
      } else {
        toast({ variant: 'destructive', title: "Ошибка", description: result.error });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки профиля</CardTitle>
        <CardDescription>Измените основную информацию о вашем аккаунте.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Ваше имя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Город</FormLabel>
                  <FormControl>
                    <Input placeholder="Ваш город" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Основной вид спорта</FormLabel>
                  <FormControl>
                    <Input placeholder="Например, Valorant или Футбол" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить изменения
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


// --- Password Form ---
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Текущий пароль не может быть пустым." }),
  newPassword: z.string().min(8, { message: "Новый пароль должен содержать не менее 8 символов." }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают.",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;


function PasswordSettingsForm() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
    });

    const onSubmit = (values: PasswordFormValues) => {
        startTransition(async () => {
            const result = await updatePassword(values);
            if (result.success) {
                toast({ title: "Успех!", description: result.success });
                form.reset();
            } else {
                toast({ variant: 'destructive', title: "Ошибка", description: result.error });
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Изменить пароль</CardTitle>
                <CardDescription>Для вашей безопасности рекомендуется периодически менять пароль.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Текущий пароль</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Новый пароль</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Подтвердите новый пароль</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Обновить пароль
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

// --- Main Page Component ---
export function SettingsPage() {
    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Настройки</h1>
                <p className="text-muted-foreground">
                    Управляйте настройками своего аккаунта и профиля.
                </p>
            </div>
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Профиль</TabsTrigger>
                    <TabsTrigger value="password">Пароль</TabsTrigger>
                    <TabsTrigger value="security">Безопасность</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-6">
                   <ProfileSettingsForm />
                </TabsContent>
                <TabsContent value="password" className="mt-6">
                    <PasswordSettingsForm />
                </TabsContent>
                <TabsContent value="security" className="mt-6">
                    <SecuritySettingsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
