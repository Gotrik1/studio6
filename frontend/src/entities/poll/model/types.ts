export type PollOption = {
    id: string;
    text: string;
    votes: number;
};

export type Poll = {
    id: string;
    title: string;
    question: string;
    options: PollOption[];
    totalVotes: number;
};
