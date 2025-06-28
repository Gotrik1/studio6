
export const PD_RATES = {
  MATCH_COMPLETION: 10,
  GOAL_ASSIST_SAVE: 5,
  MEDIA_POST: 3,
  HELP_NEWBIE: 7,
  INVITE_FRIEND: 10,
  REFEREE_MATCH: 15,
};

export const PD_LIMITS = {
  MEDIA_POST_PER_DAY: 3,
  MAX_PER_ACTIVITY_PER_DAY: 40,
};

export type PD_SOURCE_TYPE = keyof typeof PD_RATES;

export const PD_SOURCE_DETAILS: { [key in PD_SOURCE_TYPE]: { description: string } } = {
    MATCH_COMPLETION: { description: "Завершение матча" },
    GOAL_ASSIST_SAVE: { description: "Гол/Ассист/Сейв" },
    MEDIA_POST: { description: "Публикация контента" },
    HELP_NEWBIE: { description: "Помощь новичку" },
    INVITE_FRIEND: { description: "Приглашение друга" },
    REFEREE_MATCH: { description: "Судейство матча" },
};
