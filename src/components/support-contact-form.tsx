'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const supportFormSchema = z.object({
  email: z.string().email({ message: "Введите корректный email." }),
  category: z.string({ required_error: "Выберите категорию." }),
  subject: z.string().min(5, { message: "Тема должна содержать не менее 5 символов." }),
  message: z.string().min(10, { message: "Сообщение должно содержать не менее 10 символов." }),
});

type FormValues = z.infer<typeof supportFormSchema>;

export function SupportContactForm() {
    const form = useForm<FormValues>({
        resolver: zodResolver(supportFormSchema),
        defaultValues: {
            email: "",
            subject: "",
            message: "",
        },
    });
    const { toast } = useToast();

    const onSubmit = async (data: FormValues) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(data); // In a real app, you'd send this to your backend
        
        toast({
            title: "Сообщение отправлено!",
            description: "Наша команда поддержки свяжется с вами в ближайшее время.",
        });
        form.reset();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ваш Email</FormLabel>
                            <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Категория</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите тип обращения" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="question">Вопрос</SelectItem>
                                    <SelectItem value="bug">Сообщить об ошибке</SelectItem>
                                    <SelectItem value="feedback">Предложение</SelectItem>
                                    <SelectItem value="payment">Проблема с оплатой</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Тема</FormLabel>
                            <FormControl>
                                <Input placeholder="Например, не могу создать команду" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Сообщение</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Опишите вашу проблему как можно подробнее..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Отправка...' : 'Отправить'}
                </Button>
            </form>
        </Form>
    )
}
