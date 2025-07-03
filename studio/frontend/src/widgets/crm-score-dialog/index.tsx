

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
import type { summerKickoffTournament } from '@/shared/lib/mock-data/tournament-details';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Textarea } from '@/shared/ui/textarea';
import { Separator } from '@/shared/ui/separator';

type MatchUnion = (typeof summerKickoffTournament.bracket.rounds)[0]['matches'][0];
type Match = Extract<MatchUnion, { team2: unknown }>;

export type MatchResult = {
    matchId: number;
    type: 'score' | 'technical_defeat_t1' | 'technical_defeat_t2';
    scoreA: number;
    scoreB: number;
    comment: string;
};

interface CrmMatchResultDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  match: Match | null;
  onMatchUpdate: (result: MatchResult) => void;
}

export function CrmMatchResultDialog({ isOpen, onOpenChange, match, onMatchUpdate }: CrmMatchResultDialogProps) {
  const { toast } = useToast();
  const [resultType, setResultType] = useState<'score' | 'technical_defeat'>('score');
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [techDefeatTeam, setTechDefeatTeam] = useState<string | undefined>(undefined);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && match?.score && match.score !== 'VS') {
        const scores = match.score.split('-').map((s: string) => s.trim());
        setScoreA(scores[0] || '');
        setScoreB(scores[1] || '');
    } else {
        setScoreA('');
        setScoreB('');
    }
    setResultType('score');
    setTechDefeatTeam(undefined);
    setComment('');
  }, [isOpen, match]);

  if (!match) return null;

  const handleSubmit = async () => {
    if (!match) return;
    setIsSubmitting(true);
    
    let result: MatchResult;

    if (resultType === 'score') {
        const numScoreA = parseInt(scoreA);
        const numScoreB = parseInt(scoreB);
        if (isNaN(numScoreA) || isNaN(numScoreB)) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Пожалуйста, введите корректный счет.' });
            setIsSubmitting(false);
            return;
        }
        result = { matchId: match.id, type: 'score', scoreA: numScoreA, scoreB: numScoreB, comment };
    } else {
        if (!techDefeatTeam) {
             toast({ variant: 'destructive', title: 'Ошибка', description: 'Выберите команду для технического поражения.' });
             setIsSubmitting(false);
             return;
        }
        result = {
            matchId: match.id,
            type: techDefeatTeam === 'team1' ? 'technical_defeat_t2' : 'technical_defeat_t1',
            scoreA: techDefeatTeam === 'team1' ? 0 : 1, // simplified win/loss
            scoreB: techDefeatTeam === 'team1' ? 1 : 0,
            comment,
        };
    }
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onMatchUpdate(result);
    onOpenChange(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Управление результатом матча</DialogTitle>
          <DialogDescription>
            {match.team1?.name} vs {match.team2?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <RadioGroup defaultValue="score" value={resultType} onValueChange={(value) => setResultType(value as 'score' | 'technical_defeat')} className="grid grid-cols-2 gap-4">
                 <div>
                    <RadioGroupItem value="score" id="r-score" className="peer sr-only" />
                    <Label htmlFor="r-score" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Ввести счет
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="tech_defeat" id="r-tech" className="peer sr-only" />
                    <Label htmlFor="r-tech" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Техническое поражение
                    </Label>
                </div>
            </RadioGroup>

            <Separator/>
            
            {resultType === 'score' && (
                <div className="grid grid-cols-2 gap-4 items-center animate-in fade-in-50">
                    <div>
                        <Label htmlFor="scoreA" className="text-center block mb-2">{match.team1?.name}</Label>
                        <Input id="scoreA" type="number" value={scoreA} onChange={(e) => setScoreA(e.target.value)} className="text-center text-lg font-bold" />
                    </div>
                    <div>
                        <Label htmlFor="scoreB" className="text-center block mb-2">{match.team2?.name}</Label>
                        <Input id="scoreB" type="number" value={scoreB} onChange={(e) => setScoreB(e.target.value)} className="text-center text-lg font-bold" />
                    </div>
                </div>
            )}

            {resultType === 'technical_defeat' && (
                <div className="space-y-2 animate-in fade-in-50">
                    <Label>Какая команда получает техническое поражение?</Label>
                    <RadioGroup onValueChange={setTechDefeatTeam}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="team1" id="td-t1" />
                            <Label htmlFor="td-t1">{match.team1?.name}</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="team2" id="td-t2" />
                            <Label htmlFor="td-t2">{match.team2?.name}</Label>
                        </div>
                    </RadioGroup>
                </div>
            )}
             <div className="space-y-2 pt-2">
                <Label htmlFor="comment">Комментарий судьи/организатора (необязательно)</Label>
                <Textarea id="comment" placeholder="Например: Штраф за опоздание, причина технического поражения и т.д." value={comment} onChange={(e) => setComment(e.target.value)}/>
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
