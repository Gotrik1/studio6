
'use client';

import { useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { generateProfileBanner } from '@/shared/api/genkit/flows/generate-profile-banner-flow';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import Image from 'next/image';
import { useToast } from '@/shared/hooks/use-toast';
import { Loader } from '@/shared/ui/loader';

interface ProfileBannerGeneratorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onBannerSave: (imageDataUri: string) => void;
  currentBanner: string;
  defaultPrompt: string;
}

export function ProfileBannerGeneratorDialog({ isOpen, onOpenChange, onBannerSave, currentBanner, defaultPrompt }: ProfileBannerGeneratorDialogProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedBanner, setGeneratedBanner] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a description for the banner.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedBanner(null);

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

  const handleSave = () => {
    if (generatedBanner) {
      onBannerSave(generatedBanner);
      onOpenChange(false);
      toast({
        title: 'Фон обновлен!',
        description: 'Ваш новый фон профиля был успешно сохранен.',
      });
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (open) {
        setPrompt(defaultPrompt);
        setGeneratedBanner(null);
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Сгенерировать фон профиля</DialogTitle>
          <DialogDescription>
            Опишите фон, который вы хотите создать.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
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
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
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
                alt="Profile Banner"
                layout="fill"
                className="object-cover"
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleSave} disabled={!generatedBanner}>Сохранить фон</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
