export type Exercise = {
    id: string;
    name: string;
    description: string;
    category: string;
    equipment: string;
    image: string | null;
    imageHint: string | null;
    techniqueTips: string[];
    commonMistakes: string[];
    alternatives: string[];
};
