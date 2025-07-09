"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
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
import { useToast } from "@/shared/hooks/use-toast";
import type { Measurement } from "@/entities/user/model/types";
import { Loader2, CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";
import { Calendar } from "@/shared/ui/calendar";
import { cn } from "@/shared/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { FetchResult } from "@/shared/lib/api-client";

const measurementSchema = z.object({
  date: z.date({ required_error: "Выберите дату." }),
  weight: z.coerce
    .number()
    .min(30, "Слишком низкий вес")
    .max(300, "Слишком большой вес"),
  bodyFat: z.coerce
    .number()
    .min(1, "Неверное значение")
    .max(70, "Неверное значение")
    .optional()
    .or(z.literal("")),
  chest: z.coerce.number().min(30).max(200).optional().or(z.literal("")),
  waist: z.coerce.number().min(30).max(200).optional().or(z.literal("")),
  hips: z.coerce.number().min(30).max(200).optional().or(z.literal("")),
  biceps: z.coerce.number().min(10).max(100).optional().or(z.literal("")),
  thigh: z.coerce.number().min(20).max(150).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof measurementSchema>;

interface LogMeasurementDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLog: (data: Omit<Measurement, "id">) => Promise<FetchResult<Measurement>>;
  latestMeasurement?: Measurement;
}

export function LogMeasurementDialog({
  isOpen,
  onOpenChange,
  onLog,
  latestMeasurement,
}: LogMeasurementDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        date: new Date(),
        weight: latestMeasurement?.weight || undefined,
        bodyFat: latestMeasurement?.bodyFat || "",
        chest: latestMeasurement?.chest || "",
        waist: latestMeasurement?.waist || "",
        hips: latestMeasurement?.hips || "",
        biceps: latestMeasurement?.biceps || "",
        thigh: latestMeasurement?.thigh || "",
      });
    }
  }, [isOpen, latestMeasurement, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const payload = {
      date: data.date.toISOString(),
      weight: data.weight,
      bodyFat: data.bodyFat ? Number(data.bodyFat) : undefined,
      chest: data.chest ? Number(data.chest) : undefined,
      waist: data.waist ? Number(data.waist) : undefined,
      hips: data.hips ? Number(data.hips) : undefined,
      biceps: data.biceps ? Number(data.biceps) : undefined,
      thigh: data.thigh ? Number(data.thigh) : undefined,
    };
    const result = await onLog(payload);

    if (result.success) {
      toast({
        title: "Замеры сохранены!",
        description: "Ваш прогресс был успешно записан.",
      });
      onOpenChange(false);
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось сохранить замеры.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Новые замеры</DialogTitle>
          <DialogDescription>
            Запишите текущие показатели. Заполните только те поля, которые
            хотите отслеживать.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дата замера</FormLabel>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                          }
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
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Вес (кг)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bodyFat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Жир (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chest"
                render={({ field }) => (
                  <FormItem>
                    <Label>Грудь (см)</Label>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
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
                name="waist"
                render={({ field }) => (
                  <FormItem>
                    <Label>Талия (см)</Label>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
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
                name="hips"
                render={({ field }) => (
                  <FormItem>
                    <Label>Бедра (см)</Label>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
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
                name="biceps"
                render={({ field }) => (
                  <FormItem>
                    <Label>Бицепс (см)</Label>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
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
                name="thigh"
                render={({ field }) => (
                  <FormItem>
                    <Label>Бедро (см)</Label>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
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
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
