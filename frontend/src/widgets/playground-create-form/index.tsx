'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import { useToast } from '@/shared/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, PlusCircle, UploadCloud, MapPin } from 'lucide-react';
import { createPlayground } from '@/entities/playground/api/playgrounds';


const features = [
    { id: 'Освещение', label: 'Освещение' },
    { id: 'Ограждение', label: 'Ограждение' },
    { id: 'Скамейки', label: 'Скамейки' },
    { id: 'Раздевалка с душем', label: 'Раздевалка с душем' },
    { id: 'Источник воды', label: 'Источник воды' },
    { id: 'Ворота', label: 'Ворота' },
    { id: 'Кольца (баскетбол)', label: 'Кольца (баскетбол)' },
    { id: 'Сетка (волейбол)', label: 'Сетка (волейбол)' },
    { id: 'Турники', label: 'Турники' },
    { id: 'Силовые тренажеры', label: 'Силовые тренажеры' },
    { id: 'Кардио-зона', label: 'Кардио-зона' },
    { id: 'Подъемник', label: 'Подъемник' },
    { id: 'Прокат инвентаря', label: 'Прокат инвентаря' },
    { id: 'Мишени', label: 'Мишени' },
];

const playgroundSchema = z.object({
  name: z.string().min(3, 'Название должно быть не менее 3 символов.'),
  address: z.string().min(10, 'Укажите более подробный адрес.'),
  type: z.string({required_error: "Выберите тип"}),
  surface: z.string({required_error: "Выберите покрытие"}),
  features: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  coverImageHint: z.string().optional(),
});

type FormValues = z.infer<typeof playgroundSchema>;

export function PlaygroundCreateForm() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(playgroundSchema),
        defaultValues: { name: '', address: '', features: [] },
    });

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        
        const result = await createPlayground({ ...data, features: data.features || [] });

        if (result.success) {
             let toastDescription = 'Место добавлено и отправлено на модерацию! Вы получили 1 месяц PRO-подписки!';
            // Could check user role here in a real app
            toast({
                title: "Место добавлено!",
                description: toastDescription
            });
            router.push('/playgrounds');
        } else {
             toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: result.error || "Не удалось добавить место.",
            });
        }
        setIsSubmitting(false);
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Информация о месте</CardTitle>
                        <CardDescription>
                            Добавьте новое место. Оно появится на карте и будет ожидать проверки модератором. За каждое уникальное место вы получите 1 месяц PRO-подписки!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField name="name" control={form.control} render={({field}) => (
                            <FormItem><FormLabel>Название</FormLabel><FormControl><Input placeholder="Например, Коробка за домом или Фитнес-клуб 'Атлет'" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="address" control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Адрес</FormLabel>
                                <FormControl><Input placeholder="Город, улица, дом" {...field} /></FormControl>
                                <FormDescription>Начните вводить адрес, а затем уточните положение на карте.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        
                        <div className="space-y-2">
                             <FormLabel>Расположение на карте</FormLabel>
                             <div className="h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground border">
                                <MapPin className="h-8 w-8" />
                             </div>
                             <Button type="button" variant="outline" className="w-full" onClick={() => toast({ title: "Карта будет здесь!", description: "В продакшен-версии здесь будет интерактивная карта для установки метки." })}>
                                 <MapPin className="mr-2 h-4 w-4" />
                                 Уточнить на карте
                             </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField name="type" control={form.control} render={({field}) => (
                                <FormItem><FormLabel>Тип места</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите тип"/></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Футбол">Футбол</SelectItem>
                                    <SelectItem value="Баскетбол">Баскетбол</SelectItem>
                                    <SelectItem value="Стритбол">Стритбол</SelectItem>
                                    <SelectItem value="Воркаут">Воркаут</SelectItem>
                                    <SelectItem value="Фитнес-зал">Фитнес-зал</SelectItem>
                                    <SelectItem value="Бассейн">Бассейн</SelectItem>
                                    <SelectItem value="Теннисный корт">Теннисный корт</SelectItem>
                                    <SelectItem value="Лыжная трасса">Лыжная трасса</SelectItem>
                                    <SelectItem value="Биатлонный комплекс">Биатлонный комплекс</SelectItem>
                                    <SelectItem value="Каток">Каток</SelectItem>
                                    <SelectItem value="Сноуборд-парк">Сноуборд-парк</SelectItem>
                                    <SelectItem value="Горнолыжный склон">Горнолыжный склон</SelectItem>
                                    <SelectItem value="Стрельбище">Стрельбище</SelectItem>
                                    <SelectItem value="Универсальная">Универсальная</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                            <FormField name="surface" control={form.control} render={({field}) => (
                                <FormItem><FormLabel>Покрытие</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите покрытие"/></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Асфальт">Асфальт</SelectItem>
                                    <SelectItem value="Резина">Резина</SelectItem>
                                    <SelectItem value="Искусственный газон">Искусственный газон</SelectItem>
                                    <SelectItem value="Профессиональный газон">Профессиональный газон</SelectItem>
                                    <SelectItem value="Грунт">Грунт</SelectItem>
                                    <SelectItem value="Паркет">Паркет</SelectItem>
                                    <SelectItem value="Вода">Вода</SelectItem>
                                    <SelectItem value="Снег">Снег</SelectItem>
                                    <SelectItem value="Лед">Лед</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField name="features" control={form.control} render={() => (
                            <FormItem>
                                <div className="mb-4"><FormLabel>Особенности</FormLabel></div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {features.map((item) => (
                                    <FormField key={item.id} control={form.control} name="features" render={({ field }) => (
                                        <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                                return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                            }} /></FormControl>
                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                        </FormItem>
                                    )} />
                                ))}
                                </div>
                            </FormItem>
                        )}/>
                        <FormItem>
                            <FormLabel>Фотография</FormLabel>
                            <FormControl>
                                <label htmlFor="media-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground">Нажмите, чтобы загрузить фото</p>
                                    </div>
                                    <input id="media-upload" type="file" className="hidden" accept="image/png, image/jpeg" />
                                </label>
                            </FormControl>
                        </FormItem>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             <PlusCircle className="mr-2 h-4 w-4" /> Добавить место
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
