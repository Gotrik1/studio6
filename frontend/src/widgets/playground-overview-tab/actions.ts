'use server';

import { getSession } from '@/features/auth/session';
import { getPlayerProfile } from '@/entities/user/api/get-user';
import { setHomePlayground as apiSetHomePlayground } from '@/entities/team/api/teams';

export async function setHomePlaygroundAction(playgroundId: string) {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, error: 'Вы не авторизованы.' };
  }
  const profile = await getPlayerProfile(session.user.id);
  const team = profile?.user.teams.find((t) => t.role === 'Капитан');

  if (!team) {
    return {
      success: false,
      error: 'Вы должны быть капитаном команды, чтобы выбрать домашнюю площадку.',
    };
  }

  return await apiSetHomePlayground(team.id, playgroundId);
}
