'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { updateProfileSettings, updatePassword } from '@/app/(app)/settings/actions';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeCustomizer } from '@/components/theme-customizer';
import { Bell, Palette, Shield, User as UserIcon } from 'lucide-react';
import type { User } from '@/lib/types';
import { useSession } from "@/lib/session-client";
import { Skeleton } from '@/components/ui/skeleton';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов." }),
  city: z.string().optional(),
  sport: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;


function ProfileSettingsForm({ user }: { user: User & { location?: string, mainSport?: string } }) {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || '',
      city: user.location || '',
      sport: user.mainSport || '',
    },
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    const result = await updateProfileSettings(data);
    if (result?.success) {
      toast({
        title: "Успешно!",
        description: result.success,
      });
    } else if (result?.error) {
       toast({
        variant: 'destructive',
        title: "Ошибка",
        description: result.error,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Полное имя</FormLabel>
              <FormControl>
                <Input placeholder="Ваше имя" {...field} />
              </FormControl>
              <FormDescription>Это имя будет отображаться в вашем профиле.</FormDescription>
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </form>
    </Form>
  );
}

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
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
     const result = await updatePassword(data);
    if (result?.success) {
      toast({
        title: "Успешно!",
        description: result.success,
      });
      form.reset();
    } else if (result?.error) {
       toast({
        variant: 'destructive',
        title: "Ошибка",
        description: result.error,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Текущий пароль</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
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
              <FormControl><Input type="password" {...field} /></FormControl>
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
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Обновление...' : 'Обновить пароль'}
        </Button>
      </form>
    </Form>
  );
}

const notificationItems = [
    { id: 'new_messages', label: 'Новые сообщения в чате' },
    { id: 'friend_requests', label: 'Запросы в друзья' },
    { id: 'team_invites', label: 'Приглашения в команду' },
    { id: 'match_reminders', label: 'Напоминания о матчах' },
    { id: 'platform_news', label: 'Новости платформы' },
];

function NotificationsSettingsForm() {
    return (
        <div className="space-y-4">
            {notificationItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor={item.id} className="flex-1 cursor-pointer">{item.label}</Label>
                    <Switch id={item.id} defaultChecked />
                </div>
            ))}
        </div>
    );
}

function AppearanceSettingsForm() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Тема</h3>
                <p className="text-sm text-muted-foreground">Выберите светлую, темную или системную тему.</p>
                <div className="mt-4">
                    <ThemeToggle />
                </div>
            </div>
             <div>
                <h3 className="text-lg font-medium">Цветовой акцент</h3>
                <p className="text-sm text-muted-foreground">Настройте основной цвет интерфейса.</p>
                <div className="mt-4">
                    <ThemeCustomizer />
                </div>
            </div>
        </div>
    );
}


export default function SettingsPage() {
    const { user, loading } = useSession();

    if (loading) {
        return <div className="space-y-6"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>;
    }

    const userWithSettings = user ? {
        ...user,
        location: "Москва",
        mainSport: "Valorant",
    } : null;

    if (!userWithSettings) {
        return <div>Пожалуйста, войдите, чтобы увидеть настройки.</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Настройки</h1>
                <p className="text-muted-foreground">Управляйте вашим аккаунтом, уведомлениями и внешним видом.</p>
            </div>
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="profile"><UserIcon className="mr-2 h-4 w-4"/>Профиль</TabsTrigger>
                    <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4"/>Безопасность</TabsTrigger>
                    <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4"/>Уведомления</TabsTrigger>
                    <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4"/>Внешний вид</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Общедоступный профиль</CardTitle>
                            <CardDescription>Эта информация будет видна другим пользователям.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileSettingsForm user={userWithSettings} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Пароль</CardTitle>
                            <CardDescription>Рекомендуется регулярно обновлять пароль.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PasswordSettingsForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Уведомления</CardTitle>
                            <CardDescription>Выберите, какие уведомления вы хотите получать.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <NotificationsSettingsForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Внешний вид</CardTitle>
                            <CardDescription>Настройте интерфейс под себя.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AppearanceSettingsForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
