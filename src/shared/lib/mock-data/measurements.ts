
export type Measurement = {
    id: string;
    date: string;
    weight: number;
    bodyFat?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thigh?: number;
};

export const measurementsHistory: Measurement[] = [
    {
        id: 'm1',
        date: '2024-07-01',
        weight: 85.2,
        bodyFat: 15.5,
        chest: 110,
        waist: 85,
        hips: 100,
        biceps: 38,
        thigh: 60,
    },
    {
        id: 'm2',
        date: '2024-07-15',
        weight: 84.5,
        bodyFat: 15.1,
        chest: 111,
        waist: 84,
        hips: 100,
        biceps: 38.5,
        thigh: 60.5,
    },
    {
        id: 'm3',
        date: '2024-08-01',
        weight: 84.2,
        bodyFat: 14.8,
        chest: 112,
        waist: 83,
        hips: 101,
        biceps: 39,
        thigh: 61,
    },
];
