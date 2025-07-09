import OrganizerClient from "@/app/(app)/administration/organizer/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";

// Use a known organizer ID from the seeded data.
// In a real database, this might be a different user.
// User with ID '6' is created with the role 'Организатор' by the seeder.
const DEMO_ORGANIZER_ID = "6";

export async function OrganizerProfilePage() {
  const [profileData, achievements] = await Promise.all([
    getPlayerProfile(DEMO_ORGANIZER_ID),
    getAchievementsForUser(DEMO_ORGANIZER_ID),
  ]);

  if (!profileData) {
    notFound();
  }

  return (
    <OrganizerClient
      user={profileData.user}
      achievements={achievements} // achievements are still from mock
      tournaments={profileData.user.organizedTournaments || []}
    />
  );
}
