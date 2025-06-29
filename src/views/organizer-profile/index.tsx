import { organizerUser, organizerAchievements } from "@/shared/lib/mock-data/organizer-profile";
import OrganizerClient from "@/app/(app)/administration/organizer/client";

export function OrganizerProfilePage() {
    // In a real application, this data would be fetched from an API
    const user = organizerUser;
    const achievements = organizerAchievements;

    return <OrganizerClient user={user} achievements={achievements} />;
}
