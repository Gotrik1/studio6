"use client";

import { useState, useEffect } from "react";
import {
  useForm,
  useFieldArray,
  type Control,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Loader2, PlusCircle, Trash2, GripVertical, Link2 } from "lucide-react";
import type { Exercise } from "@/entities/exercise/model/types";
import { getExercises } from "@/entities/exercise/api/get-exercises";
import { ExercisePickerDialog } from "@/widgets/exercise-picker-dialog";
import type { TrainingProgram } from "@/entities/training-program/model/types";
import { Textarea } from "@/shared/ui/textarea";
import { Checkbox } from "@/shared/ui/checkbox";
import Link from "next/link";

const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  sets: z.string().min(1, "Обязательно"),
  reps: z.string().min(1, "Обязательно"),
  plannedWeight: z.string().optional(),
  isSupersetWithPrevious: z.boolean().optional(),
  technique: z.string().optional(),
});

const workoutDaySchema = z.object({
  title: z.string().min(3, "Название дня обязательно"),
  exercises: z.array(exerciseSchema).min(1, "Добавьте хотя бы одно упражнение"),
});

const programSchema = z.object({
  name: z.string().min(3, "Название программы обязательно"),
  description: z.string().optional(),
  goal: z.enum(["Набор массы", "Снижение веса", "Рельеф", "Сила"]),
  splitType: z.enum(["Full-body", "Split", "Upper/Lower"]),
  days: z
    .array(workoutDaySchema)
    .min(1, "Добавьте хотя бы один тренировочный день"),
});

export type ProgramFormValues = z.infer<typeof programSchema>;

interface TrainingProgramFormProps {
  initialData?: TrainingProgram;
  onSubmit: (data: ProgramFormValues) => Promise<void>;
  isSaving: boolean;
}

interface DaySectionProps {
  dayIndex: number;
  control: Control<ProgramFormValues>;
  removeDay: (index: number) => void;
  openExercisePicker: (dayIndex: number) => void;
}

