'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Checkbox } from '@/shared/ui/checkbox';
import { CheckCircle2, XCircle, Clock, MoreVertical, Edit, Copy, Trash2, Smile, Meh, Frown, MessageSquare, ChevronDown } from 'lucide-react';
import type { TrainingLogEntry } from '@/shared/lib/mock-data/training-log';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/shared/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { Separator } from '@/shared/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import { useForm, useFieldArray } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { RestTimer } from '@/widgets/rest-timer';

interface TrainingDayCardProps {
    entry: TrainingLogEntry;
    onDelete: (id: string) => void;
    onCopy: (id: string) => void;
    onUpdate: (data: TrainingLogEntry) => void;
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

export function TrainingDayCard({ entry, onDelete, onCopy, onUpdate }: TrainingDayCardProps) {
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
                                <CardDescription>{format(new Date(entry.date), 'EEEE, d MMMM yyyy', { locale: ru })}</CardDescription>
                                <CardTitle className="text-xl flex items-center gap-2 group-hover:text-primary transition-colors">
                                    {entry.workoutName} 
                                    <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
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
                        {fields.map((field, index) => {
                            const { fields: setFields } = useFieldArray({
                                control: form.control,
                                name: `exercises.${index}.sets`,
                            });
                            return (
                                <div key={field.id} className="mb-4">
                                    <h4 className="font-semibold">{entry.exercises[index]?.name}</h4>
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
                                            {setFields.map((setField, setIndex) => (
                                                <TableRow key={setField.id}>
                                                    <TableCell className="font-medium text-center">{setIndex + 1}</TableCell>
                                                    <TableCell className="text-muted-foreground">{entry.exercises[index]?.sets[setIndex]?.plannedReps} x {entry.exercises[index]?.sets[setIndex]?.plannedWeight}</TableCell>
                                                    <TableCell>
                                                         <FormField control={form.control} name={`exercises.${index}.sets.${setIndex}.loggedReps`} render={({ field }) => (
                                                            <FormItem><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} value={field.value ?? ''} className="w-20" placeholder={entry.exercises[index]?.sets[setIndex]?.plannedReps} /></FormControl></FormItem>
                                                        )} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FormField control={form.control} name={`exercises.${index}.sets.${setIndex}.loggedWeight`} render={({ field }) => (
                                                            <FormItem><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} value={field.value ?? ''} className="w-20" placeholder={entry.exercises[index]?.sets[setIndex]?.plannedWeight.replace('кг','').trim()} /></FormControl></FormItem>
                                                        )} />
                                                    </TableCell>
                                                     <TableCell>
                                                        <FormField control={form.control} name={`exercises.${index}.sets.${setIndex}.rpe`} render={({ field }) => (
                                                            <FormItem><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} value={field.value ?? ''} className="w-16 text-center" placeholder="-" min="1" max="10" /></FormControl></FormItem>
                                                        )} />
                                                    </TableCell>
                                                     <TableCell className="text-center">
                                                        <FormField control={form.control} name={`exercises.${index}.sets.${setIndex}.isCompleted`} render={({ field }) => (
                                                            <FormItem><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                                        )} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )
                        })}
                        
                        <RestTimer />

                         <div className="mt-6 space-y-4">
                            <FormField control={form.control} name="notes" render={({ field }) => (
                                <FormItem><FormLabel>Заметки к тренировке</FormLabel><FormControl><Textarea placeholder="Как прошла тренировка?" {...field} value={field.value ?? ''} /></FormControl></FormItem>
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
