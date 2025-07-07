

'use server';

import type { TournamentDetails, BracketMatch, BracketRound } from '@/entities/tournament/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';

type RawTeam = { name: string; logo: string | null; dataAiHint?: string | null; slug?: string; };
type RawMatch = { id: string | number; team1?: RawTeam; team2?: RawTeam; score?: string; winner?: boolean; href?: string; date?: string; time?: string; team1Score?: number | null; team2Score?: number | null; scheduledAt?: string };
type RawRound = { name: string; matches: RawMatch[] };
type RawTournamentData = Omit<TournamentDetails, 'bracket' | 'teams' | 'matches'> & {
    bracket: { rounds: RawRound[] };
    teams: RawTeam[];
    matches: RawMatch[];
};

// Adapter function to transform raw backend data into the frontend's TournamentDetails type
function adaptTournamentDetails(data: RawTournamentData): TournamentDetails {
    if (!data) return null as any;

    const shapeTeam = (team: RawTeam) => ({
        name: team.name,
        logo: team.logo || null,
        dataAiHint: team.dataAiHint || 'team logo',
        slug: team.slug,
    });
    
    const shapeMatch = (match: RawMatch): BracketMatch => ({
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
            rounds: (data.bracket?.rounds || []).map((round: RawRound): BracketRound => ({
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
