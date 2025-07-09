"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Loader2 } from "lucide-react";

const issueSchema = z.object({
  category: z.string({ required_error: "Выберите категорию проблемы." }),
  comment: z
    .string()
    .min(10, "Пожалуйста, опишите проблему подробнее (минимум 10 символов)."),
});

export type FormValues = z.infer<typeof issueSchema>;

const issueCategories = [
  "Сломанное оборудование (кольцо, ворота)",
  "Поврежденное покрытие (трещины, ямы)",
  "Мусор или грязь",
  "Отсутствие освещения",
  "Другое",
];

interface ReportPlaygroundIssueDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  playgroundId: string;
  playgroundName: string;
  onReportSubmit: (data: FormValues) => Promise<void>;
}

export function ReportPlaygroundIssueDialog({
  isOpen,
  onOpenChange,
  playgroundName,
  onReportSubmit,
}: ReportPlaygroundIssueDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    await onReportSubmit(data);
    setIsSubmitting(false);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                Сообщить о проблеме на &quot;{playgroundName}&quot;
              </DialogTitle>
              <DialogDescription>
                Ваше сообщение поможет нам и другим игрокам. Спасибо за участие!
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория проблемы</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип проблемы" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issueCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
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
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Комментарий</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Опишите проблему подробнее..."
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
                Отправить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
