import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import UserProfileClient from '@/views/user-profile/client';
import type { User } from '@/shared/lib/types';
import { userList } from '@/shared/lib/mock-data/users';

// Augment the User type to include properties from the mock data
type DisplayUser = User & {
    id: string;
    status?: string;
    profileUrl: string;
    activitySummary: string;
    statsSummary:string;
};

export async function ProfilePage() {
    const sessionUser = await getSession();

    if (!sessionUser) {
        redirect('/auth');
    }

    // Find the full user object that corresponds to the session user.
    // This is necessary because the session cookie might not have all profile details.
    const userToDisplay = userList.find(u => u.email === sessionUser.email) as DisplayUser | undefined;

    if (!userToDisplay) {
        // This can happen if a user role (e.g. 'Тренер') is in the session but not in userList
        // We can create a fallback or render a generic error
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Не удалось найти данные профиля для вашей роли.</p>
            </div>
        );
    }
    
    return <UserProfileClient user={userToDisplay} isCurrentUser={true} />;
}
