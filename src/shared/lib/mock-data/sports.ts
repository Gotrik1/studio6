export type Sport = {
    id: string;
    name: string;
    icon: string;
    type: 'Киберспорт' | 'Спорт';
};

export const sportsList: Sport[] = [
    // Киберспорт
    { id: 'valorant', name: 'Valorant', icon: 'Gamepad2', type: 'Киберспорт' },
    { id: 'csgo', name: 'CS:GO 2', icon: 'Gamepad2', type: 'Киберспорт' },
    { id: 'dota2', name: 'Dota 2', icon: 'Gamepad2', type: 'Киберспорт' },
    { id: 'league_of_legends', name: 'League of Legends', icon: 'Gamepad2', type: 'Киберспорт' },
    { id: 'apex_legends', name: 'Apex Legends', icon: 'Gamepad2', type: 'Киберспорт' },
    { id: 'fortnite', name: 'Fortnite', icon: 'Gamepad2', type: 'Киберспорт' },
    { id: 'street_fighter', name: 'Street Fighter 6', icon: 'Gamepad2', type: 'Киберспорт' },
    
    // Командный спорт
    { id: 'football', name: 'Футбол', icon: 'Futbol', type: 'Спорт' },
    { id: 'basketball', name: 'Баскетбол', icon: 'Dribbble', type: 'Спорт' },
    { id: 'hockey', name: 'Хоккей', icon: 'Hockey', type: 'Спорт' },
    { id: 'volleyball', name: 'Волейбол', icon: 'Volleyball', type: 'Спорт' },

    // Индивидуальный спорт
    { id: 'tennis', name: 'Теннис', icon: 'Circle', type: 'Спорт' },
    { id: 'table_tennis', name: 'Настольный теннис', icon: 'Circle', type: 'Спорт' },
    { id: 'chess', name: 'Шахматы', icon: 'Square', type: 'Спорт' },
    { id: 'checkers', name: 'Шашки', icon: 'Square', type: 'Спорт' },
    { id: 'running', name: 'Бег', icon: 'Footprints', type: 'Спорт' },
];