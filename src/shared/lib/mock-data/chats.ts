
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

export const messages = {
    'contact-1': [
        { sender: 'other' as const, name: 'Echo', avatar: 'https://placehold.co/100x100.png', text: 'Привет! Готов к завтрашней тренировке в 19:00?' },
        { sender: 'user' as const, name: 'Superuser', avatar: 'https://placehold.co/100x100.png', text: 'Привет! Да, буду на месте.' },
        { sender: 'other' as const, name: 'Echo', avatar: 'https://placehold.co/100x100.png', text: 'Отлично. Будем отрабатывать выходы на A.' },
        { sender: 'user' as const, name: 'Superuser', avatar: 'https://placehold.co/100x100.png', text: 'Понял, посмотрю пару демок.' },
        { sender: 'other' as const, name: 'Echo', avatar: 'https://placehold.co/100x100.png', text: 'Да, я готов к завтрашней тренировке!' },
    ],
    'contact-2': [
        { sender: 'other' as const, name: 'Viper', avatar: 'https://placehold.co/100x100.png', text: 'Отлично сыграли вчера, надо повторить.' },
    ],
    'contact-3': [
         { sender: 'other' as const, name: 'Организатор Турнира', avatar: 'https://placehold.co/100x100.png', text: 'Напоминаем, что регистрация на турнир Summer Kickoff закрывается завтра в 18:00. Убедитесь, что ваша команда подтвердила участие.' },
    ],
    'team-chat-1': [
        { sender: 'other' as const, name: 'Echo', avatar: 'https://placehold.co/100x100.png', text: 'Ребята, вчера отлично сыграли против Титанов, но на карте Split нам нужно лучше координировать выходы на B.' },
        { sender: 'other' as const, name: 'Viper', avatar: 'https://placehold.co/100x100.png', text: 'Согласна. Я посмотрю пару демок от про-игроков по этой теме.' },
        { sender: 'user' as const, name: 'Superuser', avatar: 'https://placehold.co/100x100.png', text: 'Хорошая идея. Давайте в субботу соберемся и разберем тактики.' },
    ]
};

export type Contact = (typeof contacts)[0];
