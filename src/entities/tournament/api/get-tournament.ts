import { summerKickoffTournament, footballCupTournament } from '@/shared/lib/mock-data/tournament-details';
import type { TournamentDetails } from '@/entities/tournament/model/types';

export function getTournamentBySlug(slug: string): TournamentDetails | null {
    // In a real app, this would look up the tournament in a database.
    if (slug === summerKickoffTournament.slug) {
        return summerKickoffTournament;
    }
    if (slug === footballCupTournament.slug) {
        return footballCupTournament;
    }
    return null;
}
