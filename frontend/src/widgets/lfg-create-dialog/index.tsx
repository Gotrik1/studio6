"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Calendar } from "@/shared/ui/calendar";
import { cn } from "@/shared/lib/utils";
import { CalendarIcon, Loader2, Swords, Dumbbell } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { getSports, type Sport } from "@/entities/sport/api/sports";

const lfgSchema = z.object({
  type: z.enum(["GAME", "TRAINING"], {
    required_error: "Выберите тип активности.",
  }),
  sport: z.string({ required_error: "Выберите дисциплину." }),
  location: z.string().min(5, "Укажите более точное местоположение."),
  playgroundId: z.string().optional(),
  date: z.date({ required_error: "Выберите дату." }),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Введите время в формате HH:MM."),
  duration: z.coerce
    .number()
    .min(30, "Минимальная длительность 30 минут")
    .max(240, "Максимальная длительность 4 часа"),
  playersNeeded: z.coerce
    .number()
    .min(2, "Нужно как минимум 2 игрока.")
    .max(22, "Слишком много игроков."),
  comment: z
    .string()
    .min(10, "Добавьте комментарий, чтобы игрокам было понятнее.")
    .max(200, "Комментарий слишком длинный."),
});

export type FormValues = z.infer<typeof lfgSchema>;

interface LfgCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreate: (data: FormValues) => Promise<boolean>;
}

export function LfgCreateDialog({
  isOpen,
  onOpenChange,
  onCreate,
}: LfgCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);

  useEffect(() => {
    if (isOpen) {
      getSports().then(setSports);
    }
  }, [isOpen]);

  const form = useForm<FormValues>({
    resolver: zodResolver(lfgSchema),
    defaultValues: {
      type: "GAME",
      duration: 60,
      playersNeeded: 4,
      date: new Date(),
      time: "19:00",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const success = await onCreate(data);
    if (success) {
      onOpenChange(false);
      form.reset({
        type: "GAME",
        duration: 60,
        playersNeeded: 4,
        date: new Date(),
        time: "19:00",
        comment: "",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Создать лобби</DialogTitle>
              <DialogDescription>
                Заполните детали, чтобы другие игроки могли присоединиться к
                вам.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Тип активности</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="GAME"
                              id="type-game"
                              className="peer sr-only"
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor="type-game"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <Swords className="mb-3 h-6 w-6" />
                            Игра
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="TRAINING"
                              id="type-training"
                              className="peer sr-only"
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor="type-training"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <Dumbbell className="mb-3 h-6 w-6" />
                            Тренировка
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Вид спорта</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите дисциплину" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sports.map((sport) => (
                            <SelectItem key={sport.id} value={sport.name}>
                              {sport.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="playersNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сколько игроков нужно?</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Место</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Например, Парк Горького, площадка #2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Дата</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ru })
                              ) : (
                                <span>Выберите дату</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Время</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Длительность (мин)</FormLabel>
                    <FormControl>
                      <Input type="number" step="15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Комментарий</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Опишите детали игры: уровень игроков, цель (тренировка/развлечение) и т.д."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Создать лобби
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
