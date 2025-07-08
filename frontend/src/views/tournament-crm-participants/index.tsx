

'use client';

import { CrmTournamentParticipants as CrmTournamentParticipantsWidget } from '@/widgets/crm-tournament-participants';
import { useState, useEffect, useCallback, useTransition } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import {
    getTournamentApplications,
    getTournamentParticipants,
    approveApplication,
    rejectApplication,
    removeParticipant,
    type Application,
    type Participant
} from '@/entities/tournament/api/participants';

interface TournamentCrmParticipantsPageProps {
    tournamentId: string;
}

export function TournamentCrmParticipantsPage({ tournamentId }: TournamentCrmParticipantsPageProps) {
    const { toast } = useToast();
    const [applications, setApplications] = useState<Application[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openCollapsibles, setOpenCollapsibles] = useState<string[]>([]);
    const [isActionPending, startTransition] = useTransition();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [appsResult, participantsResult] = await Promise.all([
                getTournamentApplications(tournamentId),
                getTournamentParticipants(tournamentId)
            ]);
            
            if (appsResult.success && appsResult.data) {
                setApplications(appsResult.data as Application[]);
            } else if (!appsResult.success) {
                throw new Error(appsResult.error);
            }

            if (participantsResult.success && participantsResult.data) {
                setParticipants(participantsResult.data as Participant[]);
            } else if (!participantsResult.success) {
                throw new Error(participantsResult.error);
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить данные участников';
            toast({ variant: 'destructive', title: 'Ошибка', description: `Не удалось загрузить участников: ${errorMessage}` });
        } finally {
            setIsLoading(false);
        }
    }, [tournamentId, toast]);

    useEffect(() => {
        if(tournamentId) {
            fetchData();
        }
    }, [tournamentId, fetchData]);

    const toggleCollapsible = (id: string) => {
        setOpenCollapsibles(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleAction = async (action: () => Promise<{ success: boolean; error?: string }>, successMsg: string, errorMsg: string) => {
        startTransition(async () => {
            const result = await action();
            if (result.success) {
                toast({ title: successMsg });
                await fetchData();
            } else {
                 toast({ variant: 'destructive', title: 'Ошибка', description: result.error || errorMsg });
            }
        });
    }

    const handleAccept = (app: Application) => {
        handleAction(
            () => approveApplication(tournamentId, app.id),
            'Заявка принята',
            `Не удалось принять заявку от ${app.team.name}.`
        );
    };

    const handleDecline = (app: Application) => {
         handleAction(
            () => rejectApplication(tournamentId, app.id),
            'Заявка отклонена',
            `Не удалось отклонить заявку от ${app.team.name}.`
        );
    };
    
    const handleRemove = (team: Participant) => {
        handleAction(
            () => removeParticipant(tournamentId, team.id),
            'Участник удален',
            `Не удалось удалить команду ${team.name}.`
        );
    }
    
    return <CrmTournamentParticipantsWidget
        tournamentId={tournamentId}
        applications={applications}
        participants={participants}
        isLoading={isLoading}
        openCollapsibles={openCollapsibles}
        isActionPending={isActionPending}
        toggleCollapsible={toggleCollapsible}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
        handleRemove={handleRemove}
    />;
}
