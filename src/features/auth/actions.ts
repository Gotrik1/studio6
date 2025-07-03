'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@/shared/lib/types';

// This function now simulates a successful redirect from an external provider like Keycloak.
// In a real OAuth2 flow, the user would be redirected to Keycloak, log in,
// and then be redirected back to our app with a code, which we'd exchange for a token.
// For this prototype, we'll just create the session for the demo user directly.
export async function login() {
  try {
    const user: User = {
        name: 'Superuser',
        email: 'admin@example.com',
        role: 'Администратор',
        avatar: 'https://placehold.co/100x100.png',
    };
    
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });

    // Redirect to the main dashboard after login.
    redirect('/dashboard');

  } catch (error) {
    if (error instanceof Error) {
        if (error.message === 'NEXT_REDIRECT') {
          throw error;
        }
        console.error("Login action failed:", error);
        // We could return an error here to be displayed on the auth page.
    }
    throw error;
  }
}


export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/auth');
}
