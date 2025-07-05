export type Promotion = {
    id: string;
    name: string;
    description: string;
    prize: string;
    sponsor: {
        name: string;
        logo: string;
    } | null;
    imageDataUri: string;
    imageHint: string;
    endDate: string;
    cost: string;
};
