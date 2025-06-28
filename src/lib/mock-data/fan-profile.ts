'use client';

export const fanUser = {
  name: 'Верный Ларри',
  email: 'larry.fan@prodvor.com',
  role: 'Болельщик',
  avatar: 'https://placehold.co/100x100.png',
};

export const fanAchievements = [
  { name: "Первая подписка", icon: "UserPlus", description: "Подписаться на первую команду или игрока.", unlocked: true },
  { name: "Суперфанат", icon: "Star", description: "Подписаться на 10 команд.", unlocked: true },
  { name: "Живой зритель", icon: "Ticket", description: "Посетить матч турнира вживую.", unlocked: true },
  { name: "Активный болельщик", icon: "MessageSquare", description: "Оставить 100 комментариев на страницах матчей.", unlocked: false },
  { name: "Верность", icon: "Heart", description: "Быть фанатом команды более года.", unlocked: false },
  { name: "Фанат года", icon: "Award", description: "Быть избранным Фанатом года по мнению команды.", unlocked: false },
];
