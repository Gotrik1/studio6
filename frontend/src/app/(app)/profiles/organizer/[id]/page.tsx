import OrganizerClient from "@/app/(app)/administration/organizer/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import { achievements } from "@/shared/lib/mock-data/profiles";


export default async function OrganizerProfileRoute({ params }: { params: { id: string } }) {
    const profileData = await getPlayerProfile(params.id);

    if (!profileData) {
        notFound();
    }
    
    return (
        <OrganizerClient 
            user={profileData.user} 
            achievements={achievements} // achievements are still mock-based
            tournaments={profileData.user.organizedTournaments || []}
        />
    );
}
