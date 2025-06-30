
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/shared/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTraining } from '@/app/providers/training-provider';
import type { TrainingProgram } from '@/entities/training-program/model/types';
import { generateTrainingProgram, type GenerateTrainingProgramOutput } from '@/shared/api/genkit/flows/generate-training-program-flow';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Loader2, Sparkles, AlertCircle, Bot } from 'lucide-react';

const aiFormSchema = z.object({
  goal: z.enum(['Набор массы', 'Снижение веса', 'Рельеф', 'Сила']),
  experience: z.enum(['Новичок', 'Опытный', 'Профи']),
  daysPerWeek: z.coerce.number().min(2).max(5),
  gender: z.enum(['Мужской', 'Женский']),
  focus: z.enum(['Грудь', 'Спина', 'Ноги', 'Плечи', 'Руки', 'Нет']),
});

type AiFormValues = z.infer<typeof aiFormSchema>;

export function AiProgramGenerator() {
    const router = useRouter();
    const { toast } = useToast();
    const { addProgram } = useTraining();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GenerateTrainingProgramOutput | null>(null);

    const form = useForm<AiFormValues>({
        resolver: zodResolver(aiFormSchema),
        defaultValues: {
            goal: 'Набор массы',
            experience: 'Опытный',
            daysPerWeek: 3,
            gender: 'Мужской',
            focus: 'Нет',
        },
    });

    const onSubmit = async (data: AiFormValues) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const aiResult = await generateTrainingProgram(data);
            setResult(aiResult);
        } catch (e) {
            console.error("AI Program generation failed:", e);
            setError("Не удалось сгенерировать программу. Попробуйте еще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProgram = () => {
        if (!result) return;
        const newProgram: TrainingProgram = {
            id: `ai-${Date.now()}`,
            name: result.programName,
            description: result.description,
            goal: form.getValues('goal'),
            daysPerWeek: form.getValues('daysPerWeek'),
            splitType: 'Split', // The AI can decide this, but for now, we'll simplify
            author: 'ProDvor AI',
            coverImage: 'https://placehold.co/600x400.png',
            coverImageHint: 'ai circuit board',
            isAiGenerated: true,
            weeklySplit: result.weeklySplit.map((day, index) => ({
                day: index + 1,
                title: day.day,
                exercises: day.exercises.map(ex => ({ name: ex.name, sets: ex.sets, reps: ex.reps })),
            })),
        };

        addProgram(newProgram);
        toast({
            title: "Программа сохранена!",
            description: `AI-программа "${newProgram.name}" добавлена в ваш список.`,
        });
        router.push(`/training/programs/${newProgram.id}`);
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>AI-Генератор Программ</CardTitle>
                <CardDescription>Задайте параметры, и наш AI-тренер создаст для вас персонализированную программу.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormField control={form.control} name="goal" render={({ field }) => (<FormItem><FormLabel>Ваша цель</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Набор массы">Набор массы</SelectItem><SelectItem value="Снижение веса">Снижение веса</SelectItem><SelectItem value="Рельеф">Рельеф</SelectItem><SelectItem value="Сила">Сила</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="experience" render={({ field }) => (<FormItem><FormLabel>Уровень</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Новичок">Новичок</SelectItem><SelectItem value="Опытный">Опытный</SelectItem><SelectItem value="Профи">Профи</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name="daysPerWeek" render={({ field }) => (<FormItem><FormLabel>Дней в неделю</FormLabel><Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={String(field.value)}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="2">2 дня</SelectItem><SelectItem value="3">3 дня</SelectItem><SelectItem value="4">4 дня</SelectItem><SelectItem value="5">5 дней</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Пол</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Мужской">Мужской</SelectItem><SelectItem value="Женский">Женский</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name="focus" render={({ field }) => (<FormItem><FormLabel>Акцент</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Нет">Нет</SelectItem><SelectItem value="Грудь">Грудь</SelectItem><SelectItem value="Спина">Спина</SelectItem><SelectItem value="Ноги">Ноги</SelectItem><SelectItem value="Плечи">Плечи</SelectItem><SelectItem value="Руки">Руки</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                         </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                            Сгенерировать программу
                        </Button>
                    </CardFooter>
                </form>
            </Form>

            {error && <CardContent><Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></CardContent>}
            
            {isLoading && <CardContent><div className="space-y-4"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-32 w-full" /></div></CardContent>}

            {result && (
                <CardContent className="space-y-4 border-t pt-6 animate-in fade-in-50">
                     <Alert>
                        <Bot className="h-4 w-4" />
                        <AlertTitle>{result.programName}</AlertTitle>
                        <AlertDescription>{result.description}</AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                        {result.weeklySplit.map((day, i) => (
                            <p key={i} className="text-sm text-muted-foreground"><strong className="text-foreground">{day.day}:</strong> {day.exercises.map(e => e.name).join(', ')}</p>
                        ))}
                    </div>
                    <Button onClick={handleSaveProgram} className="w-full">Сохранить и просмотреть программу</Button>
                </CardContent>
            )}
        </Card>
    );
}
