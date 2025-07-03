

export const teamsSeekingSponsorship = [
    {
        slug: 'dvotovyie-atlety',
        name: 'Дворовые Атлеты',
        logo: 'https://placehold.co/100x100.png',
        logoHint: 'athletic team logo',
        game: 'Футбол',
        pitch: 'Мы - топ-1 футбольная команда платформы, ищем партнеров для участия в городских лигах. Наша аудитория - 50,000+ подписчиков.',
        needs: 'Финансирование поездок на матчи, брендированная форма.'
    },
    {
        slug: 'sokoly',
        name: 'Соколы',
        logo: 'https://placehold.co/100x100.png',
        logoHint: 'falcon logo',
        game: 'Баскетбол',
        pitch: 'Стабильная команда в топ-3 по баскетболу, специализируемся на уличных турнирах. Ищем спонсора для приобретения нового оборудования.',
        needs: 'Оплата тренировочной площадки, новые мячи и форма.'
    },
    {
        slug: 'torpedo',
        name: 'Торпедо',
        logo: 'https://placehold.co/100x100.png',
        logoHint: 'torpedo logo',
        game: 'Хоккей',
        pitch: 'Молодая и перспективная хоккейная команда, показывающая взрывной рост. Идеально для брендов, ориентированных на молодежь.',
        needs: 'Оплата аренды льда, зарплатный фонд.'
    }
];


export const sponsoredTeams = [
    {
        slug: 'dvotovyie-atlety',
        name: 'Дворовые Атлеты',
        logo: 'https://placehold.co/100x100.png',
        logoHint: 'athletic team logo',
        game: 'Футбол',
        since: '2024-05-15',
        investment: '15,000 PD',
    },
    {
        slug: 'sokoly',
        name: 'Соколы',
        logo: 'https://placehold.co/100x100.png',
        logoHint: 'falcon logo',
        game: 'Баскетбол',
        since: '2024-06-01',
        investment: '10,000 PD',
    }
];

export type SponsorshipOffer = {
  id: string;
  sponsor: {
    name: string;
    logo: string;
    logoHint: string;
  };
  offer: string;
  status: 'pending' | 'accepted' | 'declined';
};

export const incomingSponsorshipOffers: SponsorshipOffer[] = [
  {
    id: 'offer-1',
    sponsor: {
      name: 'G-Fuel',
      logo: 'https://placehold.co/100x100.png',
      logoHint: 'energy drink logo',
    },
    offer: '5,000 PD/месяц за лого на форме и 2 поста в соцсетях.',
    status: 'pending',
  },
  {
    id: 'offer-2',
    sponsor: {
      name: 'Razer',
      logo: 'https://placehold.co/100x100.png',
      logoHint: 'gaming peripherals logo',
    },
    offer: 'Полный комплект девайсов для 5 игроков.',
    status: 'pending',
  },
];
