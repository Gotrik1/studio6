
export type PD_SOURCE_TYPE = 
    | 'REGISTRATION'
    | 'PROFILE_COMPLETION'
    | 'FIRST_MATCH'
    | 'WIN_MATCH'
    | 'CREATE_TEAM'
    | 'JOIN_TOURNAMENT'
    | 'QUEST_COMPLETION';

export const PD_SOURCE_DETAILS: Record<PD_SOURCE_TYPE, { description: string }> = {
    REGISTRATION: { description: 'Регистрация на платформе' },
    PROFILE_COMPLETION: { description: 'Заполнение профиля' },
    FIRST_MATCH: { description: 'Первый сыгранный матч' },
    WIN_MATCH: { description: 'Победа в матче' },
    CREATE_TEAM: { description: 'Создание команды' },
    JOIN_TOURNAMENT: { description: 'Участие в турнире' },
    QUEST_COMPLETION: { description: 'Выполнение квеста "Новичок"' },
};
