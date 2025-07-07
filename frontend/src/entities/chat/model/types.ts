export type ChatContact = {
    id: string;
    teamId: string;
    name: string;
    avatar: string;
    avatarHint: string;
    lastMessage: string;
    timestamp: string;
    isOnline: boolean;
    type: 'team' | 'user';
};

export type ChatMessage = {
    id: string;
    content: string;
    createdAt: string;
    chatId: string;
    author: {
        id: string;
        name:string;
        avatar: string | null;
    };
};
