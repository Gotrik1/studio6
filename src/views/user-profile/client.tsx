'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui/skeleton';
import type { User } from "@/shared/lib/types";

// Import all mock data for different roles
import { adminUser, adminAchievements } from "@/shared/lib/mock-data/admin-profile";
import { coachUser, coachAchievements } from "@/shared/lib/mock-data/coach-profile";
import { fanUser, fanAchievements } from "@/shared/lib/mock-data/fan-profile";
import { judgeUser, judgeAchievements } from "@/shared/lib/mock-data/judge-profile";
import { managerUser, managerAchievements } from "@/shared/lib/mock-data/manager-profile";
import { moderatorUser, moderatorAchievements } from "@/shared/lib/mock-data/moderator-profile";
import { organizerUser, organizerAchievements } from "@/shared/lib/mock-data/organizer-profile";
import { sponsorUser, sponsorAchievements } from "@/shared/lib/mock-data/sponsor-profile";
import { achievements, teams as playerTeams, recentMatches, gallery, careerHistory } from "@/shared/lib/mock-data/profiles";
import { crmTournaments } from '@/shared/lib/mock-data/crm-tournaments';
import { teams as allTeamsData } from '@/shared/lib/mock-data/teams';


const ProfileSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
    </div>
);

// Dynamic imports for each profile component
const PlayerProfile = dynamic(() => import('@/entities/player/ui/player-profile').then(mod => mod.PlayerProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const AdminProfile = dynamic(() => import('@/entities/user/ui/admin-profile').then(mod => mod.AdminProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const CoachProfile = dynamic(() => import('@/entities/user/ui/coach-profile').then(mod => mod.CoachProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const FanProfile = dynamic(() => import('@/entities/user/ui/fan-profile').then(mod => mod.FanProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const JudgeProfile = dynamic(() => import('@/entities/user/ui/judge-profile').then(mod => mod.JudgeProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const ManagerProfile = dynamic(() => import('@/entities/user/ui/manager-profile').then(mod => mod.ManagerProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const ModeratorProfile = dynamic(() => import('@/entities/user/ui/moderator-profile').then(mod => mod.ModeratorProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const OrganizerProfile = dynamic(() => import('@/entities/user/ui/organizer-profile').then(mod => mod.OrganizerProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const SponsorProfile = dynamic(() => import('@/entities/user/ui/sponsor-profile').then(mod => mod.SponsorProfile), { loading: () => <ProfileSkeleton />, ssr: false });

type UserProfileClientProps = {
  userToDisplay: User;
  sessionUser: User;
};
  
export default function UserProfileClient({ userToDisplay, sessionUser }: UserProfileClientProps) {
    const role = userToDisplay.role;
    const isCurrentUser = userToDisplay.email === sessionUser.email;
    
    // For non-player roles, we use mock data. For a player/captain, we use augmented session data.
    const augmentedPlayerUser = {
        ...userToDisplay,
        location: "Москва, Россия",
        mainSport: "Футбол",
        status: userToDisplay.role === 'Капитан' ? "Капитан команды 'Дворовые Атлеты'" : "Активен",
        isVerified: true,
        xp: 1250, // mock experience points
    };

    const favoriteTeams = allTeamsData.slice(0, 2);
    const organizerTournaments = crmTournaments.filter(t => t.organizer === organizerUser.name);

    switch (role) {
        case 'Администратор':
            return <AdminProfile user={adminUser} achievements={adminAchievements} />;
        case 'Тренер':
            return <CoachProfile user={coachUser} achievements={coachAchievements} />;
        case 'Болельщик':
            return <FanProfile user={fanUser} achievements={fanAchievements} favoriteTeams={favoriteTeams} />;
        case 'Судья':
            return <JudgeProfile user={judgeUser} achievements={judgeAchievements} />;
        case 'Менеджер':
            return <ManagerProfile user={managerUser} achievements={managerAchievements} />;
        case 'Модератор':
            return <ModeratorProfile user={moderatorUser} achievements={moderatorAchievements} />;
        case 'Организатор':
            return <OrganizerProfile user={organizerUser} achievements={organizerAchievements} tournaments={organizerTournaments} />;
        case 'Спонсор':
            return <SponsorProfile user={sponsorUser} achievements={sponsorAchievements} />;
        case 'Игрок':
        case 'Капитан':
        default:
            return <PlayerProfile 
                        user={augmentedPlayerUser} 
                        isCurrentUser={isCurrentUser}
                        achievements={achievements}
                        teams={playerTeams}
                        recentMatches={recentMatches}
                        gallery={gallery}
                        careerHistory={careerHistory}
                    />;
    }
}
