export type InventoryItem = {
    id: string;
    name: string;
    category: 'Обувь' | 'Одежда' | 'Аксессуары' | 'Периферия';
    type: string; // e.g., "Футбольные бутсы", "Игровая мышь"
    purchaseDate: string;
    lifespanMonths: number; // estimated lifespan in months
    image: string;
    imageHint: string;
};

export const inventory: InventoryItem[] = [
    {
        id: 'item-1',
        name: 'Nike Phantom Luna',
        category: 'Обувь',
        type: 'Футбольные бутсы',
        purchaseDate: '2024-03-15',
        lifespanMonths: 12,
        image: 'https://placehold.co/600x400.png',
        imageHint: 'football boots',
    },
    {
        id: 'item-2',
        name: 'Logitech G Pro X Superlight',
        category: 'Периферия',
        type: 'Игровая мышь',
        purchaseDate: '2023-11-20',
        lifespanMonths: 24,
        image: 'https://placehold.co/600x400.png',
        imageHint: 'gaming mouse',
    },
    {
        id: 'item-3',
        name: 'Wilson Evolution',
        category: 'Аксессуары',
        type: 'Баскетбольный мяч',
        purchaseDate: '2024-06-01',
        lifespanMonths: 18,
        image: 'https://placehold.co/600x400.png',
        imageHint: 'basketball ball',
    },
];
