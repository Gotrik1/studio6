'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { generateUserAvatar } from '@/ai/flows/generate-user-avatar-flow';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface UserAvatarGeneratorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAvatarSave: (imageDataUri: string) => void;
  currentAvatar: string;
}

export function UserAvatarGeneratorDialog({ isOpen, onOpenChange, onAvatarSave, currentAvatar }: UserAvatarGeneratorDialogProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('a heroic esports player with a determined look, digital art');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a description for the avatar.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedAvatar(null);

    try {
      const result = await generateUserAvatar({ prompt });
      setGeneratedAvatar(result.avatarDataUri);
    } catch (e) {
      console.error(e);
      setError("Failed to generate avatar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (generatedAvatar) {
      onAvatarSave(generatedAvatar);
      onOpenChange(false);
      toast({
        title: 'Аватар обновлен!',
        description: 'Ваш новый AI-аватар был сохранен.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Сгенерировать AI-аватар</DialogTitle>
          <DialogDescription>
            Опишите аватар, который вы хотите создать. Будьте креативны!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatar-prompt">Описание</Label>
            <Input
              id="avatar-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="например, футуристический рыцарь со светящимся визором"
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

          <div className="flex justify-center items-center h-48 bg-muted rounded-md overflow-hidden">
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleSave} disabled={!generatedAvatar}>Сохранить аватар</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
