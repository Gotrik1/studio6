import { organizerUser, organizerAchievements } from "@/shared/lib/mock-data/organizer-profile";
import { crmTournaments } from '@/shared/lib/mock-data/crm-tournaments';
import OrganizerClient from "@/app/(app)/administration/organizer/client";

export function OrganizerProfilePage() {
    // In a real application, this data would be fetched from an API
    const user = organizerUser;
    const achievements = organizerAchievements;
    // Filter tournaments organized by this user
    const tournaments = crmTournaments.filter(t => t.organizer === user.name);

    return <OrganizerClient user={user} achievements={achievements} tournaments={tournaments} />;
}
