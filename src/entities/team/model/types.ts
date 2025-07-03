import type { teams } from '@/shared/lib/mock-data/teams';
import type { teamRoster } from '@/shared/lib/mock-data/team-details';

export type Team = (typeof teams)[0];

export type TeamRosterMember = (typeof teamRoster)[0];

export type TeamDetails = {
    name: string;
    motto: string;
    logo: string;
    dataAiHint: string;
    game: string;
    rank: number;
    membersCount: number;
    captainName: string;
    slug: string;
    homePlaygroundId: string | null;
    roster: TeamRosterMember[];
};
