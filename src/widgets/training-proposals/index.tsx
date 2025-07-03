'use client';

import { useTrainingProposals } from '@/app/providers/training-proposal-provider';
import { useSession } from '@/shared/lib/session/client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { ArrowRight, Check, X, ArrowLeft } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function TrainingProposalsWidget() {
    const { user } = useSession();
    const { proposals, updateProposalStatus } = useTrainingProposals();
    const { toast } = useToast();
    
    if (!user) return null;

    const incomingProposals = proposals.filter(p => p.to.name === user.name && p.status === 'pending');
    const outgoingProposals = proposals.filter(p => p.from.name === user.name && p.status === 'pending');
    
    const handleAccept = (proposalId: string, fromName: string) => {
        updateProposalStatus(proposalId, 'accepted');
        toast({ title: 'Принято!', description: `Вы приняли предложение о тренировке от ${fromName}.` });
    };

    const handleDecline = (proposalId: string, fromName: string) => {
        updateProposalStatus(proposalId, 'declined');
        toast({ variant: 'destructive', title: 'Отклонено', description: `Вы отклонили предложение от ${fromName}.` });
    };

    const renderProposal = (proposal: typeof proposals[0], type: 'incoming' | 'outgoing') => (
        <Card key={proposal.id} className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={type === 'incoming' ? proposal.from.avatar : proposal.to.avatar} />
                        <AvatarFallback>{type === 'incoming' ? proposal.from.name.charAt(0) : proposal.to.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{type === 'incoming' ? proposal.from.name : proposal.to.name}</p>
                        <p className="text-xs text-muted-foreground">{proposal.sport} - {format(proposal.date, 'd MMMM, HH:mm', {locale: ru})}</p>
                    </div>
                </div>
                {type === 'incoming' ? (
                    <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDecline(proposal.id, proposal.from.name)}><X className="h-4 w-4"/></Button>
                        <Button size="icon" variant="ghost" className="text-green-500" onClick={() => handleAccept(proposal.id, proposal.from.name)}><Check className="h-4 w-4"/></Button>
                    </div>
                ) : (
                    <Badge variant="outline">Ожидает ответа</Badge>
                )}
            </div>
            {proposal.comment && <p className="text-xs text-muted-foreground italic mt-2 ml-12 pl-1 border-l-2">«{proposal.comment}»</p>}
        </Card>
    );

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