const DaySection = ({
  dayIndex,
  control,
  removeDay,
  openExercisePicker,
}: DaySectionProps) => {
  const { formState } = useFormContext<ProgramFormValues>();
  const { fields, remove } = useFieldArray({
    control,
    name: `days.${dayIndex}.exercises`,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex-1">
          <FormField
            control={control}
            name={`days.${dayIndex}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Название дня</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Название дня, например 'День 1: Грудь'"
                    {...field}
                    className="text-lg font-semibold border-0 p-0 shadow-none focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeDay(dayIndex)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto_auto] items-center gap-2 py-2 text-xs text-muted-foreground border-b">
          <div className="w-5" />
          <div className="font-medium">Упражнение</div>
          <div className="w-20 text-center">Подходы</div>
          <div className="w-20 text-center">Повторения</div>
          <div className="w-20 text-center">Вес (план)</div>
          <div className="w-24 text-center">Техника</div>
          <div className="w-28 text-center">Суперсет</div>
          <div className="w-9" />
        </div>
        {fields.map((exField, exIndex) => (
          <div key={exField.id} className="border-b last:border-b-0 py-2">
            <div className="grid grid-cols-[auto_1fr_auto_auto] sm:hidden gap-2">
              <div className="col-span-full flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                <span className="font-medium">{exField.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => remove(exIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <FormField
                control={control}
                name={`days.${dayIndex}.exercises.${exIndex}.sets`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Подходы</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="3-4"
                        {...field}
                        className="w-full text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`days.${dayIndex}.exercises.${exIndex}.reps`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Повторы</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="8-12"
                        {...field}
                        className="w-full text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`days.${dayIndex}.exercises.${exIndex}.plannedWeight`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Вес</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="100кг"
                        {...field}
                        value={field.value ?? ""}
                        className="w-full text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`days.${dayIndex}.exercises.${exIndex}.technique`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Техника</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Дроп-сет"
                        {...field}
                        value={field.value ?? ""}
                        className="w-full text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {exIndex > 0 && (
                <FormField
                  control={control}
                  name={`days.${dayIndex}.exercises.${exIndex}.isSupersetWithPrevious`}
                  render={({ field }) => (
                    <FormItem className="col-span-full flex items-center space-x-2 pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 text-sm flex items-center gap-1">
                        <Link2 className="h-4 w-4" />
                        Суперсет с предыдущим
                      </FormLabel>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto_auto] items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <Link
                href={`/training/exercises/${exField.id}`}
                className="font-medium hover:underline"
              >
                {exField.name}
              </Link>
              <FormField
                control={control}
                name={`days.${dayIndex}.exercises.${exIndex}.sets`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="3-4"
                        {...field}
                        className="w-20 text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`days.${dayIndex}.exercises.${exIndex}.reps`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="8-12"
                        {...field}
                        className="w-20 text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`days.${dayIndex}.exercises.${exIndex}.plannedWeight`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="100кг"
                        {...field}
                        value={field.value ?? ""}
                        className="w-20 text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`days.${dayIndex}.exercises.${exIndex}.technique`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Дроп-сет"
                        {...field}
                        value={field.value ?? ""}
                        className="w-24 text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-28 flex items-center justify-center">
                {exIndex > 0 && (
                  <FormField
                    control={control}
                    name={`days.${dayIndex}.exercises.${exIndex}.isSupersetWithPrevious`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 text-xs text-muted-foreground flex items-center gap-1">
                          <Link2 className="h-3 w-3" />
                          Суперсет
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(exIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full"
          onClick={() => openExercisePicker(dayIndex)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Добавить упражнение
        </Button>
        <FormMessage>
          {
            (
              formState.errors.days?.[dayIndex]?.exercises as {
                message: string;
              }
            )?.message
          }
        </FormMessage>
      </CardContent>
    </Card>
  );
};

export function TrainingProgramForm({
  initialData,
  onSubmit,
  isSaving,
}: TrainingProgramFormProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const isEditMode = !!initialData;

  useEffect(() => {
    getExercises().then(setAllExercises);
  }, []);

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: isEditMode
      ? {
          name: initialData.name,
          description: initialData.description,
          goal: initialData.goal,
          splitType: initialData.splitType,
          days: initialData.weeklySplit.map((day) => ({
            title: day.title,
            exercises: day.exercises.map((ex) => {
              const fullExercise = allExercises.find((e) => e.name === ex.name);
              return {
                id: fullExercise?.id || `temp-${Math.random()}`,
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                plannedWeight: ex.plannedWeight,
                isSupersetWithPrevious: ex.isSupersetWithPrevious || false,
                technique: ex.technique || "",
              };
            }),
          })),
        }
      : {
          name: "",
          description: "",
          goal: "Набор массы",
          splitType: "Split",
          days: [{ title: "День 1: Грудь и Трицепс", exercises: [] }],
        },
  });

  useEffect(() => {
    if (isEditMode && initialData && allExercises.length > 0) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        goal: initialData.goal,
        splitType: initialData.splitType,
        days: initialData.weeklySplit.map((day) => ({
          title: day.title,
          exercises: day.exercises.map((ex) => {
            const fullExercise = allExercises.find((e) => e.name === ex.name);
            return {
              id: fullExercise?.id || `temp-${Math.random()}`,
              ...ex,
            };
          }),
        })),
      });
    }
  }, [isEditMode, initialData, allExercises, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "days",
  });

  const openExercisePicker = (dayIndex: number) => {
    setCurrentDayIndex(dayIndex);
    setIsPickerOpen(true);
  };

  const handleSelectExercises = (exercises: Exercise[]) => {
    if (currentDayIndex === null) return;
    const dayExercises =
      form.getValues(`days.${currentDayIndex}.exercises`) || [];
    const newExercises = exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      sets: "3-4",
      reps: "8-12",
      plannedWeight: "",
      isSupersetWithPrevious: false,
      technique: "",
    }));
    form.setValue(`days.${currentDayIndex}.exercises`, [
      ...dayExercises,
      ...newExercises,
    ]);
  };

  const handleAddDay = () => {
    const newDay: ProgramFormValues["days"][number] = {
      title: `День ${fields.length + 1}`,
      exercises: [],
    };
    append(newDay);
  };

  return (
    <>
      <div className="space-y-6 opacity-0 animate-fade-in-up">
        <div className="space-y-2 text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            {isEditMode ? "Редактирование программы" : "Конструктор программ"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isEditMode
              ? "Внесите необходимые изменения в вашу программу тренировок."
              : "Создайте свою идеальную программу тренировок с нуля."}
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Общая информация</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название программы</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Например, Моя программа на массу"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание (необязательно)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Краткое описание целей и методики"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цель</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Набор массы">Набор массы</SelectItem>
                        <SelectItem value="Снижение веса">
                          Снижение веса
                        </SelectItem>
                        <SelectItem value="Рельеф">Рельеф</SelectItem>
                        <SelectItem value="Сила">Сила</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="splitType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип сплита</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Split">Сплит</SelectItem>
                        <SelectItem value="Upper/Lower">Верх/Низ</SelectItem>
                        <SelectItem value="Full-body">Full-body</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {fields.map((field, index) => (
            <DaySection
              key={field.id}
              dayIndex={index}
              control={form.control}
              removeDay={remove}
              openExercisePicker={openExercisePicker}
            />
          ))}

          <CardFooter className="flex-col sm:flex-row justify-between gap-4 p-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleAddDay}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Добавить день
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Сохранить изменения" : "Создать программу"}
            </Button>
          </CardFooter>
        </form>
      </Form>

      <ExercisePickerDialog
        isOpen={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        onSelectExercises={handleSelectExercises}
        allExercises={allExercises}
      />
    </>
  );
}
