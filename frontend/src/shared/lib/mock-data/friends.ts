// This file's data for friendsList and pendingRequests is now served by the backend from a real database.
// The data is kept here for 'findSuggestions' which is still a mock.

export const suggestedFriends = [
    {
        id: 'suggested-1',
        name: 'ColdSniper',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'esports player',
        reason: 'Общая команда: Ледяные Волки',
    },
    {
        id: 'suggested-2',
        name: 'Foxy',
        avatar: 'https://placehold.co/100x100.png',
        avatarHint: 'esports player',
        reason: 'Общий турнир: Summer Kickoff',
    },
];

export const friendsList = [];
export const pendingRequests = [];
