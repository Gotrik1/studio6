import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, KeyRound, Bell, Eye, ShieldAlert, Trash2 } from "lucide-react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default async function SettingsPage() {
    const user = await getSession();
    if (!user) redirect("/auth");

    const initials = user.name.split(' ').map((n) => n[0]).join('');

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
                    <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />Профиль</TabsTrigger>
                    <TabsTrigger value="security"><KeyRound className="mr-2 h-4 w-4" />Безопасность</TabsTrigger>
                    <TabsTrigger value="privacy"><Eye className="mr-2 h-4 w-4" />Приватность</TabsTrigger>
                    <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Уведомления</TabsTrigger>
                    <TabsTrigger value="account"><Trash2 className="mr-2 h-4 w-4" />Аккаунт</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-6">
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
                                    <Button>Сменить аватар</Button>
                                    <Button variant="ghost">Удалить</Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Имя</Label>
                                    <Input id="name" defaultValue={user.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue={user.email} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">Город</Label>
                                    <Input id="city" defaultValue="Москва" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sport">Основной вид спорта</Label>
                                    <Input id="sport" defaultValue="Valorant" />
                                </div>
                            </div>
                             <Button>Сохранить изменения</Button>
                        </CardContent>
                    </Card>
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
                            <Button>Сменить пароль</Button>

                            <div className="mt-6 border-t pt-6">
                                <Label className="text-lg font-semibold">Двухфакторная аутентификация</Label>
                                <div className="mt-2 flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="font-medium">Включить 2FA</p>
                                        <p className="text-sm text-muted-foreground">Добавьте дополнительный уровень защиты вашему аккаунту.</p>
                                    </div>
                                    <Switch id="2fa-switch" />
                                </div>
                            </div>
                             <div className="mt-6 border-t pt-6">
                                <Card className="bg-muted/50">
                                    <CardHeader className="flex-row items-center gap-4">
                                        <ShieldAlert className="h-8 w-8 text-primary"/>
                                        <div>
                                            <CardTitle className="text-lg">Рекомендации по безопасности от ИИ</CardTitle>
                                            <CardDescription>Последний вход: 2 часа назад с IP 192.168.1.1 (Москва). Необычная активность не замечена.</CardDescription>
                                        </div>
                                    </CardHeader>
                                </Card>
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
                                    <Select defaultValue="all">
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
                                    <Select defaultValue="all">
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
                                     <Select defaultValue="all">
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
                                    <Switch id="invisible-mode" />
                                </div>
                            </div>
                            <Button>Сохранить настройки приватности</Button>
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
                                <div className="flex items-center gap-2"><Checkbox id="email-news" defaultChecked /> <Label htmlFor="email-news">Новости и обновления платформы</Label></div>
                                <div className="flex items-center gap-2"><Checkbox id="email-matches" defaultChecked /> <Label htmlFor="email-matches">Напоминания о матчах</Label></div>
                                <div className="flex items-center gap-2"><Checkbox id="email-social" /> <Label htmlFor="email-social">Комментарии, лайки и упоминания</Label></div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-medium">Push-уведомления</h3>
                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center gap-2"><Checkbox id="push-all" defaultChecked /> <Label htmlFor="push-all">Все push-уведомления</Label></div>
                                </div>
                            </div>
                             <div className="border-t pt-6">
                                 <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Режим "Не беспокоить"</p>
                                        <p className="text-sm text-muted-foreground">Временно отключить все уведомления.</p>
                                    </div>
                                    <Switch id="dnd-mode" />
                                </div>
                            </div>
                            <Button>Сохранить настройки уведомлений</Button>
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
