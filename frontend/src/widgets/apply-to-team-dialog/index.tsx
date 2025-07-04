
'use client';

import { useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Textarea } from '@/shared/ui/textarea';
import { useToast } from '@/shared/hooks/use-toast';
import { Send } from 'lucide-react';
import { useJoinRequests } from '@/shared/context/join-request-provider';
import { useSession } from '@/shared/lib/session/client';
import type { Team } from '@/entities/team/model/types';

interface ApplyToTeamDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  team: {
      name: string;
      slug: string;
  };
}

export function ApplyToTeamDialog({ isOpen, onOpenChange, team }: ApplyToTeamDialogProps) {
    const { toast } = useToast();
    const { user } = useSession();
    const { addRequest } = useJoinRequests();
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!message.trim()) {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Пожалуйста, напишите сопроводительное сообщение.',
            });
            return;
        }
        if (!user) {
             toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Не удалось определить пользователя.',
            });
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            addRequest(team.slug, user, message);
            toast({
                title: 'Заявка отправлена!',
                description: `Ваша заявка на вступление в команду "${team.name}" была успешно отправлена.`,
            });
            setIsSubmitting(false);
            onOpenChange(false);
            setMessage('');
        }, 500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Заявка на вступление в &quot;{team.name}&quot;</DialogTitle>
                    <DialogDescription>
                        Напишите короткое сообщение капитану команды, чтобы рассказать о себе.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="message">Сопроводительное сообщение</Label>
                    <Textarea 
                        id="message" 
                        placeholder="Почему вы хотите присоединиться к этой команде?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px] mt-2"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
