import OrganizerClient from "@/app/(app)/administration/organizer/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";

// Use a known organizer ID from the seeded data.
const DEMO_ORGANIZER_ID = '6'; // ID for 'Иван Смирнов'

export async function OrganizerProfilePage() {
    const profileData = await getPlayerProfile(DEMO_ORGANIZER_ID);

    if (!profileData) {
        notFound();
    }
    
    return (
        <OrganizerClient
            user={profileData.user}
            achievements={profileData.achievements} // achievements are still from mock inside getPlayerProfile
            tournaments={profileData.user.organizedTournaments || []}
        />
    );
}
