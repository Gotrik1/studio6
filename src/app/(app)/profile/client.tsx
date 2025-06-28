'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from "@/lib/session";

// Import all mock data for different roles
import { adminUser, adminAchievements } from "@/lib/mock-data/admin-profile";
import { coachUser, coachAchievements } from "@/lib/mock-data/coach-profile";
import { fanUser, fanAchievements } from "@/lib/mock-data/fan-profile";
import { judgeUser, judgeAchievements } from "@/lib/mock-data/judge-profile";
import { managerUser, managerAchievements } from "@/lib/mock-data/manager-profile";
import { moderatorUser, moderatorAchievements } from "@/lib/mock-data/moderator-profile";
import { organizerUser, organizerAchievements } from "@/lib/mock-data/organizer-profile";
import { sponsorUser, sponsorAchievements } from "@/lib/mock-data/sponsor-profile";

const ProfileSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
    </div>
);

// Dynamic imports for each profile component
const PlayerProfile = dynamic(() => import('@/components/player-profile').then(mod => mod.PlayerProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const AdminProfile = dynamic(() => import('@/components/admin-profile').then(mod => mod.AdminProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const CoachProfile = dynamic(() => import('@/components/coach-profile').then(mod => mod.CoachProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const FanProfile = dynamic(() => import('@/components/fan-profile').then(mod => mod.FanProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const JudgeProfile = dynamic(() => import('@/components/judge-profile').then(mod => mod.JudgeProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const ManagerProfile = dynamic(() => import('@/components/manager-profile').then(mod => mod.ManagerProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const ModeratorProfile = dynamic(() => import('@/components/moderator-profile').then(mod => mod.ModeratorProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const OrganizerProfile = dynamic(() => import('@/components/organizer-profile').then(mod => mod.OrganizerProfile), { loading: () => <ProfileSkeleton />, ssr: false });
const SponsorProfile = dynamic(() => import('@/components/sponsor-profile').then(mod => mod.SponsorProfile), { loading: () => <ProfileSkeleton />, ssr: false });

type ProfileClientProps = {
  sessionUser: User;
};
  
export default function ProfileClient({ sessionUser }: ProfileClientProps) {
    const role = sessionUser.role;
    
    // For non-player roles, we use mock data. For a player/captain, we use augmented session data.
    const augmentedPlayerUser = {
        ...sessionUser,
        location: "Москва, Россия",
        mainSport: "Valorant",
        status: sessionUser.role === 'Капитан' ? "Капитан команды 'Кибер Орлы'" : "Активен",
        isVerified: true,
    };

    switch (role) {
        case 'Администратор':
            return <AdminProfile user={adminUser} achievements={adminAchievements} />;
        case 'Тренер':
            return <CoachProfile user={coachUser} achievements={coachAchievements} />;
        case 'Болельщик':
            return <FanProfile user={fanUser} achievements={fanAchievements} />;
        case 'Судья':
            return <JudgeProfile user={judgeUser} achievements={judgeAchievements} />;
        case 'Менеджер':
            return <ManagerProfile user={managerUser} achievements={managerAchievements} />;
        case 'Модератор':
            return <ModeratorProfile user={moderatorUser} achievements={moderatorAchievements} />;
        case 'Организатор':
            return <OrganizerProfile user={organizerUser} achievements={organizerAchievements} />;
        case 'Спонсор':
            return <SponsorProfile user={sponsorUser} achievements={sponsorAchievements} />;
        case 'Игрок':
        case 'Капитан':
        default:
            return <PlayerProfile user={augmentedPlayerUser} isCurrentUser={true} />;
    }
}
