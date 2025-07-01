import { userList } from '@/shared/lib/mock-data/users';

// This is a mock function. In a real app, it would fetch from a database.
export const getUserById = (id: string) => {
    // The userList in mock data is 1-indexed for its id.
    const user = userList.find(user => user.id === id);
    return user || null;
};
