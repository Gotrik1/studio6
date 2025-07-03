import { sponsorUser, sponsorAchievements } from "@/shared/lib/mock-data/sponsor-profile";
import SponsorClient from "@/app/(app)/administration/sponsor/client";

export function SponsorProfilePage() {
    // In a real application, this data would be fetched from an API
    const user = sponsorUser;
    const achievements = sponsorAchievements;

    return <SponsorClient user={user} achievements={achievements} />;
}
