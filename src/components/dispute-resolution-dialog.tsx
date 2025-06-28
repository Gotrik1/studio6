
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { disputedMatches } from "@/lib/mock-data/judge-center";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ImageIcon, MessageSquare, Shield } from "lucide-react";

type DisputedMatch = (typeof disputedMatches)[0];

interface DisputeResolutionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  match: DisputedMatch | null;
  onResolve: (matchId: string, resolution: string) => void;
}

export function DisputeResolutionDialog({ isOpen, onOpenChange, match, onResolve }: DisputeResolutionDialogProps) {
  if (!match) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Рассмотрение спора: {match.team1.name} vs {match.team2.name}</DialogTitle>
          <DialogDescription>
            Турнир: {match.tournament}. Заявленный счет: {match.score}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <div>
                <h4 className="font-semibold text-sm mb-2">Причина спора</h4>
                <p className="text-sm p-3 bg-muted rounded-md">{match.reason}</p>
            </div>
            <Separator />
             <div>
                <h4 className="font-semibold text-sm mb-2">Доказательства</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 font-medium">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={match.team1.logo} data-ai-hint={match.team1.logoHint} />
                            </Avatar>
                            <span>{match.team1.name}</span>
                        </div>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start"><ImageIcon className="mr-2 h-4 w-4" /> Скриншот конца матча</Button>
                            <Button variant="outline" className="w-full justify-start"><MessageSquare className="mr-2 h-4 w-4" /> Лог чата</Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 font-medium">
                             <Avatar className="h-6 w-6">
                                <AvatarImage src={match.team2.logo} data-ai-hint={match.team2.logoHint} />
                            </Avatar>
                            <span>{match.team2.name}</span>
                        </div>
                         <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start"><ImageIcon className="mr-2 h-4 w-4" /> Видеозапись спорного момента</Button>
                            <Button variant="outline" className="w-full justify-start"><MessageSquare className="mr-2 h-4 w-4" /> Лог чата</Button>
                        </div>
                    </div>
                </div>
            </div>
             <Separator />
            <div>
                <h4 className="font-semibold text-sm mb-2">Решение</h4>
                 <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="flex-1" onClick={() => onResolve(match.id, `победа присуждена ${match.team1.name}`)}>
                        <Shield className="mr-2 h-4 w-4"/>Победа {match.team1.name}
                    </Button>
                    <Button className="flex-1" onClick={() => onResolve(match.id, `победа присуждена ${match.team2.name}`)}>
                        <Shield className="mr-2 h-4 w-4"/>Победа {match.team2.name}
                    </Button>
                    <Button className="flex-1" variant="destructive" onClick={() => onResolve(match.id, 'назначена переигровка')}>
                        Переигровка
                    </Button>
                 </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
