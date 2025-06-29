import { cookies } from 'next/headers';
import type { User } from '@/shared/lib/types';

export async function getSession(): Promise<User | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;

  try {
    const session = JSON.parse(sessionCookie);
    return session as User;
  } catch (error) {
    console.error('Failed to parse session cookie:', error);
    return null;
  }
}
