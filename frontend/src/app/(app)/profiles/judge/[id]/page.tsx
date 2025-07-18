import JudgeClient from "@/app/(app)/administration/judge/client";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { notFound } from "next/navigation";
import { getAchievementsForUser } from "@/entities/achievement/api/achievements";

export default async function JudgeProfileRoute(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const profileData = await getPlayerProfile(params.id);
  const achievements = await getAchievementsForUser(params.id);

  if (!profileData) {
    notFound();
  }

  // In a real app, you would probably have different achievements per role
  return <JudgeClient user={profileData.user} achievements={achievements} />;
}
