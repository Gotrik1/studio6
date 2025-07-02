
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Checkbox } from '@/shared/ui/checkbox';
import { CheckCircle2, XCircle, Clock, MoreVertical, Edit, Copy, Trash2, Smile, Meh, Frown, MessageSquare, ChevronDown, Link2, Award } from 'lucide-react';
import type { TrainingLogEntry, ExerciseLog } from '@/shared/lib/mock-data/training-log';
import { cn } from '@/shared/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { Separator } from '@/shared/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import { useForm, useFieldArray, useWatch, Control } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { RestTimer } from '@/widgets/rest-timer';
import { getTrainingAnalytics, PersonalRecord } from '@/shared/lib/get-training-analytics';
import { calculate1RM } from '@/shared/lib/calculate-1rm';
import { Badge } from '@/shared/ui/badge';
import Link from 'next/link';
import { exercisesList } from '@/shared/lib/mock-data/exercises';

interface TrainingDayCardProps {
    entry: TrainingLogEntry;
    allEntries: TrainingLogEntry[];
    onDelete: (id: string) => void;
    onCopy: (id: string) => void;
    onUpdate: (data: TrainingLogEntry) => void;
}

interface ExerciseRowProps {
    control: Control<TrainingLogEntry>;
    exerciseIndex: number;
    exercise: ExerciseLog;
    lastPerformance?: string;
    personalRecords: PersonalRecord[];
}

interface SetRowProps {
    control: Control<TrainingLogEntry>;
    exerciseIndex: number;
    setIndex: number;
    personalRecords: PersonalRecord[];
    exercise: ExerciseLog;
}

const statusMap = {
    completed: { icon: CheckCircle2, color: 'text-green-500', label: 'Выполнено' },
    planned: { icon: Clock, color: 'text-blue-500', label: 'Запланировано' },
    skipped: { icon: XCircle, color: 'text-red-500', label: 'Пропущено' },
};

const moodMap = {
    great: { icon: Smile, color: 'text-green-500', label: 'Отлично' },
    good: { icon: Smile, color: 'text-yellow-500', label: 'Хорошо' },
    ok: { icon: Meh, color: 'text-orange-500', label: 'Нормально' },
    bad: { icon: Frown, color: 'text-red-500', label: 'Плохо' },
};

const getExerciseIdByName = (name: string): string => {
    const exercise = exercisesList.find(ex => ex.name === name);
    return exercise ? exercise.id : 'ex-not-found';
};

const SetRow = ({ control, exerciseIndex, setIndex, personalRecords, exercise }: SetRowProps) => {
    const watchedWeight = useWatch({ control, name: `exercises.${exerciseIndex}.sets.${setIndex}.loggedWeight` });
    const watchedReps = useWatch({ control, name: `exercises.${exerciseIndex}.sets.${setIndex}.loggedReps` });
    const currentE1RM = calculate1RM(watchedWeight || 0, watchedReps || 0);
    const exercisePR = personalRecords.find(pr => pr.exercise === exercise.name);
    const isNewPR = currentE1RM > (exercisePR?.e1RM || 0);

    return (
        <TableRow>
            <TableCell className="font-medium text-center">{setIndex + 1}</TableCell>
            <TableCell className="text-muted-foreground">{exercise.sets[setIndex]?.plannedReps} x {exercise.sets[setIndex]?.plannedWeight}</TableCell>
            <TableCell>
                <FormField control={control} name={`exercises.${exerciseIndex}.sets.${setIndex}.loggedReps`} render={({ field }) => (
                    <FormItem><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} value={field.value ?? ''} className="w-20" placeholder={exercise.sets[setIndex]?.plannedReps} /></FormControl></FormItem>
                )} />
            </TableCell>
            <TableCell>
                <FormField control={control} name={`exercises.${exerciseIndex}.sets.${setIndex}.loggedWeight`} render={({ field }) => (
                    <FormItem><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} value={field.value ?? ''} className="w-20" placeholder={exercise.sets[setIndex]?.plannedWeight.replace('кг','').trim()} /></FormControl></FormItem>
                )} />
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <FormField control={control} name={`exercises.${exerciseIndex}.sets.${setIndex}.rpe`} render={({ field }) => (
                        <FormItem><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} value={field.value ?? ''} className="w-16 text-center" placeholder="-" min="1" max="10" /></FormControl></FormItem>
                    )} />
                    {isNewPR && (
                        <Badge variant="secondary" className="bg-amber-400/20 text-amber-500 border-amber-400/50 animate-in fade-in-0 zoom-in-95">
                            <Award className="h-3 w-3 mr-1" />
                            PR!
                        </Badge>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-center">
                <FormField control={control} name={`exercises.${exerciseIndex}.sets.${setIndex}.isCompleted`} render={({ field }) => (
                    <FormItem><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )} />
            </TableCell>
        </TableRow>
    );
};


