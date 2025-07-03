
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import type { userList as UserListType } from '@/shared/lib/mock-data/users';
import { useToast } from '@/shared/hooks/use-toast';
import { Coins } from 'lucide-react';

type User = (typeof UserListType)[0];

interface UserPdDialogProps {
    user: User | null;
    action: 'credit' | 'debit' | null;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const creditReasons = ["Награда за конкурс", "Бонус от администрации", "Компенсация", "Спонсорская выплата", "За активность"];
const debitReasons = ["Штраф за нарушение", "Списание за неактивность", "Корректировка баланса", "Возврат средств"];

export function UserPdDialog({ user, action, isOpen, onOpenChange }: UserPdDialogProps) {
    const { toast } = useToast();
    const [amount, setAmount] = useState('100');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (isOpen) {
            setAmount('100');
            setReason('');
        }
    }, [isOpen]);

    const handleSave = () => {
        if (!user || !action) return;
        
        const numAmount = parseInt(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Введите корректную сумму больше нуля.' });
            return;
        }
        if (!reason) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Выберите причину.' });
            return;
        }

        const actionText = action === 'credit' ? 'начислено' : 'списано';
        toast({
            title: `Успешно!`,
            description: `Пользователю ${user.name} было ${actionText} ${numAmount} PD. Причина: ${reason}`,
        });
        
        onOpenChange(false);
    };

    if (!user || !action) return null;

    const dialogTitle = action === 'credit' ? `Начислить PD пользователю ${user.name}` : `Списать PD у пользователя ${user.name}`;
    const reasons = action === 'credit' ? creditReasons : debitReasons;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-amber-500" />
                        {dialogTitle}
                    </DialogTitle>
                    <DialogDescription>
                        Введите сумму и выберите причину для транзакции. Это действие будет записано в лог.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <Label htmlFor="pd-amount">Сумма PD</Label>
                        <Input id="pd-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                     <div>
                        <Label htmlFor="pd-reason">Причина</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger id="pd-reason">
                                <SelectValue placeholder="Выберите причину" />
                            </SelectTrigger>
                            <SelectContent>
                                {reasons.map(r => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                    <Button onClick={handleSave}>Подтвердить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
