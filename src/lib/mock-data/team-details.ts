import { Shield, Coins, BarChart3, Calendar } from 'lucide-react';

export const teamRoster = [
    { id: '1', name: "Alex 'CyberSlasher' Doe", role: "Капитан", rating: "2450 ELO", status: "Онлайн", avatar: 'https://placehold.co/40x40.png' },
    { id: '2', name: "Maria 'Shadow' Petrova", role: "Смоукер", rating: "2380 ELO", status: "Онлайн", avatar: 'https://placehold.co/40x40.png' },
    { id: '3', name: "Ivan 'Beast' Orlov", role: "Страж", rating: "2350 ELO", status: "В игре", avatar: 'https://placehold.co/40x40.png' },
    { id: '4', name: "Olga 'Phoenix' Smirnova", role: "Зачинщик", rating: "2310 ELO", status: "Отошел", avatar: 'https://placehold.co/40x40.png' },
    { id: '5', name: "Dmitry 'Gadget' Kuznetsov", role: "Дуэлянт", rating: "2290 ELO", status: "Оффлайн", avatar: 'https://placehold.co/40x40.png' },
];

export const teamActivity = [
    { id: 'act-1', icon: Shield, text: "Кибер Орлы победили команду Ледяные Драконы со счетом 2-1.", timestamp: "2 часа назад" },
    { id: 'act-2', icon: Coins, text: "Alex 'CyberSlasher' Doe пополнил казну команды на 1000 PD.", timestamp: "1 день назад" },
    { id: 'act-3', icon: BarChart3, text: "Maria 'Shadow' Petrova достигла рейтинга 2380 ELO.", timestamp: "2 дня назад" },
    { id: 'act-4', icon: Calendar, text: "Следующий матч против Стальные Титаны назначен на 05.10.2024.", timestamp: "3 дня назад" },
];

export const challenges = {
    incoming: [
        { id: 'inc-1', opponent: { name: 'Вихревые Гадюки', logo: 'https://placehold.co/40x40.png', logoHint: 'snake logo' }, venue: 'Футбольное поле "Центральное"', date: '2024-10-05', time: '19:00' },
    ],
    outgoing: [
        { id: 'out-1', opponent: { name: 'Стальные Титаны', logo: 'https://placehold.co/40x40.png', logoHint: 'robot titan' }, status: 'Ожидает ответа' },
    ]
};

export const teamPdHistory = [
    { id: 'tpd-1', timestamp: '2024-09-26T12:00:00Z', source: 'Взнос капитана', value: 1000, user: "Alex 'CyberSlasher' Doe" },
    { id: 'tpd-2', timestamp: '2024-09-25T19:00:00Z', source: 'Победа в турнире', value: 5000, user: "Система" },
    { id: 'tpd-3', timestamp: '2024-09-24T10:00:00Z', source: 'Покупка командной рамки', value: -1500, user: "Alex 'CyberSlasher' Doe" },
    { id: 'tpd-4', timestamp: '2024-09-23T15:00:00Z', source: 'Спонсорский бонус', value: 2000, user: "Sponsor Corp" },
];

export const joinRequests = [
    { id: 'join-1', name: 'NewbiePlayer123', avatar: 'https://placehold.co/40x40.png', avatarHint: 'anonymous gamer', role: 'Дуэлянт', rating: 1800 },
    { id: 'join-2', name: 'AspiringPro', avatar: 'https://placehold.co/40x40.png', avatarHint: 'pro gamer headset', role: 'Смоукер', rating: 2100 },
];
