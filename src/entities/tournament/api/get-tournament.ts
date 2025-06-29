import { summerKickoffTournament } from '@/shared/lib/mock-data/tournament-details';
import type { TournamentDetails } from '@/entities/tournament/model/types';

export function getTournamentBySlug(slug: string): TournamentDetails | null {
    // In a real app, this would look up the tournament in a database.
    // For now, we only have one, so we return it if the slug matches.
    if (slug === summerKickoffTournament.slug) {
        return summerKickoffTournament;
    }
    return null;
}
