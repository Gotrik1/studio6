"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { Loader2, CheckCircle, Upload } from "lucide-react";
import Image from "next/image";
import * as React from "react";

interface PlaygroundCheckInDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCheckIn: (comment: string, photo?: string) => void;
  playgroundName: string;
}

export function PlaygroundCheckInDialog({
  isOpen,
  onOpenChange,
  onCheckIn,
  playgroundName,
}: PlaygroundCheckInDialogProps) {
  const [comment, setComment] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onCheckIn(comment, preview || undefined);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setComment("");
      setPreview(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отметка на площадке</DialogTitle>
          <DialogDescription>
            Подтвердите свое присутствие на &quot;{playgroundName}&quot;. За
            каждую отметку вы получите 10 PD! Вы можете оставить комментарий или
            прикрепить фото.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий (необязательно)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Как обстановка на площадке?"
            />
          </div>
          <div className="space-y-2">
            <Label>Фото (необязательно)</Label>
            <label
              htmlFor="checkin-photo"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Предпросмотр"
                  width={128}
                  height={128}
                  className="h-full w-auto object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Загрузить фото
                  </p>
                </div>
              )}
              <input
                id="checkin-photo"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Подтвердить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
