export const contacts = [
    {
        id: 'contact-1',
        name: 'Echo',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'esports player',
        lastMessage: 'Да, я готов к завтрашней тренировке!',
        timestamp: '10 минут назад',
        isOnline: true,
    },
    {
        id: 'contact-2',
        name: 'Viper',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'esports player female',
        lastMessage: 'Отлично сыграли вчера, надо повторить.',
        timestamp: '1 час назад',
        isOnline: false,
    },
    {
        id: 'contact-3',
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
        { sender: 'other' as const, text: 'Привет! Готов к завтрашней тренировке в 19:00?' },
        { sender: 'me' as const, text: 'Привет! Да, буду на месте.' },
        { sender: 'other' as const, text: 'Отлично. Будем отрабатывать выходы на A.' },
        { sender: 'me' as const, text: 'Понял, посмотрю пару демок.' },
        { sender: 'other' as const, text: 'Да, я готов к завтрашней тренировке!' },
    ],
    'contact-2': [
        { sender: 'other' as const, text: 'Отлично сыграли вчера, надо повторить.' },
    ],
    'contact-3': [
         { sender: 'other' as const, text: 'Напоминаем, что регистрация на турнир Summer Kickoff закрывается завтра в 18:00. Убедитесь, что ваша команда подтвердила участие.' },
    ]
};

export type Contact = typeof contacts[0];
