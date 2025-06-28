import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { PlayerProfile } from "@/components/player-profile";

export default async function ProfilePage() {
  const user = await getSession();
  if (!user) redirect('/auth');

  // Augment user data for this page example
  const userProfile = {
      ...user,
      location: "Москва, Россия",
      mainSport: "Valorant",
      status: "Капитан команды 'Кибер Орлы'",
      isVerified: true,
  }

  return <PlayerProfile user={userProfile} isCurrentUser={true} />;
}
