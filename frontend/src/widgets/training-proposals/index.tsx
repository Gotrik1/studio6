
'use client';

import { useTransition } from 'react';
import { useTrainingProposals, type TrainingProposal } from '@/app/providers/training-proposal-provider';
import { useSession } from '@/shared/lib/session/client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { ArrowRight, Check, X, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function TrainingProposalsWidget() {
    const { user } = useSession();
    const { proposals, updateProposalStatus, isLoading } = useTrainingProposals();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    
    if (!user) return null;

    const incomingProposals = proposals.filter(p => p.to.id === user.id && p.status === 'PENDING');
    const outgoingProposals = proposals.filter(p => p.from.id === user.id && p.status === 'PENDING');
    
    const handleResponse = (proposalId: string, fromName: string, status: 'ACCEPTED' | 'DECLINED') => {
        startTransition(async () => {
            const success = await updateProposalStatus(proposalId, status);
            if(success) {
                const message = status === 'ACCEPTED' 
                    ? `Вы приняли предложение о тренировке от ${fromName}.`
                    : `Вы отклонили предложение от ${fromName}.`;
                toast({ title: status === 'ACCEPTED' ? 'Принято!' : 'Отклонено', description: message });
            } else {
                 toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось обновить статус.' });
            }
        });
    };

    const renderProposal = (proposal: TrainingProposal, type: 'incoming' | 'outgoing') => {
        const otherUser = type === 'incoming' ? proposal.from : proposal.to;
        
        return (
            <Card key={proposal.id} className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={otherUser.avatar || ''} />
                            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{otherUser.name}</p>
                            <p className="text-xs text-muted-foreground">{proposal.sport} - {format(new Date(proposal.date), 'd MMMM, HH:mm', {locale: ru})}</p>
                        </div>
                    </div>
                    {type === 'incoming' ? (
                        <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleResponse(proposal.id, proposal.from.name, 'DECLINED')} disabled={isPending}>
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4"/>}
                            </Button>
                            <Button size="icon" variant="ghost" className="text-green-500" onClick={() => handleResponse(proposal.id, proposal.from.name, 'ACCEPTED')} disabled={isPending}>
                                 {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4"/>}
                            </Button>
                        </div>
                    ) : (
                        <Badge variant="outline">Ожидает</Badge>
                    )}
                </div>
                {proposal.comment && <p className="text-xs text-muted-foreground italic mt-2 ml-12 pl-1 border-l-2">«{proposal.comment}»</p>}
            </Card>
        );
    }

    if (isLoading) {
        return <Card><CardContent className="p-4">Загрузка...</CardContent></Card>
    }

    return (
         <Card>
            <CardHeader>
                <CardTitle>Приглашения на тренировку</CardTitle>
                <CardDescription>Принимайте или отклоняйте предложения от других игроков.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><ArrowRight className="text-primary"/> Входящие</h4>
                     <div className="space-y-2">
                        {incomingProposals.length > 0 ? incomingProposals.map(p => renderProposal(p, 'incoming')) : <p className="text-xs text-muted-foreground text-center p-4">Нет входящих предложений.</p>}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><ArrowLeft className="text-muted-foreground"/> Исходящие</h4>
                     <div className="space-y-2">
                        {outgoingProposals.length > 0 ? outgoingProposals.map(p => renderProposal(p, 'outgoing')) : <p className="text-xs text-muted-foreground text-center p-4">Нет отправленных предложений.</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
