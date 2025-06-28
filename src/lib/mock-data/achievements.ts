export const achievementCatalog: { name: string; description: string; icon: "Trophy" | "Star" | "Shield" | "Gem" | "Crown" | "Rocket" | "Swords" | "Medal" | "Award"; rarity: "Обычная" | "Редкая" | "Эпическая"; points: number }[] = [
    // Личные ачивки
    { name: "Диванный спецназ", description: "Первая заявка на матч. Снял кроссовки с балкона и готов к бою!", icon: "Medal", rarity: "Обычная", points: 10 },
    { name: "Беги, лес, беги!", description: "Участие в 5 матчах. Тебя уже узнают по крикам 'Я НЕ УСПЕВАЮ!'", icon: "Rocket", rarity: "Обычная", points: 25 },
    { name: "Железный мочевой", description: "Не выходить из игры 2 часа. Ты выдержал. Но твой организм ненавидит тебя.", icon: "Shield", rarity: "Обычная", points: 30 },
    { name: "Криворукий снайпер", description: "10 промахов подряд. Ты – антиталант. Но мы верим!", icon: "Rocket", rarity: "Обычная", points: -5 },
    
    // Командные ачивки
    { name: "Волки ночи", description: "Победа в матче после 22:00. Ваши соперники уснули. Вы – нет.", icon: "Swords", rarity: "Обычная", points: 15 },
    { name: "Кара небес", description: "Вызов команды на 2 ранга выше. Вы бросили вызов судьбе. И пока не проиграли.", icon: "Crown", rarity: "Редкая", points: 50 },
    { name: "Клондайк солянок", description: "3 матча подряд без замен. Ваша выносливость пугает даже медиков.", icon: "Award", rarity: "Обычная", points: 20 },
    { name: "Позорный слив", description: "Проиграли 0:10. Это не поражение. Это... ладно, это поражение.", icon: "Shield", rarity: "Обычная", points: -30 },

    // Общие и весёлые
    { name: "Дал жару!", description: "Первая победа в рейтинговом матче.", icon: "Trophy", rarity: "Редкая", points: 150 },
    { name: "3 из 3", description: "Победы в трёх матчах подряд.", icon: "Star", rarity: "Эпическая", points: 300 },
    { name: "Без сна", description: "Провёл игру в 6 утра.", icon: "Gem", rarity: "Эпическая", points: 500 },
    { name: "Прямой эфир", description: "Стрим с 10+ зрителями.", icon: "Rocket", rarity: "Редкая", points: 100 },
];
