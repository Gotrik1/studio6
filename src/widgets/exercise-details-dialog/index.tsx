'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Badge } from '@/shared/ui/badge';
import Image from 'next/image';
import type { Exercise } from '@/shared/lib/mock-data/exercises';
import { useToast } from '@/shared/hooks/use-toast';
import { PlusCircle, AlertTriangle, CheckCircle, Video } from 'lucide-react';
import { Separator } from '@/shared/ui/separator';

interface ExerciseDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  exercise: Exercise | null;
}

export function ExerciseDetailsDialog({ isOpen, onOpenChange, exercise }: ExerciseDetailsDialogProps) {
  const { toast } = useToast();

  if (!exercise) return null;

  const handleAddToWorkout = () => {
    toast({
        title: "Упражнение добавлено",
        description: `${exercise.name} добавлено в вашу текущую тренировку.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{exercise.name}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{exercise.muscleGroup}</Badge>
                <Badge variant="outline">{exercise.equipment}</Badge>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto pr-4">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <Image 
                src={exercise.image} 
                alt={exercise.name} 
                fill 
                className="object-cover"
                data-ai-hint={exercise.imageHint}
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Video className="h-12 w-12 text-white/70" />
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{exercise.description}</p>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Техника выполнения</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {exercise.techniqueTips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-500" /> Частые ошибки</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {exercise.commonMistakes.map((mistake, i) => <li key={i}>{mistake}</li>)}
                </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Альтернативы</h4>
            <div className="flex flex-wrap gap-2">
                {exercise.alternatives.map((alt, i) => <Badge key={i} variant="outline">{alt}</Badge>)}
            </div>
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Закрыть</Button>
          <Button onClick={handleAddToWorkout}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить в тренировку
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
