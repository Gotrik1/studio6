
export type Sport = {
    id: string;
    name: string;
    icon: string;
    type: 'Спорт';
};

export const sportsList: Sport[] = [
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
