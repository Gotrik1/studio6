'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useToast } from '@/shared/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { summerKickoffTournament } from '@/shared/lib/mock-data/tournament-details';

type Match = (typeof summerKickoffTournament.bracket.rounds)[0]['matches'][0];

interface CrmScoreDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  match: Match | null;
  onScoreSubmit: (matchId: number, scoreA: number, scoreB: number) => void;
}

export function CrmScoreDialog({ isOpen, onOpenChange, match, onScoreSubmit }: CrmScoreDialogProps) {
  const { toast } = useToast();
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (match?.score) {
        const scores = match.score.split('-').map(s => s.trim());
        setScoreA(scores[0] || '');
        setScoreB(scores[1] || '');
    } else {
        setScoreA('');
        setScoreB('');
    }
  }, [match]);

  if (!match) return null;

  const handleSubmit = async () => {
    const numScoreA = parseInt(scoreA);
    const numScoreB = parseInt(scoreB);
    if (isNaN(numScoreA) || isNaN(numScoreB)) {
        toast({ variant: 'destructive', title: 'Ошибка', description: 'Пожалуйста, введите корректный счет.' });
        return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    onScoreSubmit(match.id, numScoreA, numScoreB);
    onOpenChange(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ввести результат матча</DialogTitle>
          <DialogDescription>
            {match.team1?.name} vs {match.team2?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-2 gap-4 items-center">
            <div>
                <Label htmlFor="scoreA" className="text-center block mb-2">{match.team1?.name}</Label>
                <Input id="scoreA" type="number" value={scoreA} onChange={(e) => setScoreA(e.target.value)} className="text-center text-lg font-bold" />
            </div>
             <div>
                <Label htmlFor="scoreB" className="text-center block mb-2">{match.team2?.name}</Label>
                <Input id="scoreB" type="number" value={scoreB} onChange={(e) => setScoreB(e.target.value)} className="text-center text-lg font-bold" />
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Сохранить результат
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