const ExerciseRow = ({ control, exerciseIndex, exercise, lastPerformance, personalRecords }: ExerciseRowProps) => {
    const { fields } = useFieldArray({
        control,
        name: `exercises.${exerciseIndex}.sets`
    });

    const isSuperset = exercise.isSupersetWithPrevious;

    return (
        <div className={cn("mb-4", isSuperset && "pl-4 border-l-2 border-dashed border-primary/20 ml-2 pt-2")}>
            <div className="flex items-baseline gap-2 mb-2">
                <h4 className="font-semibold flex items-center gap-2">
                    {isSuperset && <Link2 className="h-4 w-4 text-primary/50" />}
                    <Link href={`/training/exercises/${getExerciseIdByName(exercise.name)}`} className="hover:underline hover:text-primary transition-colors">
                        {exercise.name}
                    </Link>
                </h4>
                {lastPerformance && <p className="text-xs text-muted-foreground">(Прошлый раз: {lastPerformance})</p>}
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12 text-center">Сет</TableHead>
                        <TableHead>План</TableHead>
                        <TableHead>Повторения</TableHead>
                        <TableHead>Вес (кг)</TableHead>
                        <TableHead>RPE</TableHead>
                        <TableHead className="w-16 text-center">Готово</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((setField, setIndex) => (
                       <SetRow
                           key={setField.id}
                           control={control}
                           exerciseIndex={exerciseIndex}
                           setIndex={setIndex}
                           personalRecords={personalRecords}
                           exercise={exercise}
                       />
                    ))}
                </TableBody>
            </Table>
            <Collapsible className="mt-2">
                <CollapsibleTrigger asChild>
                    <Button type="button" variant="ghost" size="sm" className="text-xs text-muted-foreground flex items-center gap-2 group">
                        <MessageSquare className="h-4 w-4" />
                        <span>Заметки к упражнению</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 animate-in fade-in-0 zoom-in-95">
                    <FormField
                        control={control}
                        name={`exercises.${exerciseIndex}.notes`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder="Например: 'Было тяжело, но техника хорошая'" {...field} value={field.value ?? ''} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export function TrainingDayCard({ entry, allEntries, onDelete, onCopy, onUpdate }: TrainingDayCardProps) {
    const StatusIcon = statusMap[entry.status].icon;
    const statusColor = statusMap[entry.status].color;
    const MoodIcon = entry.mood ? moodMap[entry.mood].icon : null;
    
    const form = useForm<TrainingLogEntry>({
        defaultValues: JSON.parse(JSON.stringify(entry)), // Deep copy to avoid mutation
    });
    
    const { fields } = useFieldArray({
        control: form.control,
        name: 'exercises',
    });

    const { personalRecords } = useMemo(() => {
        const pastEntries = allEntries.filter(
            e => e.id !== entry.id && e.status === 'completed' && new Date(e.date) < new Date()
        );
        return getTrainingAnalytics(pastEntries);
    }, [allEntries, entry.id]);

    const lastPerformances = useMemo(() => {
        const performanceMap = new Map<string, string>();

        entry.exercises.forEach(currentExercise => {
            const relevantPastEntries = allEntries
                .filter(e => e.id !== entry.id && e.status === 'completed' && new Date(e.date) < new Date())
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            for (const pastEntry of relevantPastEntries) {
                const pastExercise = pastEntry.exercises.find(ex => ex.name === currentExercise.name);
                if (pastExercise) {
                    let bestSet = { weight: 0, reps: 0 };
                    pastExercise.sets.forEach(set => {
                        if (set.isCompleted && set.loggedWeight && set.loggedReps) {
                           if ((set.loggedWeight * set.loggedReps) > (bestSet.weight * bestSet.reps)) {
                               bestSet = { weight: set.loggedWeight, reps: set.loggedReps };
                           }
                        }
                    });

                    if (bestSet.weight > 0) {
                        performanceMap.set(currentExercise.name, `${bestSet.reps}x${bestSet.weight} кг`);
                        return; // Found the most recent performance for this exercise, move to next exercise
                    }
                }
            }
        });
        return performanceMap;
    }, [entry, allEntries]);

    const onSubmit = (data: TrainingLogEntry) => {
        const updatedData = { ...data, status: 'completed' as const };
        onUpdate(updatedData);
    };

    return (
        <Card className={cn(
            "border-l-4 transition-all",
            entry.status === 'completed' && "border-green-500",
            entry.status === 'planned' && "border-blue-500",
            entry.status === 'skipped' && "border-red-500"
        )}>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <Collapsible>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CollapsibleTrigger asChild>
                         <div className="flex-1 flex items-start gap-4 cursor-pointer group">
                            <div>
                                <p className="text-sm text-muted-foreground">{entry.date}</p>
                                <CardTitle className="text-xl flex items-center gap-2 group-hover:text-primary transition-colors">
                                    {entry.workoutName} 
                                    <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </CardTitle>
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Редактировать</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onCopy(entry.id)}><Copy className="mr-2 h-4 w-4" /> Копировать</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(entry.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Удалить
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                
                <CollapsibleContent>
                    <CardContent className="pt-4 space-y-6">
                        {fields.map((field, index) => (
                           <ExerciseRow 
                                key={field.id}
                                control={form.control}
                                exerciseIndex={index}
                                exercise={entry.exercises[index]}
                                lastPerformance={lastPerformances.get(entry.exercises[index]?.name)}
                                personalRecords={personalRecords}
                           />
                        ))}
                        
                        <RestTimer />

                         <div className="mt-6 space-y-4">
                            <FormField control={form.control} name="notes" render={({ field }) => (
                                <FormItem><FormLabel>Заметки к тренировке</FormLabel><FormControl><Textarea placeholder={'Как прошла тренировка?'} {...field} value={field.value ?? ''} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name="mood" render={({ field }) => (
                                 <FormItem><FormLabel>Самочувствие</FormLabel><FormControl><div className="flex gap-2">{Object.entries(moodMap).map(([key, value]) => (<Button key={key} type="button" variant={field.value === key ? 'default' : 'outline'} size="icon" onClick={() => field.onChange(key)}><value.icon /></Button>))}</div></FormControl></FormItem>
                            )} />
                        </div>
                        {entry.status === 'planned' && (
                            <Button type="submit" className="w-full mt-6">Завершить тренировку</Button>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
            
            {(entry.notes || entry.coachNotes) && (
                <CollapsibleContent>
                    <Separator />
                    <CardContent className="text-sm pt-4 space-y-2">
                        {entry.notes && (
                            <div>
                                <p className="font-semibold">Ваши заметки:</p>
                                <p className="text-muted-foreground italic">&quot;{entry.notes}&quot;</p>
                            </div>
                        )}
                        {entry.coachNotes && (
                            <div className="p-3 bg-primary/10 rounded-md">
                                <p className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Комментарий тренера:</p>
                                <p className="text-muted-foreground italic">&quot;{entry.coachNotes}&quot;</p>
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            )}

            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground bg-muted/50 p-3">
                 <div className="flex items-center gap-2">
                    <StatusIcon className={cn("h-4 w-4", statusColor)} />
                    <span>{statusMap[entry.status].label}</span>
                </div>
                {entry.mood && moodMap[entry.mood] && MoodIcon && (
                    <div className="flex items-center gap-2">
                         <MoodIcon className={cn("h-4 w-4", moodMap[entry.mood].color)} />
                         <span>Самочувствие: {moodMap[entry.mood].label}</span>
                    </div>
                )}
            </CardFooter>
            </form>
            </Form>
        </Card>
    );
}
