export type Playground = {
    id: string;
    name: string;
    address: string;
    type: string;
    coverImage: string | null;
    coverImageHint: string | null;
    surface: string;
    features: string[];
    rating: number;
    checkIns: number;
    status: 'APPROVED' | 'PENDING_MODERATION';
    creator: {
        name: string;
        avatar: string | null;
    };
};

export type PlaygroundReview = {
    id: string;
    author: {
        name: string;
        avatar: string | null;
    };
    rating: number;
    comment: string;
    timestamp: string;
};
