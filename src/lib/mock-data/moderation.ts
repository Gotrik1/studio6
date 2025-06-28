
export const reportsQueue = [
  {
    id: 'rep-1',
    reportedUser: {
      name: "Maria 'Shadow' Petrova",
      avatar: 'https://placehold.co/40x40.png',
      avatarHint: 'female gamer',
      profileUrl: '/administration/player'
    },
    reportedBy: {
      name: "Ivan 'Beast' Orlov",
      avatar: 'https://placehold.co/40x40.png',
      avatarHint: 'focused gamer',
      profileUrl: '/administration/player'
    },
    reason: 'Токсичное поведение и оскорбления в чате матча.',
    context: `[18:32] Maria 'Shadow' Petrova: Ты вообще играть умеешь?
[18:32] Maria 'Shadow' Petrova: Просто бесполезный кусок мяса.
[18:33] Ivan 'Beast' Orlov: Успокойся, это всего лишь игра.
[18:33] Maria 'Shadow' Petrova: Закрой свой рот, нуб.`,
    timestamp: '2 часа назад'
  },
  {
    id: 'rep-2',
    reportedUser: {
      name: "BadGamer228",
      avatar: 'https://placehold.co/40x40.png',
      avatarHint: 'anonymous person',
      profileUrl: '#'
    },
    reportedBy: {
      name: "ЧестныйИгрок",
      avatar: 'https://placehold.co/40x40.png',
      avatarHint: 'gamer profile',
      profileUrl: '#'
    },
    reason: 'Подозрение на использование читов (wallhack).',
    context: 'Игрок постоянно предугадывал позиции нашей команды, стреляя через дым без предварительной информации. На повторе видно, как его прицел дергается на модели игроков за стенами.',
    timestamp: 'Вчера, 21:15'
  },
  {
    id: 'rep-3',
    reportedUser: {
      name: "SpamMaster",
      avatar: 'https://placehold.co/40x40.png',
      avatarHint: 'robot icon',
      profileUrl: '#'
    },
    reportedBy: {
      name: "Alex 'CyberSlasher' Doe",
      avatar: 'https://placehold.co/40x40.png',
      avatarHint: 'esports player',
      profileUrl: '/profile'
    },
    reason: 'Спам и реклама в личных сообщениях.',
    context: `[ЛС от SpamMaster]: Привет! Хочешь заработать на ставках? Переходи на мой сайт sketchy-bets.com и получи бонус!`,
    timestamp: '3 дня назад'
  }
];

export type Report = (typeof reportsQueue)[0];
