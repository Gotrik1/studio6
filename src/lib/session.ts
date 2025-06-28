import { cookies } from 'next/headers';

export type User = {
  name: string;
  email: string;
  role: string;
  avatar: string;
};

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
