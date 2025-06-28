'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@/lib/session';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (email === 'admin@example.com' && password === 'superuser') {
      const user: User = {
        name: 'Superuser',
        email: 'admin@example.com',
        role: 'Admin',
        avatar: 'https://placehold.co/100x100.png',
      };
      
      cookies().set('session', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
      });

      redirect('/dashboard');
    } else {
      return 'Invalid credentials. Please try again.';
    }
  } catch (error) {
    if (error instanceof Error) {
        // next/redirect throws an error, so we catch it and do nothing.
        if (error.message === 'NEXT_REDIRECT') {
          throw error;
        }
        return 'An error occurred. Please try again.';
    }
    throw error;
  }
}
