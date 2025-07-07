import type { User } from '@/shared/lib/types';

export type Application = {
    id: string;
    teamId: string;
    message?: string;
    user: User;
    statsSummary?: string;
    team: {
        id: string;
        name: string;
        slug: string;
        captain: { name: string };
    };
};
