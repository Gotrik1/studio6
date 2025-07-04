'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Input } from '@/shared/ui/input';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { generateTrainingProgram, type GenerateTrainingProgramOutput } from '@/shared/api/genkit/flows/generate-training-program-flow';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import type { TrainingProgram } from '@/entities/training-program/model/types';

const aiFormSchema = z.object({
  goal: z.enum(['Набор массы', 'Снижение веса', 'Рельеф', 'Сила']),
  experience: z.enum(['Новичок', 'Средний', 'Продвинутый']),
  daysPerWeek: z.coerce.number().min(2).max(6),
  gender: z.enum(['Мужской', 'Женский']),
  focus: z.string().optional(),
});

type AiFormValues = z.infer<typeof aiFormSchema>;

interface AiProgramGeneratorProps {
    onProgramGenerated: (program: TrainingProgram) => void;
}

export function AiProgramGenerator({ onProgramGenerated }: AiProgramGeneratorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<AiFormValues>({
        resolver: zodResolver(aiFormSchema),
        defaultValues: {
            goal: 'Набор массы',
            experience: 'Средний',
            daysPerWeek: 3,
            gender: 'Мужской',
            focus: '',
        },
    });

    const onSubmit = async (data: AiFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            const result: GenerateTrainingProgramOutput = await generateTrainingProgram(data);
            const newProgram: TrainingProgram = {
                id: `ai-${Date.now()}`,
                name: result.name,
                description: result.description,
                goal: data.goal,
                daysPerWeek: data.daysPerWeek,
                splitType: 'Split', // Default, could be inferred by AI later
                author: 'ProDvor AI',
                coverImage: 'https://placehold.co/600x400.png',
                coverImageHint: 'ai circuit board',
                isAiGenerated: true,
                weeklySplit: result.weeklySplit,
            };
            onProgramGenerated(newProgram);
        } catch (e) {
            console.error("AI Program Generation failed:", e);
            setError("Не удалось сгенерировать программу. Попробуйте изменить параметры или повторить попытку позже.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BrainCircuit />AI-Генератор</CardTitle>
                <CardDescription>Опишите ваши цели и уровень подготовки, и наш AI-тренер создаст для вас персональную программу тренировок.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="goal" render={({ field }) => (<FormItem><FormLabel>Ваша главная цель</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Набор массы">Набор массы</SelectItem><SelectItem value="Снижение веса">Снижение веса</SelectItem><SelectItem value="Рельеф">Рельеф</SelectItem><SelectItem value="Сила">Сила</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="experience" render={({ field }) => (<FormItem><FormLabel>Ваш опыт</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Новичок">Новичок (до 6 мес)</SelectItem><SelectItem value="Средний">Средний (6-18 мес)</SelectItem><SelectItem value="Продвинутый">Продвинутый (18+ мес)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="daysPerWeek" render={({ field }) => (<FormItem><FormLabel>Тренировок в неделю</FormLabel><Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={String(field.value)}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{[2,3,4,5,6].map(d => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Пол</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Мужской">Мужской</SelectItem><SelectItem value="Женский">Женский</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        </div>
                        <FormField control={form.control} name="focus" render={({ field }) => (<FormItem><FormLabel>Дополнительный фокус (необязательно)</FormLabel><FormControl><Input placeholder="Например: акцент на руки, кардио" {...field} /></FormControl></FormItem>)} />
                        {error && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                         <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                            {isLoading ? 'Идет подбор упражнений...' : 'Сгенерировать программу'}
                        </Button>
                    </CardContent>
                </form>
            </Form>
        </Card>
    );
}
