export type Challenge = {
  id: string;
  title: string;
  description: string;
  discipline: string;
  wager: number;
  creator: {
    name: string;
    avatar: string;
    avatarHint: string;
  };
  opponent?: {
    name: string;
    avatar: string;
    avatarHint: string;
  };
  status: 'open' | 'in_progress' | 'completed';
  result?: string; // e.g. "Победа Superuser"
};

export const challengesList: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Дуэль на AWP 1v1',
    description: 'Ищу сильного снайпера для дуэли на карте awp_lego. Ставлю 100 PD на свою победу. Победитель забирает все.',
    discipline: 'CS:GO 2',
    wager: 100,
    creator: {
      name: 'ColdSniper',
      avatar: 'https://placehold.co/100x100.png',
      avatarHint: 'esports player',
    },
    status: 'open',
  },
  {
    id: 'challenge-2',
    title: 'Король трехочковых',
    description: 'Кто забьет больше трехочковых из 20 попыток? Проигравший платит 50 PD.',
    discipline: 'Баскетбол',
    wager: 50,
    creator: {
      name: 'Superuser',
      avatar: 'https://placehold.co/100x100.png',
      avatarHint: 'esports player',
    },
    status: 'in_progress',
    opponent: {
      name: 'Echo',
      avatar: 'https://placehold.co/100x100.png',
      avatarHint: 'esports player',
    },
  },
   {
    id: 'challenge-3',
    title: 'Пенальти до 5 голов',
    description: 'Товарищеский вызов на серию пенальти. Без ставок, на интерес.',
    discipline: 'Футбол',
    wager: 0,
    creator: {
      name: 'Reaper',
      avatar: 'https://placehold.co/100x100.png',
      avatarHint: 'esports player',
    },
    status: 'open',
  },
  {
    id: 'challenge-4',
    title: 'Дуэль на Sheriff',
    description: 'Дуэль 1 на 1 только на шерифах. Победил в прошлом вызове, ищу нового соперника.',
    discipline: 'Valorant',
    wager: 200,
    creator: {
      name: 'Viper',
      avatar: 'https://placehold.co/100x100.png',
      avatarHint: 'esports player female',
    },
    status: 'completed',
    opponent: {
       name: 'Foxy',
       avatar: 'https://placehold.co/100x100.png',
       avatarHint: 'esports player',
    },
    result: 'Победа Viper',
  },
];
