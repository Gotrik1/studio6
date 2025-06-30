
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Loader2, PlusCircle, Trash2, GripVertical, Dumbbell } from 'lucide-react';
import type { Exercise } from '@/shared/lib/mock-data/exercises';
import { ExercisePickerDialog } from '@/widgets/exercise-picker-dialog';
import type { TrainingProgram } from '@/entities/training-program/model/types';
import { exercisesList } from '@/shared/lib/mock-data/exercises';


const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  sets: z.string().min(1, "Обязательно"),
  reps: z.string().min(1, "Обязательно"),
});

const workoutDaySchema = z.object({
  title: z.string().min(3, "Название дня обязательно"),
  exercises: z.array(exerciseSchema).min(1, "Добавьте хотя бы одно упражнение"),
});

const programSchema = z.object({
  name: z.string().min(3, "Название программы обязательно"),
  description: z.string().optional(),
  goal: z.enum(['Набор массы', 'Снижение веса', 'Рельеф', 'Сила']),
  splitType: z.enum(['Full-body', 'Split', 'Upper/Lower']),
  days: z.array(workoutDaySchema).min(1, "Добавьте хотя бы один тренировочный день"),
});

export type ProgramFormValues = z.infer<typeof programSchema>;

interface TrainingProgramFormProps {
    initialData?: TrainingProgram;
    onSubmit: (data: ProgramFormValues) => void;
    isSaving: boolean;
}

export function TrainingProgramForm({ initialData, onSubmit, isSaving }: TrainingProgramFormProps) {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
    
    const isEditMode = !!initialData;

    const form = useForm<ProgramFormValues>({
        resolver: zodResolver(programSchema),
        defaultValues: {
            name: '',
            description: '',
            goal: 'Набор массы',
            splitType: 'Split',
            days: [
                { title: 'День 1: Грудь и Трицепс', exercises: [] },
                { title: 'День 2: Спина и Бицепс', exercises: [] },
                { title: 'День 3: Ноги и Плечи', exercises: [] },
            ],
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                description: initialData.description,
                goal: initialData.goal,
                splitType: initialData.splitType,
                days: initialData.weeklySplit.map(day => ({
                    title: day.title,
                    exercises: day.exercises.map(ex => {
                        const fullExercise = exercisesList.find(e => e.name === ex.name);
                        return {
                            id: fullExercise?.id || `temp-${Math.random()}`,
                            name: ex.name,
                            sets: ex.sets,
                            reps: ex.reps
                        }
                    })
                }))
            });
        }
    }, [initialData, form]);
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'days',
    });
    
    const dayFieldArrays = fields.map((_field, index) => {
        return useFieldArray({
            control: form.control,
            name: `days.${index}.exercises`
        });
    });

    const openExercisePicker = (dayIndex: number) => {
        setCurrentDayIndex(dayIndex);
        setIsPickerOpen(true);
    };

    const handleSelectExercises = (exercises: Exercise[]) => {
        if (currentDayIndex === null) return;
        const exerciseControls = dayFieldArrays[currentDayIndex];
        exercises.forEach(ex => {
            exerciseControls.append({ id: ex.id, name: ex.name, sets: '3', reps: '10-12' });
        });
    };
    
    return (
         <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2 text-center">
                        <Dumbbell className="mx-auto h-12 w-12 text-primary" />
                        <h1 className="font-headline text-3xl font-bold tracking-tight">
                            {isEditMode ? 'Редактирование программы' : 'Конструктор программ'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEditMode ? 'Измените детали вашего тренировочного плана.' : 'Создайте свой идеальный тренировочный план вручную.'}
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Общая информация</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Название программы</FormLabel><FormControl><Input placeholder="Например, Моя программа на массу" {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Описание (необязательно)</FormLabel><FormControl><Input placeholder="Краткое описание целей и методики" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name="goal" render={({ field }) => (<FormItem><FormLabel>Цель</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Набор массы">Набор массы</SelectItem><SelectItem value="Снижение веса">Снижение веса</SelectItem><SelectItem value="Рельеф">Рельеф</SelectItem><SelectItem value="Сила">Сила</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name="splitType" render={({ field }) => (<FormItem><FormLabel>Тип сплита</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Split">Сплит</SelectItem><SelectItem value="Upper/Lower">Верх/Низ</SelectItem><SelectItem value="Full-body">Full-body</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        </CardContent>
                    </Card>

                    {fields.map((field, index) => {
                        const exerciseControls = dayFieldArrays[index];
                        return (
                            <Card key={field.id}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex-1">
                                        <FormField control={form.control} name={`days.${index}.title`} render={({ field }) => (<FormItem><FormLabel className="sr-only">Название дня</FormLabel><FormControl><Input placeholder="Название дня, например 'День 1: Грудь'" {...field} className="text-lg font-semibold border-0 p-0 shadow-none focus-visible:ring-0" /></FormControl><FormMessage /></FormItem>)} />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </CardHeader>
                                <CardContent>
                                    {exerciseControls.fields.map((exField, exIndex) => (
                                        <div key={exField.id} className="flex items-center gap-2 py-2 border-b last:border-b-0">
                                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                                            <p className="flex-1 font-medium text-sm">{exField.name}</p>
                                            <FormField control={form.control} name={`days.${index}.exercises.${exIndex}.sets`} render={({ field }) => (<FormItem><FormControl><Input placeholder="3-4" {...field} className="w-20 text-center" /></FormControl></FormItem>)} />
                                            <FormField control={form.control} name={`days.${index}.exercises.${exIndex}.reps`} render={({ field }) => (<FormItem><FormControl><Input placeholder="8-12" {...field} className="w-20 text-center" /></FormControl></FormItem>)} />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => exerciseControls.remove(exIndex)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => openExercisePicker(index)}><PlusCircle className="mr-2 h-4 w-4" /> Добавить упражнение</Button>
                                    <FormMessage>{form.formState.errors.days?.[index]?.exercises?.message}</FormMessage>
                                </CardContent>
                            </Card>
                        );
                    })}

                    <div className="flex justify-between gap-4">
                        <Button type="button" variant="outline" className="w-full" onClick={() => append({ title: `День ${fields.length + 1}`, exercises: [] })}><PlusCircle className="mr-2 h-4 w-4" /> Добавить день</Button>
                        <Button type="submit" className="w-full" disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isEditMode ? 'Сохранить изменения' : 'Создать программу'}
                        </Button>
                    </div>
                </form>
            </Form>
            
            <ExercisePickerDialog
                isOpen={isPickerOpen}
                onOpenChange={setIsPickerOpen}
                onSelectExercises={handleSelectExercises}
            />
        </>
    )
}
