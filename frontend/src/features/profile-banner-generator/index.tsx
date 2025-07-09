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
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Loader2, Sparkles, AlertCircle, UploadCloud } from "lucide-react";
import { generateProfileBanner } from "@/shared/api/genkit/flows/generate-profile-banner-flow";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import Image from "next/image";
import { useToast } from "@/shared/hooks/use-toast";
import { Loader } from "@/shared/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

interface ProfileBannerGeneratorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onBannerSave: (imageDataUri: string) => void;
  currentBanner: string;
  defaultPrompt: string;
}

export function ProfileBannerGeneratorDialog({
  isOpen,
  onOpenChange,
  onBannerSave,
  currentBanner,
  defaultPrompt,
}: ProfileBannerGeneratorDialogProps) {
  const { toast } = useToast();

  // AI Generator state
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedBanner, setGeneratedBanner] = useState<string | null>(null);

  // Upload state
  const [preview, setPreview] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a description for the banner.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedBanner(null);
    setPreview(null);

    try {
      const result = await generateProfileBanner({ prompt });
      setGeneratedBanner(result.imageDataUri);
    } catch (e) {
      console.error(e);
      setError("Failed to generate banner. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setGeneratedBanner(null); // Clear generated banner if user uploads
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = () => {
    let newBanner: string | null = null;

    if (generatedBanner) {
      newBanner = generatedBanner;
    } else if (preview) {
      newBanner = preview;
    }

    if (newBanner) {
      onBannerSave(newBanner);
      onOpenChange(false);
      toast({
        title: "Фон обновлен!",
        description: "Ваш новый фон профиля был успешно сохранен.",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state on close
      setGeneratedBanner(null);
      setError(null);
      setPreview(null);
    } else {
      setPrompt(defaultPrompt);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Изменить фон профиля</DialogTitle>
          <DialogDescription>
            Сгенерируйте новый фон с помощью AI или загрузите свое изображение.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai">AI-генератор</TabsTrigger>
            <TabsTrigger value="upload">Загрузить фон</TabsTrigger>
          </TabsList>
          <TabsContent value="ai" className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banner-prompt">Описание темы</Label>
              <Input
                id="banner-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="например, фон в стиле футбол"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Сгенерировать
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center items-center h-48 bg-muted rounded-md overflow-hidden relative">
              {isLoading ? (
                <Loader size={100} />
              ) : (
                <Image
                  src={generatedBanner || currentBanner}
                  alt="Profile Banner Preview"
                  layout="fill"
                  className="object-cover"
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="upload" className="py-4 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="banner-upload"
                className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="Предпросмотр"
                    layout="fill"
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      Нажмите, чтобы загрузить
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF (16:9)
                    </p>
                  </div>
                )}
                <input
                  id="banner-upload"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!generatedBanner && !preview}>
            Сохранить фон
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
