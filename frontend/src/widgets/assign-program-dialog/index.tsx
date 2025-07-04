
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Checkbox } from '@/shared/ui/checkbox';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { useToast } from '@/shared/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Share } from 'lucide-react';
import type { TrainingProgram } from '@/entities/training-program/model/types';
import { coachedPlayers } from '@/shared/lib/mock-data/coach-players';

interface AssignProgramDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    program: TrainingProgram | null;
}

export function AssignProgramDialog({ isOpen, onOpenChange, program }: AssignProgramDialogProps) {
    const { toast } = useToast();
    const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!isOpen) {
            setSelectedPlayerIds(new Set());
        }
    }, [isOpen]);

    if (!program) return null;

    const handleSelectPlayer = (playerId: string) => {
        setSelectedPlayerIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(playerId)) {
                newSet.delete(playerId);
            } else {
                newSet.add(playerId);
            }
            return newSet;
        });
    };
    
    const handleSelectAll = () => {
        if (selectedPlayerIds.size === coachedPlayers.length) {
            setSelectedPlayerIds(new Set());
        } else {
            setSelectedPlayerIds(new Set(coachedPlayers.map(p => p.id)));
        }
    }

    const handleAssign = () => {
        if (selectedPlayerIds.size === 0) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Выберите хотя бы одного игрока.' });
            return;
        }

        // In a real app, this would be an API call
        toast({
            title: 'Программа назначена!',
            description: `Программа "${program.name}" назначена ${selectedPlayerIds.size} игрокам.`,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Назначить программу: {program.name}</DialogTitle>
                    <DialogDescription>Выберите игроков, которым будет назначена эта тренировочная программа.</DialogDescription>
                </DialogHeader>
                <div className="py-2">
                    <div className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="select-all"
                                checked={selectedPlayerIds.size === coachedPlayers.length && coachedPlayers.length > 0}
                                onCheckedChange={handleSelectAll}
                            />
                            <label htmlFor="select-all" className="text-sm font-medium">Выбрать всех</label>
                        </div>
                        <span className="text-sm text-muted-foreground">Выбрано: {selectedPlayerIds.size}</span>
                    </div>
                    <ScrollArea className="h-64">
                        <div className="p-2 space-y-1">
                            {coachedPlayers.map(player => (
                                <div key={player.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                                    <Checkbox
                                        id={`player-${player.id}`}
                                        checked={selectedPlayerIds.has(player.id)}
                                        onCheckedChange={() => handleSelectPlayer(player.id)}
                                    />
                                    <label htmlFor={`player-${player.id}`} className="font-medium text-sm cursor-pointer flex-1 flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.avatarHint} />
                                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {player.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                    <Button onClick={handleAssign} disabled={selectedPlayerIds.size === 0}>
                        <Share className="mr-2 h-4 w-4" /> Назначить ({selectedPlayerIds.size})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
