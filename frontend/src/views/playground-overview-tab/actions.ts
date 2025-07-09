"use server";

import { getSession } from "@/features/auth/session";
import { getPlayerProfile } from "@/entities/user/api/get-user";
import { setHomePlayground as apiSetHomePlayground } from "@/entities/team/api/teams";
import { FetchResult } from "@/shared/lib/api-client";
import type { FullUserProfile } from "@/entities/user/model/types";

export async function setHomePlaygroundAction(
  playgroundId: string,
): Promise<FetchResult<unknown>> {
  const session = await getSession();
  if (!session?.user) {
    return {
      success: false,
      error: "Вы не авторизованы.",
      status: 401,
      data: null,
    };
  }
  const profileResult = await getPlayerProfile(session.user.id);

  if (!profileResult || !profileResult.user) {
    return {
      success: false,
      error: "Не удалось загрузить профиль.",
      status: 500,
      data: null,
    };
  }

  const profile: FullUserProfile = profileResult.user;

  const team = profile.teams.find((t) => t.role === "Капитан");

  if (!team) {
    return {
      success: false,
      error:
        "Вы должны быть капитаном команды, чтобы выбрать домашнюю площадку.",
      status: 403,
      data: null,
    };
  }

  return apiSetHomePlayground(team.id, playgroundId);
}
