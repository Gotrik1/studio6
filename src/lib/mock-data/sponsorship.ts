
export const teamsSeekingSponsorship = [
  {
    slug: 'cyber-eagles',
    name: 'Кибер Орлы',
    logo: 'https://placehold.co/128x128.png',
    logoHint: 'eagle logo',
    game: 'Valorant',
    pitch: 'Мы — топ-1 команда платформы с огромной фанатской базой. Наше участие в турнирах гарантирует вашему бренду максимальную видимость среди молодой и вовлеченной аудитории. Мы ищем партнеров для долгосрочного сотрудничества.',
    needs: 'Финансирование поездок на LAN-турниры, брендированная форма.',
  },
  {
    slug: 'quantum-quasars',
    name: 'Квантовые Квазары',
    logo: 'https://placehold.co/128x128.png',
    logoHint: 'galaxy logo',
    game: 'Apex Legends',
    pitch: 'Наша команда специализируется на Apex Legends и показывает стабильный рост в рейтинге. Мы активно ведем стримы и создаем контент, привлекая новую аудиторию. Ищем спонсора для поддержки наших медийных инициатив.',
    needs: 'Оборудование для стриминга, призовой фонд для организуемых нами комьюнити-турниров.',
  },
];

export const currentSponsors = [
    { name: "TechSponsor", logo: "https://placehold.co/150x50.png", logoHint: 'corporate logo', tier: "Платиновый" },
    { name: "GamerGear", logo: "https://placehold.co/150x50.png", logoHint: 'gaming brand logo', tier: "Золотой" },
];

export const incomingOffers = [
    {
        id: 'offer-1',
        sponsorName: 'Energy Drink Co.',
        sponsorLogo: 'https://placehold.co/40x40.png',
        sponsorLogoHint: 'beverage logo',
        offerDetails: 'Предлагаем $5000 за размещение логотипа на форме и упоминания в социальных сетях в течение осеннего сезона.',
        status: 'Ожидает ответа',
    }
];

export type TeamSeekingSponsorship = (typeof teamsSeekingSponsorship)[0];
export type SponsorshipOffer = (typeof incomingOffers)[0];
