import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { userList } from '@/shared/lib/mock-data/users';

export default async function ProfileRedirectPage() {
  const sessionUser = await getSession();

  if (!sessionUser) {
    redirect("/auth");
  }

  // Find the full user object to get their ID and role for redirection
  const fullUser = userList.find(u => u.email === sessionUser.email);
  if (!fullUser) {
    // Fallback or error, maybe redirect to a generic profile or dashboard
    redirect('/dashboard');
  }

  const rolePath = fullUser.role.toLowerCase();
  
  // This logic is a bit naive for a real app but works for demo
  // It maps roles to profile paths
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

  redirect(`/profiles/${profilePathSegment}/${fullUser.id}`);
}
