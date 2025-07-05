
'use server';

import type { TournamentDetails } from '@/entities/tournament/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

// Adapter function to transform raw backend data into the frontend's TournamentDetails type
function adaptTournamentDetails(data: any): TournamentDetails {
    if (!data) return null as any;

    const shapeTeam = (team: any) => ({
        name: team.name,
        logo: team.logo || null,
        dataAiHint: team.dataAiHint || 'team logo',
        slug: team.slug,
    });
    
    const shapeMatch = (match: any) => ({
        id: String(match.id),
        team1: match.team1 ? shapeTeam(match.team1) : undefined,
        team2: match.team2 ? shapeTeam(match.team2) : undefined,
        score: match.team1Score !== null && match.team2Score !== null ? `${match.team1Score}-${match.team2Score}` : 'VS',
        winner: match.winner,
        href: `/matches/${String(match.id)}`,
        date: match.scheduledAt,
        time: match.scheduledAt ? new Date(match.scheduledAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '',
    });
    
    // Adapt the main tournament object
    return {
        ...data,
        id: String(data.id),
        teams: (data.teams || []).map(shapeTeam),
        matches: (data.matches || []).map(shapeMatch),
        bracket: {
            ...data.bracket,
            rounds: (data.bracket?.rounds || []).map((round: any) => ({
                ...round,
                matches: (round.matches || []).map(shapeMatch)
            }))
        },
        organizer: {
            ...data.organizer,
            avatar: data.organizer?.avatar || null
        }
    };
}


export async function getTournamentBySlug(slug: string): Promise<TournamentDetails | null> {
    const result = await fetchWithAuth(`/tournaments/slug/${slug}`);
    
    if (!result.success) {
        console.error(`Failed to fetch tournament ${slug}:`, result.error);
        return null;
    }
    
    if (!result.data) {
        return null;
    }

    return adaptTournamentDetails(result.data);
}

export async function getTournamentById(id: string): Promise<TournamentDetails | null> {
    const result = await fetchWithAuth(`/tournaments/${id}`);
    
    if (!result.success) {
        console.error(`Failed to fetch tournament ${id}:`, result.error);
        return null;
    }
    
    if (!result.data) {
        return null;
    }
    return adaptTournamentDetails(result.data);
}
