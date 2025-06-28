'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as React from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserIcon, KeyRound, Bell, Eye, ShieldAlert, Trash2, BrainCircuit, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import type { User } from "@/lib/session";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { analyzeSecurity, type AnalyzeSecurityOutput } from '@/ai/flows/analyze-security-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateProfileSettings } from './actions';

const mockActivityLog = `
- 2024-09-27 10:00: Login from IP 89.123.45.67 (Moscow, RU) on Chrome, Windows.
- 2024-09-27 10:05: Viewed team profile 'Cyber Eagles'.
- 2024-09-27 11:30: Played match vs 'Vortex Vipers'. Result: Win (13-5). KDA: 2.5.
- 2024-09-27 12:15: Chat with 'NewUser123': "hey man, cool skins, where did u get them? check out this site for free skins: sketchy-skins.com"
- 2024-09-28 03:15: Login from IP 104.28.99.12 (Jakarta, ID) on Firefox, Linux.
- 2024-09-28 03:20: Played match vs 'Shadow Syndicate'. Result: Win (13-2). KDA: 5.8.
- 2024-09-28 03:55: Logout.
`;

const SecurityRecommendationCard = ({ recommendation }: { recommendation: AnalyzeSecurityOutput['recommendations'][0] }) => {
    const severityMap = {
        high: {
            icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
            cardClass: "border-destructive bg-destructive/10",
            titleClass: "text-destructive"
        },
        medium: {
            icon: <ShieldAlert className="h-5 w-5 text-yellow-500" />,
            cardClass: "border-yellow-500/50 bg-yellow-500/10",
            titleClass: "text-yellow-600 dark:text-yellow-500"
        },
        low: {
            icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
            cardClass: "border-green-500/50 bg-green-500/10",
            titleClass: "text-green-600 dark:text-green-500"
        }
    };

    const { icon, cardClass, titleClass } = severityMap[recommendation.severity];

    return (
        <Card className={cardClass}>
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                {icon}
                <div className="flex-1">
                    <CardTitle className={`text-base ${titleClass}`}>{recommendation.title}</CardTitle>
                    <CardDescription className="text-xs">{recommendation.description}</CardDescription>
                </div>
            </CardHeader>
        </Card>
    );
};

const profileFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать не менее 2 символов."),
  city: z.string().min(2, "Город должен содержать не менее 2 символов."),
  sport: z.string().min(2, "Вид спорта должен содержать не менее 2 символов."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type SettingsClientProps = {
  user: User & {
    location: string;
    mainSport: string;
  };
};

export default function SettingsClient({ user }: SettingsClientProps) {
    const { toast } = useToast();
    const initials = user.name.split(' ').map((n) => n[0]).join('');

    const [isPending, startTransition] = React.useTransition();
    
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name,
            city: user.location,
            sport: user.mainSport,
        },
    });

    const onProfileSubmit = (data: ProfileFormValues) => {
        startTransition(async () => {
            const result = await updateProfileSettings(data);
            if(result?.success) {
                toast({ title: 'Успех!', description: result.success });
            } else if (result?.error) {
                 toast({ variant: 'destructive', title: 'Ошибка!', description: result.error });
            }
        });
    };

    // AI Security State
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [aiResult, setAiResult] = React.useState<AnalyzeSecurityOutput | null>(null);

    // Form states for other tabs
    const [is2faEnabled, setIs2faEnabled] = React.useState(false);
    const [profileVisibility, setProfileVisibility] = React.useState('all');
    const [statsVisibility, setStatsVisibility] = React.useState('all');
    const [pmAccess, setPmAccess] = React.useState('all');
    const [isInvisible, setIsInvisible] = React.useState(false);
    const [emailNews, setEmailNews] = React.useState(true);
    const [emailMatches, setEmailMatches] = React.useState(true);
    const [emailSocial, setEmailSocial] = React.useState(false);
    const [dndMode, setDndMode] = React.useState(false);

    const handleSave = (section: string) => {
        toast({
            title: 'Настройки сохранены!',
            description: `Ваши настройки в разделе "${section}" были успешно обновлены.`,
        });
    };

    const handleCheckSecurity = async () => {
        setIsLoading(true);
        setError(null);
        setAiResult(null);

        try {
            const result = await analyzeSecurity({ activityLog: mockActivityLog });
            setAiResult(result);
        } catch (e) {
            console.error(e);
            setError("Не удалось выполнить проверку безопасности. Пожалуйста, попробуйте снова.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Настройки</h1>
                <p className="text-muted-foreground">
                    Управляйте своим аккаунтом, настройками приватности и уведомлениями.
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                    <TabsTrigger value="profile"><UserIcon className="mr-2 h-4 w-4" />Профиль</TabsTrigger>
                    <TabsTrigger value="security"><KeyRound className="mr-2 h-4 w-4" />Безопасность</TabsTrigger>
                    <TabsTrigger value="privacy"><Eye className="mr-2 h-4 w-4" />Приватность</TabsTrigger>
                    <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Уведомления</TabsTrigger>
                    <TabsTrigger value="account"><Trash2 className="mr-2 h-4 w-4" />Аккаунт</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onProfileSubmit)}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Публичный профиль</CardTitle>
                                    <CardDescription>Эта информация будет видна другим пользователям.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                                            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex gap-2">
                                            <Button type="button">Сменить аватар</Button>
                                            <Button type="button" variant="ghost">Удалить</Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Имя</FormLabel>
                                                    <FormControl><Input {...field} disabled={isPending} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" defaultValue={user.email} disabled />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Город</FormLabel>
                                                    <FormControl><Input {...field} disabled={isPending} /></FormControl>
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
                                                    <FormControl><Input {...field} disabled={isPending} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                     <Button type="submit" disabled={isPending}>
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Сохранить изменения
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>
                    </Form>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Пароль и безопасность</CardTitle>
                            <CardDescription>Управляйте паролем и настройками входа.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Текущий пароль</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">Новый пароль</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                            </div>
                            <Button onClick={() => handleSave('Пароль')}>Сменить пароль</Button>

                            <div className="mt-6 border-t pt-6">
                                <Label className="text-lg font-semibold">Двухфакторная аутентификация</Label>
                                <div className="mt-2 flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="font-medium">Включить 2FA</p>
                                        <p className="text-sm text-muted-foreground">Добавьте дополнительный уровень защиты вашему аккаунту.</p>
                                    </div>
                                    <Switch id="2fa-switch" checked={is2faEnabled} onCheckedChange={setIs2faEnabled} />
                                </div>
                            </div>
                             <div className="mt-6 border-t pt-6 space-y-4">
                                 <div className="flex items-center justify-between">
                                    <Label className="text-lg font-semibold">Рекомендации по безопасности от ИИ</Label>
                                    <Button variant="outline" onClick={handleCheckSecurity} disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>}
                                        Проверить сейчас
                                    </Button>
                                 </div>
                                {isLoading && (
                                    <div className="space-y-2">
                                        <Skeleton className="h-16 w-full"/>
                                        <Skeleton className="h-16 w-full"/>
                                    </div>
                                )}
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Ошибка</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                {!isLoading && !error && aiResult && (
                                     <div className="space-y-2">
                                        {aiResult.recommendations.length > 0 ? (
                                            aiResult.recommendations.map((rec, index) => (
                                                <SecurityRecommendationCard key={index} recommendation={rec} />
                                            ))
                                        ) : (
                                            <SecurityRecommendationCard recommendation={{
                                                title: "Всё в порядке!",
                                                description: "Мы не обнаружили подозрительной активности в вашем аккаунте. Так держать!",
                                                severity: "low"
                                            }} />
                                        )}
                                    </div>
                                )}
                                 {!isLoading && !aiResult && !error && (
                                    <Card className="bg-muted/50 border-dashed">
                                        <CardHeader>
                                            <CardDescription>Нажмите кнопку "Проверить сейчас", чтобы ИИ проанализировал активность вашего аккаунта и дал персональные рекомендации по безопасности.</CardDescription>
                                        </CardHeader>
                                    </Card>
                                 )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                {/* Privacy Tab */}
                <TabsContent value="privacy" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Настройки приватности</CardTitle>
                            <CardDescription>Контролируйте, какую информацию видят другие.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="profile-visibility">Кто может видеть мой профиль</Label>
                                        <p className="text-xs text-muted-foreground">Определите, кто может просматривать ваш полный профиль.</p>
                                    </div>
                                    <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                                        <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Все</SelectItem>
                                            <SelectItem value="friends">Только друзья</SelectItem>
                                            <SelectItem value="none">Только я</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="stats-visibility">Кто может видеть мою статистику</Label>
                                        <p className="text-xs text-muted-foreground">Выберите, кому будет доступна ваша игровая статистика.</p>
                                    </div>
                                    <Select value={statsVisibility} onValueChange={setStatsVisibility}>
                                        <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Все</SelectItem>
                                            <SelectItem value="friends">Только друзья</SelectItem>
                                            <SelectItem value="none">Только я</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="pm-access">Кто может писать мне личные сообщения</Label>
                                         <p className="text-xs text-muted-foreground">Ограничьте круг лиц, которые могут отправлять вам сообщения.</p>
                                    </div>
                                     <Select value={pmAccess} onValueChange={setPmAccess}>
                                        <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Все</SelectItem>
                                            <SelectItem value="friends">Только друзья</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="font-medium">Режим невидимки</p>
                                        <p className="text-sm text-muted-foreground">Скрыть ваш онлайн-статус от других пользователей.</p>
                                    </div>
                                    <Switch id="invisible-mode" checked={isInvisible} onCheckedChange={setIsInvisible} />
                                </div>
                            </div>
                            <Button onClick={() => handleSave('Приватность')}>Сохранить настройки приватности</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Уведомления</CardTitle>
                            <CardDescription>Выберите, как и когда мы можем с вами связываться.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <h3 className="text-lg font-medium">Email-уведомления</h3>
                             <div className="space-y-2">
                                <div className="flex items-center gap-2"><Checkbox id="email-news" checked={emailNews} onCheckedChange={(checked) => setEmailNews(Boolean(checked))} /> <Label htmlFor="email-news">Новости и обновления платформы</Label></div>
                                <div className="flex items-center gap-2"><Checkbox id="email-matches" checked={emailMatches} onCheckedChange={(checked) => setEmailMatches(Boolean(checked))} /> <Label htmlFor="email-matches">Напоминания о матчах</Label></div>
                                <div className="flex items-center gap-2"><Checkbox id="email-social" checked={emailSocial} onCheckedChange={(checked) => setEmailSocial(Boolean(checked))} /> <Label htmlFor="email-social">Комментарии, лайки и упоминания</Label></div>
                            </div>

                             <div className="border-t pt-6">
                                 <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Режим "Не беспокоить"</p>
                                        <p className="text-sm text-muted-foreground">Временно отключить все уведомления.</p>
                                    </div>
                                    <Switch id="dnd-mode" checked={dndMode} onCheckedChange={setDndMode} />
                                </div>
                            </div>
                            <Button onClick={() => handleSave('Уведомления')}>Сохранить настройки уведомлений</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                 {/* Account Tab */}
                <TabsContent value="account" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Управление аккаунтом</CardTitle>
                            <CardDescription>Здесь вы можете удалить свой аккаунт.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <Card className="border-destructive bg-destructive/10">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Удалить аккаунт</CardTitle>
                                    <CardDescription className="text-destructive/80">
                                        Это действие необратимо. Все ваши данные, включая профиль, команды, матчи и достижения, будут удалены навсегда.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="destructive">Запросить удаление аккаунта</Button>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
