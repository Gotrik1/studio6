

const mockRoster = [
    { id: 1, name: 'Superuser', role: 'Капитан / IGL', rating: 'Immortal 3', status: 'Онлайн', avatar: 'https://placehold.co/100x100.png' },
    { id: 2, name: 'Echo', role: 'Дуэлянт', rating: 'Immortal 2', status: 'Онлайн', avatar: 'https://placehold.co/100x100.png' },
    { id: 3, name: 'Viper', role: 'Страж', rating: 'Immortal 2', status: 'В игре', avatar: 'https://placehold.co/100x100.png' },
    { id: 4, name: 'Reaper', role: 'Зачинщик', rating: 'Immortal 1', status: 'Отошел', avatar: 'https://placehold.co/100x100.png' },
    { id: 5, name: 'Blaze', role: 'Специалист', rating: 'Ascendant 3', status: 'Оффлайн', avatar: 'https://placehold.co/100x100.png' },
];

export const crmParticipants = [
    { id: 'team-1', name: 'Кибер Орлы', status: 'Подтвержден' as const, captain: 'Superuser', roster: mockRoster },
    { id: 'team-2', name: 'Ледяные Волки', status: 'Подтвержден' as const, captain: 'ColdSniper', roster: mockRoster.slice(0, 4) },
    { id: 'team-3', name: 'Теневые Лисы', status: 'Ожидает подтверждения' as const, captain: 'Foxy', roster: mockRoster.slice(0, 5) },
    { id: 'team-4', name: 'Стальные Титаны', status: 'Подтвержден' as const, captain: 'TheWall', roster: mockRoster.slice(0, 3) },
];
export type CrmParticipant = (typeof crmParticipants)[0];
