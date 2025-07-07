export const quests = {
  daily: [
    {
      title: "Сыграть 1 матч",
      description: "Примите участие в любом матче.",
      reward: 10,
      goal: 1,
      href: "/matches",
    },
    {
      title: "Отметиться на площадке",
      description: "Найдите площадку и отметьтесь на ней.",
      reward: 15,
      goal: 1,
      href: "/playgrounds",
    },
  ],
  weekly: [
    {
      title: "Выиграть 3 матча",
      description: "Одержите победу в трех матчах за неделю.",
      reward: 100,
      goal: 3,
      href: "/matches",
    },
    {
      title: "Завершить 5 тренировок",
      description: "Отметьте 5 тренировок как выполненные.",
      reward: 120,
      goal: 5,
      href: "/training/log",
    },
  ],
  special: [
    {
      title: "Первая кровь",
      description: "Создайте свою первую команду.",
      reward: 200,
      goal: 1,
      href: "/teams/new",
    },
    {
      title: "Путь воина",
      description: "Зарегистрируйтесь на свой первый турнир.",
      reward: 300,
      goal: 1,
      href: "/tournaments",
    },
  ],
};
