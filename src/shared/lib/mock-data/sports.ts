import type { LucideIcon } from 'lucide-react';

export type Sport = {
    id: string;
    name: string;
    icon: string;
    type: 'Киберспорт' | 'Спорт';
};

export const sportsList: Sport[] = [
    { id: 'valorant', name: 'Valorant', icon: 'Gamepad2', type: 'Киберспорт' },
    { id: 'csgo', name: 'CS:GO 2', icon: 'Gamepad2', type: 'Киберспорт' },
    { id: 'dota2', name: 'Dota 2', icon: 'Gamepad2', type: 'Киберспорт' },
    { id: 'football', name: 'Футбол', icon: 'Futbol', type: 'Спорт' },
    { id: 'basketball', name: 'Баскетбол', icon: 'Dribbble', type: 'Спорт' },
];
