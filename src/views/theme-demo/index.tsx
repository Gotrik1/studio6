
'use client';

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Progress } from "@/shared/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Terminal } from "lucide-react";

export function ThemeDemoPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Демонстрация темы</h1>
        <p className="text-muted-foreground">
          Эта страница демонстрирует различные компоненты пользовательского интерфейса с текущей темой и акцентным цветом.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Кнопки</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button>Основная</Button>
                    <Button variant="secondary">Вторичная</Button>
                    <Button variant="destructive">Опасная</Button>
                    <Button variant="outline">Контурная</Button>
                    <Button variant="ghost">Призрачная</Button>
                    <Button variant="link">Ссылка</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Формы</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="Email" />
                    </div>
                     <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="framework">Фреймворк</Label>
                        <Select>
                            <SelectTrigger id="framework">
                                <SelectValue placeholder="Выбрать" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="next">Next.js</SelectItem>
                                <SelectItem value="sveltekit">SvelteKit</SelectItem>
                                <SelectItem value="astro">Astro</SelectItem>
                                <SelectItem value="nuxt">Nuxt.js</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Switch id="airplane-mode" />
                        <Label htmlFor="airplane-mode">Режим полета</Label>
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Индикаторы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label>Прогресс бар</Label>
                        <Progress value={33} className="mt-2" />
                    </div>
                     <div>
                        <Label>Слайдер</Label>
                        <Slider defaultValue={[50]} max={100} step={1} className="mt-2" />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Вкладки</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="account" className="w-full">
                        <TabsList>
                            <TabsTrigger value="account">Аккаунт</TabsTrigger>
                            <TabsTrigger value="password">Пароль</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <p className="p-4 text-muted-foreground">Содержимое вкладки "Аккаунт".</p>
                        </TabsContent>
                        <TabsContent value="password">
                             <p className="p-4 text-muted-foreground">Содержимое вкладки "Пароль".</p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Всплывающее окно</CardTitle>
                </CardHeader>
                <CardContent>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Открыть окно</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                               <h4 className="font-medium leading-none">Размеры</h4>
                               <p className="text-sm text-muted-foreground">
                                   Установите размеры для контента.
                               </p>
                            </div>
                        </PopoverContent>
                    </Popover>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Уведомления</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>К вашему сведению!</AlertTitle>
                        <AlertDescription>
                            Это стандартное уведомление.
                        </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Осторожно!</AlertTitle>
                        <AlertDescription>
                           Это уведомление об ошибке.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
