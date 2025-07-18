import OrganizerClient from "@/app/(app)/administration/organizer/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";

export default async function OrganizerProfileRoute(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const [profileData, achievements] = await Promise.all([
    getPlayerProfile(params.id),
    getAchievementsForUser(params.id),
  ]);

  if (!profileData) {
    notFound();
  }

  return (
    <OrganizerClient
      user={profileData.user}
      achievements={achievements}
      tournaments={profileData.user.organizedTournaments || []}
    />
  );
}
