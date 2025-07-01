import { getUserById } from '@/entities/user/api/get-user';
import { notFound } from 'next/navigation';
import UserProfileClient from './client';
import { getSession } from '@/features/auth/session';
import type { User } from '@/shared/lib/types';

interface UserProfilePageProps {
  userId: string;
}

// Augment the User type to include properties from the mock data
type DisplayUser = User & {
    id: string;
    status?: string;
    profileUrl: string;
    activitySummary: string;
    statsSummary: string;
};


export async function UserProfilePage({ userId }: UserProfilePageProps) {
  const userToDisplay = getUserById(userId) as DisplayUser | null;
  const sessionUser = await getSession();

  if (!userToDisplay || !sessionUser) {
    notFound();
  }

  const isCurrentUser = userToDisplay.email === sessionUser.email;

  return <UserProfileClient user={userToDisplay} isCurrentUser={isCurrentUser} />;
}
