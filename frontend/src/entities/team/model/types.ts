
import type { teams } from '@/shared/lib/mock-data/teams';
import type { userList } from '@/shared/lib/mock-data/users';

export type Team = (typeof teams)[0];

// This type is now defined in entities/user/model/types.ts
// export type UserTeam = {
//   name: string;
//   role: string;
//   logo: string | null;
//   dataAiHint: string | null;
//   slug: string;
//   rank: number;
//   game: string;
// };

export type TeamRosterMember = {
    id: string;
    name: string;
    avatar: string;
    role: string;
    rating: string;
    status: string;
};

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
