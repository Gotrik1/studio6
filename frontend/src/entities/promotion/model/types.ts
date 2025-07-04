export type Promotion = {
    id: string;
    title: string;
    description: string;
    prize: string;
    sponsor: {
        name: string;
        logo: string;
    } | null;
    image: string;
    imageHint: string;
    endDate: string;
};
