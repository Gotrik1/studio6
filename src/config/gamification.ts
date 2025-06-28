
export const PD_RATES = {
  WELCOME_BONUS: 25,
  MATCH_COMPLETION: 10,
  GOAL_ASSIST_SAVE: 5,
  HELP_NEWBIE: 7,
  INVITE_FRIEND: 10,
  REFEREE_MATCH: 15,
  MEDIA_POST_TIER_1: 3,
  MEDIA_POST_TIER_2: 2,
  MEDIA_POST_TIER_3: 1,
};

export const PD_LIMITS = {
  MEDIA_POST_PER_DAY: 3,
  MAX_PER_ACTIVITY_PER_DAY: 40,
};

export type PD_SOURCE_TYPE = keyof typeof PD_RATES;

export const PD_SOURCE_DETAILS: { [key in PD_SOURCE_TYPE]?: { description: string } } = {
    WELCOME_BONUS: { description: "Приветственный бонус за регистрацию" },
    MATCH_COMPLETION: { description: "Завершение матча" },
    GOAL_ASSIST_SAVE: { description: "Гол/Ассист/Сейв" },
    MEDIA_POST_TIER_1: { description: "Публикация контента (1-й раз)" },
    MEDIA_POST_TIER_2: { description: "Публикация контента (2-й раз)" },
    MEDIA_POST_TIER_3: { description: "Публикация контента (3-й раз)" },
    HELP_NEWBIE: { description: "Помощь новичку" },
    INVITE_FRIEND: { description: "Приглашение друга" },
    REFEREE_MATCH: { description: "Судейство матча" },
};
