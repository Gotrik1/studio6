
export const venuesList = [
    {
        id: "venue-1",
        name: "Футбольное поле 'Центральный'",
        address: "Москва, ул. Центральная, 1",
        surfaceType: "Искусственный газон",
        price: "2000 PD/час",
        image: "https://placehold.co/600x400.png",
        imageHint: "football field",
        features: ["Освещение", "Раздевалки"],
        rating: 4.8
    },
    {
        id: "venue-2",
        name: "Баскетбольная площадка 'Динамо'",
        address: "Москва, ул. Спортивная, 5",
        surfaceType: "Резиновое покрытие",
        price: "1500 PD/час",
        image: "https://placehold.co/600x400.png",
        imageHint: "basketball court",
        features: ["Освещение"],
        rating: 4.6
    },
    {
        id: "venue-3",
        name: "Коробка 'На районе'",
        address: "Москва, ул. Дворовая, 10",
        surfaceType: "Асфальт",
        price: "Бесплатно",
        image: "https://placehold.co/600x400.png",
        imageHint: "street court",
        features: [],
        rating: 3.9
    }
];

export type Venue = (typeof venuesList)[0];
