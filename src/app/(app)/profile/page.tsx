import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ProfileClient from "./client";

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

  return <ProfileClient user={userProfile} isCurrentUser={true} />;
}
