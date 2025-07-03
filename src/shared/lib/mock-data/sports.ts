
export type Sport = {
    id: string;
    name: string;
    icon: string;
    category: 'Командный' | 'Некомандный' | 'Киберспорт';
};

export const sportsList: Sport[] = [
    // Киберспорт
    { id: 'valorant', name: 'Valorant', icon: 'Crosshair', category: 'Киберспорт' },
    { id: 'csgo', name: 'CS:GO 2', icon: 'Crosshair', category: 'Киберспорт' },
    { id: 'dota2', name: 'Dota 2', icon: 'Swords', category: 'Киберспорт' },

    // Командные виды спорта
    { id: 'football', name: 'Футбол', icon: 'Futbol', category: 'Командный' },
    { id: 'basketball', name: 'Баскетбол', icon: 'Dribbble', category: 'Командный' },
    { id: 'volleyball', name: 'Волейбол', icon: 'Volleyball', category: 'Командный' },
    { id: 'rugby', name: 'Регби', icon: 'Circle', category: 'Командный' },
    { id: 'handball', name: 'Гандбол', icon: 'Hand', category: 'Командный' },
    { id: 'hockey', name: 'Хоккей', icon: 'Hockey', category: 'Командный' },
    { id: 'american_football', name: 'Американский футбол', icon: 'Shield', category: 'Командный' },
    { id: 'beach_football', name: 'Пляжный футбол', icon: 'Sun', category: 'Командный' },
    { id: 'beach_volleyball', name: 'Пляжный волейбол', icon: 'Sun', category: 'Командный' },
    { id: 'sumo', name: 'Сумо', icon: 'Users', category: 'Командный' },
    { id: 'curling', name: 'Кёрлинг', icon: 'Disc', category: 'Командный' },
    { id: 'frisbee', name: 'Фрисби', icon: 'Disc', category: 'Командный' },
    { id: 'martial_arts_team', name: 'Бойцовские виды спорта (командные)', icon: 'Swords', category: 'Командный' },
    { id: 'futsal', name: 'Мини-футбол', icon: 'Futbol', category: 'Командный' },
    { id: 'floorball', name: 'Флорбол', icon: 'Hockey', category: 'Командный' },
    { id: 'pentathlon_team', name: 'Пентатлон (командный)', icon: 'Award', category: 'Командный' },

    // Некомандные виды спорта
    { id: 'athletics', name: 'Лёгкая атлетика', icon: 'Footprints', category: 'Некомандный' },
    { id: 'tennis', name: 'Теннис', icon: 'Circle', category: 'Некомандный' },
    { id: 'table_tennis', name: 'Настольный теннис', icon: 'Circle', category: 'Некомандный' },
    { id: 'cycling', name: 'Велоспорт', icon: 'Bike', category: 'Некомандный' },
    { id: 'boxing', name: 'Бокс', icon: 'Hand', category: 'Некомандный' },
    { id: 'swimming', name: 'Плавание', icon: 'Waves', category: 'Некомандный' },
    { id: 'taekwondo', name: 'Тхэквондо', icon: 'Hand', category: 'Некомандный' },
    { id: 'badminton', name: 'Бадминтон', icon: 'Feather', category: 'Некомандный' },
    { id: 'gymnastics', name: 'Гимнастика', icon: 'PersonStanding', category: 'Некомандный' },
    { id: 'figure_skating', name: 'Фигурное катание', icon: 'Star', category: 'Некомандный' },
    { id: 'triathlon', name: 'Триатлон', icon: 'Swords', category: 'Некомандный' },
    { id: 'chess', name: 'Шахматы', icon: 'Square', category: 'Некомандный' },
    { id: 'fencing', name: 'Фехтование', icon: 'Swords', category: 'Некомандный' },
    { id: 'pilates', name: 'Пилатес', icon: 'PersonStanding', category: 'Некомандный' },
    { id: 'orienteering', name: 'Спортивное ориентирование', icon: 'Map', category: 'Некомандный' },
    { id: 'darts', name: 'Дартс', icon: 'Target', category: 'Некомандный' },
    { id: 'skateboarding', name: 'Скейтбординг', icon: 'Move', category: 'Некомандный' },
    { id: 'surfing', name: 'Серфинг', icon: 'Waves', category: 'Некомандный' },
    { id: 'running', name: 'Беговые виды спорта', icon: 'Footprints', category: 'Некомандный' },
    { id: 'parachuting', name: 'Парашютный спорт', icon: 'Parachute', category: 'Некомандный' },
    { id: 'golf', name: 'Гольф', icon: 'Flag', category: 'Некомандный' },
    { id: 'base_jumping', name: 'Бейсджампинг', icon: 'Mountain', category: 'Некомандный' },
    { id: 'sport_swimming', name: 'Спортивное плавание', icon: 'Waves', category: 'Некомандный' },
    { id: 'dancing', name: 'Танцы', icon: 'Music', category: 'Некомандный' },
    { id: 'bmx', name: 'BMX', icon: 'Bike', category: 'Некомандный' },
    { id: 'skiing', name: 'Лыжи', icon: 'MountainSnow', category: 'Некомандный' },
    { id: 'biathlon', name: 'Биатлон', icon: 'Crosshair', category: 'Некомандный' },
    { id: 'speed_skating', name: 'Конькобежный спорт', icon: 'Gauge', category: 'Некомандный' },
    { id: 'snowboarding', name: 'Сноубординг', icon: 'Snowflake', category: 'Некомандный' },
    { id: 'alpine_skiing', name: 'Горные лыжи', icon: 'MountainSnow', category: 'Некомандный' },
    { id: 'sport_shooting', name: 'Спортивная стрельба', icon: 'Crosshair', category: 'Некомандный' },
];
