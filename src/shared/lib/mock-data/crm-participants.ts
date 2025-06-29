
export const crmParticipants = [
    { id: 'team-1', name: 'Кибер Орлы', status: 'Подтвержден', captain: 'Superuser' },
    { id: 'team-2', name: 'Ледяные Волки', status: 'Подтвержден', captain: 'ColdSniper' },
    { id: 'team-3', name: 'Теневые Лисы', status: 'Ожидает подтверждения', captain: 'Foxy' },
    { id: 'team-4', name: 'Стальные Титаны', status: 'Подтвержден', captain: 'TheWall' },
];
export type CrmParticipant = (typeof crmParticipants)[0];
