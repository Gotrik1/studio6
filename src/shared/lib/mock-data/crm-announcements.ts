export type CrmAnnouncement = {
    id: string;
    subject: string;
    timestamp: string;
    sentTo: number;
};

export const crmAnnouncements: CrmAnnouncement[] = [
    {
        id: 'ann-1',
        subject: 'Напоминание о подтверждении составов',
        timestamp: '2024-07-28T10:00:00Z',
        sentTo: 16
    },
    {
        id: 'ann-2',
        subject: 'Обновление правил турнира',
        timestamp: '2024-07-25T15:30:00Z',
        sentTo: 16
    }
];
