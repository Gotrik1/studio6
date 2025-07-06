import type { User } from '@/shared/lib/types';

export type JoinRequest = {
    id: string;
    teamId: string;
    applicant: User;
    message: string;
    statsSummary: string; // For AI analysis
};
