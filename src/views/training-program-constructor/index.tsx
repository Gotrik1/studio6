
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { useToast } from '@/shared/hooks/use-toast';
import { Loader2, Sparkles, Wand2, Dumbbell, CheckCircle, BrainCircuit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { generateTrainingProgram, type GenerateTrainingProgramOutput, type GenerateTrainingProgramInput } from '@/shared/api/genkit/flows/generate-training-program-flow';
import { GenerateTrainingProgramInputSchema } from '@/shared/api/genkit/flows/schemas/generate-training-program-schema';
import type * as z from 'zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { useTraining } from '@/app/providers/training-provider';
import type { TrainingProgram } from '@/shared/lib/mock-data/training-programs';

type FormValues = z.infer<typeof GenerateTrainingProgramInputSchema>;

export function TrainingProgramConstructorPage() {
    const { toast } = useToast();
    const { selectProgram } = useTraining();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GenerateTrainingProgramOutput | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(GenerateTrainingProgramInputSchema),
        defaultValues: {
            goal: 'Набор массы',
            experience: 'Новичок',
            daysPerWeek: 3,
            gender: 'Мужской',
            focus: 'Нет',
        },
    });

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const program = await generateTrainingProgram(data);
            setResult(program);
            toast({
                title: "Программа сгенерирована!",
                description: "Ваш персональный план тренировок готов.",
            });
        } catch (e) {
            console.error(e);
            setError('Не удалось сгенерировать программу. Пожалуйста, попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSelectProgram = () => {
        if (!result) return;
        
        const formValues = form.getValues();

        const newProgram: TrainingProgram = {
            id: `ai-${Date.now()}`,
            name: result.programName,
            description: result.description,
            goal: formValues.goal,
            daysPerWeek: formValues.daysPerWeek,
            splitType: 'Split', // This is a simplification. Could be derived from AI output in the future.
            author: 'ProDvor AI',
            coverImage: 'https://placehold.co/600x400.png',
            coverImageHint: 'ai circuit board',
            isAiGenerated: true,
        };

        selectProgram(newProgram);

        toast({
            title: "Программа выбрана!",
            description: `Вы начали новую программу: "${result.programName}".`,
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card className="sticky top-20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Wand2 /> Конструктор программы</CardTitle>
                        <CardDescription>Заполните параметры, и AI создаст для вас индивидуальный план.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField control={form.control} name="goal" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Цель</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Набор массы">Набор массы</SelectItem>
                                                <SelectItem value="Снижение веса">Снижение веса</SelectItem>
                                                <SelectItem value="Рельеф">Рельеф</SelectItem>
                                                <SelectItem value="Сила">Сила</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="experience" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Опыт</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Новичок">Новичок (до 6 мес)</SelectItem>
                                                <SelectItem value="Опытный">Опытный (6-24 мес)</SelectItem>
                                                <SelectItem value="Профи">Профи (2+ года)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="daysPerWeek" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Дней в неделю</FormLabel>
                                        <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="2">2 дня</SelectItem>
                                                <SelectItem value="3">3 дня</SelectItem>
                                                <SelectItem value="4">4 дня</SelectItem>
                                                <SelectItem value="5">5 дней</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                 <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Пол</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Мужской">Мужской</SelectItem>
                                                <SelectItem value="Женский">Женский</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="focus" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Акцент (опционально)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Нет">Нет</SelectItem>
                                                <SelectItem value="Грудь">Грудь</SelectItem>
                                                <SelectItem value="Спина">Спина</SelectItem>
                                                <SelectItem value="Ноги">Ноги</SelectItem>
                                                <SelectItem value="Плечи">Плечи</SelectItem>
                                                <SelectItem value="Руки">Руки</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Сгенерировать
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                 {isLoading && (
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-full mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </CardContent>
                    </Card>
                )}

                {error && <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                {result ? (
                     <Card className="animate-in fade-in-50">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{result.programName}</CardTitle>
                            <CardDescription className="flex items-start gap-2 pt-2">
                               <BrainCircuit className="h-4 w-4 mt-1 flex-shrink-0" />
                               <span>{result.description}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                                {result.weeklySplit.map((day, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger className="font-semibold text-lg">
                                            <div className="flex items-center gap-2">
                                                <Dumbbell className="h-5 w-5 text-primary"/>
                                                {day.day}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="space-y-2 pl-6">
                                                {day.exercises.map(ex => (
                                                    <li key={ex.name} className="flex justify-between items-center text-sm">
                                                        <span>{ex.name}</span>
                                                        <span className="font-mono text-xs text-muted-foreground">{ex.sets}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" onClick={handleSelectProgram}>
                                <CheckCircle className="mr-2 h-4 w-4"/> Выбрать эту программу
                            </Button>
                        </CardFooter>
                    </Card>
                ) : !isLoading && (
                     <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                        <Dumbbell className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">Ваша персональная программа появится здесь</h3>
                        <p className="text-muted-foreground">Заполните форму слева, чтобы начать.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
