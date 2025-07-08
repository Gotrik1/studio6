



'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { CrmTournamentParticipants as CrmTournamentParticipantsWidget } from '@/widgets/crm-tournament-participants';
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
import type { User } from '@/shared/lib/types';


type BackendApplication = {
    id: string;
    teamId: string;
    message?: string;
    user: User;
    team: {
        id: string;
        name: string;
        slug: string;
        captain: { name: string } | null;
    };
};
type BackendParticipantTeam = {
    id: string;
    name: string;
    captain: User | null;
    members: User[];
};

function adaptApplication(app: BackendApplication): Application {
    return {
        id: app.id,
        teamId: app.teamId,
        message: app.message,
        user: app.user,
        team: {
            id: app.team.id,
            name: app.team.name,
            slug: app.team.slug,
            captain: app.team.captain,
        },
    };
}
function adaptParticipant(team: BackendParticipantTeam): Participant {
    return {
        id: team.id,
        name: team.name,
        captain: team.captain ? { name: team.captain.name } : null,
        members: team.members.map(m => ({
            id: m.id,
            name: m.name,
            avatar: m.avatar,
            role: m.role
        }))
    }
}

interface TournamentCrmDetailsPageProps {
    tournamentId: string;
}

export function TournamentCrmDetailsPage({ tournamentId }: TournamentCrmDetailsPageProps) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openCollapsibles, setOpenCollapsibles] = useState<string[]>([]);
    const [isActionPending, startTransition] = useTransition();
    const { toast } = useToast();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [appsResult, participantsResult] = await Promise.all([
                getTournamentApplications(tournamentId),
                getTournamentParticipants(tournamentId)
            ]);
            
            if (appsResult.success && appsResult.data) {
                setApplications(appsResult.data);
            } else if (!appsResult.success) {
                throw new Error(appsResult.error);
            }

            if (participantsResult.success && participantsResult.data) {
                setParticipants(participantsResult.data);
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
