
export const contacts = [
    {
        id: 'team-chat-1',
        type: 'team' as const,
        teamId: 'dvotovyie-atlety',
        name: 'Дворовые Атлеты',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'athletic team logo',
        lastMessage: 'Superuser: Давайте в субботу соберемся и разберем тактики.',
        timestamp: '25 минут назад',
        isOnline: true,
    },
    {
        id: 'contact-1',
        type: 'user' as const,
        name: 'Echo',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'esports player',
        lastMessage: 'Да, я готов к завтрашней тренировке!',
        timestamp: '10 минут назад',
        isOnline: true,
    },
    {
        id: 'contact-2',
        type: 'user' as const,
        name: 'Viper',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'esports player female',
        lastMessage: 'Отлично сыграли вчера, надо повторить.',
        timestamp: '1 час назад',
        isOnline: false,
    },
    {
        id: 'contact-3',
        type: 'user' as const,
        name: 'Организатор Турнира',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'event management logo',
        lastMessage: 'Напоминаем, что регистрация закрывается завтра.',
        timestamp: '3 часа назад',
        isOnline: true,
    },
];

export type Contact = (typeof contacts)[0];
