'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, Coins } from 'lucide-react';

interface DonationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  recipientName: string;
  recipientType: 'команде' | 'игроку';
}

const presetAmounts = [10, 50, 100, 500];

export function DonationDialog({ isOpen, onOpenChange, recipientName, recipientType }: DonationDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState('100');
  const [message, setMessage] = useState('');
  const [isDonating, setIsDonating] = useState(false);

  const handleDonate = async () => {
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Пожалуйста, введите корректную сумму больше нуля.',
      });
      return;
    }

    setIsDonating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Спасибо за поддержку!',
      description: `Вы успешно пожертвовали ${numAmount} PD ${recipientType} ${recipientName}.`,
    });

    setIsDonating(false);
    onOpenChange(false);
    // Reset state for next use
    setAmount('100');
    setMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
              <Heart className="text-primary"/>
              Поддержать {recipientName}
          </DialogTitle>
          <DialogDescription>
            Ваше пожертвование поможет развитию {recipientType}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="amount" className="text-right">
              Сумма пожертвования
            </Label>
            <div className="relative mt-2">
                 <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-10 font-bold text-lg" />
            </div>
            <div className="mt-2 flex gap-2">
                {presetAmounts.map(preset => (
                    <Button key={preset} variant="outline" size="sm" onClick={() => setAmount(String(preset))}>
                        {preset} PD
                    </Button>
                ))}
            </div>
          </div>
          <div>
            <Label htmlFor="message">
              Сообщение (необязательно)
            </Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ваши слова поддержки..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleDonate} disabled={isDonating}>
            {isDonating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Пожертвовать {amount} PD
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
