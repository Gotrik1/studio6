"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Calendar } from "@/shared/ui/calendar";
import { cn } from "@/shared/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { TournamentDetails } from "@/entities/tournament/model/types";
import { updateTournament } from "@/entities/tournament/api/tournaments";
import { useRouter } from "next/navigation";
import { getSports, type Sport } from "@/entities/sport/api/sports";

const tournamentSchema = z
  .object({
    name: z.string().min(5, "Название должно быть не менее 5 символов."),
    game: z.string({ required_error: "Выберите вид спорта." }),
    participantCount: z.coerce
      .number()
      .min(4, "Минимум 4 участника.")
      .max(128, "Максимум 128 участников."),
    registrationStartDate: z.date({ required_error: "Выберите дату." }),
    registrationEndDate: z.date({ required_error: "Выберите дату." }),
    tournamentStartDate: z.date({ required_error: "Выберите дату." }),
  })
  .refine(
    (data) => {
      if (data.registrationStartDate && data.registrationEndDate) {
        return data.registrationEndDate > data.registrationStartDate;
      }
      return true;
    },
    {
      message: "Конец регистрации должен быть после начала.",
      path: ["registrationEndDate"],
    },
  )
  .refine(
    (data) => {
      if (data.registrationEndDate && data.tournamentStartDate) {
        return data.tournamentStartDate > data.registrationEndDate;
      }
      return true;
    },
    {
      message: "Начало турнира должно быть после конца регистрации.",
      path: ["tournamentStartDate"],
    },
  );

type FormValues = z.infer<typeof tournamentSchema>;

interface CrmTournamentSettingsProps {
  tournament: TournamentDetails;
}

export function CrmTournamentSettings({
  tournament,
}: CrmTournamentSettingsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);

  useEffect(() => {
    getSports().then(setSports);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: tournament.name,
      game: tournament.game,
      participantCount: tournament.participantCount,
      registrationStartDate: new Date(tournament.registrationStartDate),
      registrationEndDate: new Date(tournament.registrationEndDate),
      tournamentStartDate: new Date(tournament.tournamentStartDate),
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const result = await updateTournament(tournament.id, data);

    if (result.success) {
      toast({
        title: "Настройки сохранены!",
        description: `Данные турнира "${data.name}" были успешно обновлены.`,
      });
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось сохранить изменения.",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Настройки турнира</CardTitle>
            <CardDescription>
              Редактирование основной информации о событии.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название турнира</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="game"
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="registrationStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Начало регистрации</FormLabel>
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
                name="registrationEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Конец регистрации</FormLabel>
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
                name="tournamentStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Начало турнира</FormLabel>
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
            </div>
            <FormField
              control={form.control}
              name="participantCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Макс. количество участников/команд</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Сохранить изменения
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
