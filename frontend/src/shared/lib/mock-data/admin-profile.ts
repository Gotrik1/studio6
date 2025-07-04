export const adminUser = {
  id: 'admin-001',
  name: 'Superuser',
  email: 'admin@example.com',
  role: 'Администратор',
  avatar: 'https://placehold.co/100x100.png',
};

export const adminAchievements = [
    { name: 'Властелин Системы', description: 'Получить доступ к панели администратора', icon: 'Shield', unlocked: true },
    { name: 'Чистота и Порядок', description: 'Закрыть 100 жалоб', icon: 'Gavel', unlocked: true },
    { name: 'Рост Платформы', description: 'Достичь 1000 зарегистрированных пользователей', icon: 'Users', unlocked: true },
    { name: 'Стабильность', description: 'Обеспечить 99.9% времени работы сервера за месяц', icon: 'Server', unlocked: true },
    { name: 'Финансовый Гуру', description: 'Достичь месячного дохода в $10,000', icon: 'BarChart3', unlocked: false },
    { name: 'Верховный Судья', description: 'Разрешить 50 спорных матчей', icon: 'ArrowUpCircle', unlocked: false },
];
