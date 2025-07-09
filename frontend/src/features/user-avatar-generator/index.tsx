"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Loader2, Sparkles, AlertCircle, UploadCloud } from "lucide-react";
import { generateUserAvatar } from "@/shared/api/genkit/flows/generate-user-avatar-flow";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import Image from "next/image";
import { useToast } from "@/shared/hooks/use-toast";
import { Loader } from "@/shared/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

interface UserAvatarGeneratorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAvatarSave: (imageDataUri: string) => void;
  currentAvatar: string;
}

export function UserAvatarGeneratorDialog({
  isOpen,
  onOpenChange,
  onAvatarSave,
  currentAvatar,
}: UserAvatarGeneratorDialogProps) {
  const { toast } = useToast();

  // AI Generator state
  const [prompt, setPrompt] = useState(
    "a heroic esports player with a determined look, digital art",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);

  // Upload state
  const [preview, setPreview] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setGenerationError("Please enter a description for the avatar.");
      return;
    }
    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedAvatar(null);
    setPreview(null);

    try {
      const result = await generateUserAvatar({ prompt });
      setGeneratedAvatar(result.avatarDataUri);
    } catch (e) {
      console.error(e);
      setGenerationError("Failed to generate avatar. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setGeneratedAvatar(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = () => {
    let newAvatar: string | null = null;

    if (generatedAvatar) {
      newAvatar = generatedAvatar;
    } else if (preview) {
      newAvatar = preview;
    }

    if (newAvatar) {
      onAvatarSave(newAvatar);
      onOpenChange(false);
      toast({
        title: "Аватар обновлен!",
        description: "Ваш новый аватар был успешно сохранен.",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state on close
      setGeneratedAvatar(null);
      setGenerationError(null);
      setPreview(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Изменить аватар</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai">AI-генератор</TabsTrigger>
            <TabsTrigger value="upload">Загрузить фото</TabsTrigger>
          </TabsList>
          <TabsContent value="ai" className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatar-prompt">Описание</Label>
              <Input
                id="avatar-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="например, футуристический рыцарь"
                disabled={isGenerating}
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Сгенерировать
            </Button>

            {generationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{generationError}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center items-center h-48 bg-muted rounded-md overflow-hidden">
              {isGenerating ? (
                <Loader size={80} />
              ) : (
                <Image
                  src={generatedAvatar || currentAvatar}
                  alt="User Avatar"
                  width={192}
                  height={192}
                  className="object-cover"
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="upload" className="py-4 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="avatar-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="Предпросмотр"
                    width={256}
                    height={256}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      Нажмите, чтобы загрузить
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF
                    </p>
                  </div>
                )}
                <input
                  id="avatar-upload"
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
          <Button onClick={handleSave} disabled={!generatedAvatar && !preview}>
            Сохранить аватар
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
