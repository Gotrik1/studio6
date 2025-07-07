

'use server';

import type { TournamentDetails, BracketMatch, BracketRound } from '@/entities/tournament/model/types';
import { fetchWithAuth } from '@/shared/lib/api-client';
import type { Team, Match, TournamentMedia, User } from '@prisma/client';

type RawTeam = Pick<Team, 'name' | 'logo' | 'dataAiHint' | 'slug'>;
type RawMatch = Pick<Match, 'id' | 'team1Score' | 'team2Score' | 'scheduledAt'> & { winner?: boolean, href?: string, date?: string, time?: string, team1?: RawTeam, team2?: RawTeam };
type RawRound = { name: string; matches: RawMatch[] };
type RawTournamentData = Omit<TournamentDetails, 'bracket' | 'teams' | 'matches' | 'media' | 'organizer'> & {
    bracket: { rounds: RawRound[] };
    teams: RawTeam[];
    matches: RawMatch[];
    media: TournamentMedia[];
    organizer: Pick<User, 'name' | 'avatar'>;
};

// Adapter function to transform raw backend data into the frontend's TournamentDetails type
function adaptTournamentDetails(data: RawTournamentData): TournamentDetails {
    if (!data) return null as any;

    const shapeTeam = (team: RawTeam | null | undefined) => ({
        name: team?.name || 'TBD',
        logo: team?.logo || null,
        dataAiHint: team?.dataAiHint || 'team logo',
        slug: team?.slug,
    });
    
    const shapeMatch = (match: RawMatch): BracketMatch => ({
        id: String(match.id),
        team1: match.team1 ? shapeTeam(match.team1) : undefined,
        team2: match.team2 ? shapeTeam(match.team2) : undefined,
        score: match.team1Score !== null && match.team2Score !== null ? `${match.team1Score}-${match.team2Score}` : 'VS',
        winner: match.winner,
        href: `/matches/${String(match.id)}`,
        date: match.scheduledAt ? new Date(match.scheduledAt).toISOString() : undefined,
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
            name: data.organizer?.name || 'Unknown',
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

    return adaptTournamentDetails(result.data as RawTournamentData);
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
    
    return adaptTournamentDetails(result.data as RawTournamentData);
}
