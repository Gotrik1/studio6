// The user object is now obsolete as data is fetched from the backend.
// Achievements are kept for now as they are still mock-based.

export const organizerAchievements = [
  {
    name: "Первый турнир",
    description: "Организовать первый турнир",
    icon: "Trophy",
    unlocked: true,
  },
  {
    name: "Полный аншлаг",
    description: "Собрать максимальное количество участников",
    icon: "Users",
    unlocked: true,
  },
  {
    name: "Регулярные события",
    description: "Провести 5 турниров за сезон",
    icon: "CalendarPlus",
    unlocked: false,
  },
  {
    name: "Крупный калибр",
    description: "Организовать турнир с призовым фондом >$10k",
    icon: "Star",
    unlocked: false,
  },
  {
    name: "Мастер организации",
    description: "Получить средний рейтинг турниров 4.5+ (10+ событий)",
    icon: "Award",
    unlocked: false,
  },
  {
    name: "Свои правила",
    description: "Заполнить регламент для 3 турниров",
    icon: "ClipboardList",
    unlocked: true,
  },
];
