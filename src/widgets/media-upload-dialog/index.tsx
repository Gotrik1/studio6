'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { useToast } from '@/shared/hooks/use-toast';
import { Loader2, UploadCloud, PlusCircle } from 'lucide-react';
import Image from 'next/image';

type GalleryItem = {
    src: string;
    alt: string;
    dataAiHint: string;
};

interface MediaUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddMedia: (item: GalleryItem) => void;
}

export function MediaUploadDialog({ isOpen, onOpenChange, onAddMedia }: MediaUploadDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFile(null);
      setPreview(null);
    }
    onOpenChange(open);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Пожалуйста, выберите файл для загрузки.',
      });
      return;
    }

    setIsUploading(true);
    // Simulate API call to upload the file
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For the prototype, we'll just use a placeholder
    const newItem: GalleryItem = {
        src: 'https://placehold.co/600x400.png',
        alt: 'Новое медиа',
        dataAiHint: 'user uploaded',
    };

    onAddMedia(newItem);
    
    toast({
      title: 'Файл загружен!',
      description: `Ваше медиа было успешно добавлено в галерею.`,
    });

    setIsUploading(false);
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Загрузить медиа</DialogTitle>
          <DialogDescription>
            Добавьте новое фото или видео в свою галерею.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="media-upload">Файл</Label>
                <label htmlFor="media-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    {preview ? (
                        <Image src={preview} alt="Предпросмотр" width={400} height={225} className="h-full w-full object-contain p-2" />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">Нажмите, чтобы загрузить</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF (MAX. 800x400px)</p>
                        </div>
                    )}
                    <input id="media-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
                </label>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isUploading}>Отмена</Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Загрузка...' : <><PlusCircle className="mr-2 h-4 w-4" /> Добавить в галерею</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
