import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";

export default async function ProfileRedirectPage() {
  const sessionUser = await getSession();

  if (!sessionUser) {
    redirect("/auth");
  }

  // This logic is a bit naive for a real app but works for demo
  // It maps roles to profile paths
  const rolePath = sessionUser.role.toLowerCase();
  const roleToPathMap: {[key: string]: string} = {
      'игрок': 'player',
      'капитан': 'player', // Captains also view the player profile
      'администратор': 'administrator',
      'тренер': 'coach',
      'судья': 'judge',
      'менеджер': 'manager',
      'модератор': 'moderator',
      'организатор': 'organizer',
      'спонсор': 'sponsor',
      'болельщик': 'fan',
  };

  const profilePathSegment = roleToPathMap[rolePath] || 'player';

  redirect(`/profiles/${profilePathSegment}/${sessionUser.id}`);
}
