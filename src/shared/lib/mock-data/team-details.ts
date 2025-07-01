

export const teamRoster = [
    { id: 1, name: 'Superuser', role: 'Капитан / IGL', rating: 'Immortal 3', status: 'Онлайн', avatar: 'https://placehold.co/100x100.png' },
    { id: 2, name: 'Echo', role: 'Дуэлянт', rating: 'Immortal 2', status: 'Онлайн', avatar: 'https://placehold.co/100x100.png' },
    { id: 3, name: 'Viper', role: 'Страж', rating: 'Immortal 2', status: 'В игре', avatar: 'https://placehold.co/100x100.png' },
    { id: 4, name: 'Reaper', role: 'Зачинщик', rating: 'Immortal 1', status: 'Отошел', avatar: 'https://placehold.co/100x100.png' },
    { id: 5, name: 'Blaze', role: 'Специалист', rating: 'Ascendant 3', status: 'Оффлайн', avatar: 'https://placehold.co/100x100.png' },
];

export const challenges = {
    incoming: [
        { 
            id: 1, 
            opponent: { name: 'Стальные Титаны', logo: 'https://placehold.co/100x100.png', logoHint: 'titan logo' },
            time: '28 июля, 20:00',
            venue: 'Онлайн',
        }
    ],
    outgoing: [
         { 
            id: 2, 
            opponent: { name: 'Ледяные Волки', logo: 'https://placehold.co/100x100.png', logoHint: 'wolf logo' },
            status: 'Ожидание',
        }
    ]
};
