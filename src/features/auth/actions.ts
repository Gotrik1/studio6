'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@/shared/lib/types';
import { z } from 'zod';
import { registerSchema } from './schemas';

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

    // In a real app, this redirect would happen after a successful login & token exchange.
    // For a new user, it should be '/welcome'. For an existing user, '/dashboard'.
    // We'll redirect to welcome to show the onboarding flow.
    redirect('/welcome');

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

// Registration action - updated to call the backend API
export async function register(values: z.infer<typeof registerSchema>) {
    const validatedFields = registerSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: 'Предоставлены неверные данные.' };
    }
    
    // In a real application, the BASE_URL would come from environment variables
    const API_URL = process.env.API_BASE_URL || 'http://localhost:3001';

    try {
        // This will call the backend service which in turn uses the Keycloak Admin API.
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || 'Произошла ошибка при регистрации.' };
        }

        return { success: 'Регистрация прошла успешно! Теперь вы можете войти.' };

    } catch (error) {
       console.error("Registration API call failed:", error);
       // This will catch network errors
       return { error: 'Не удалось связаться с сервером регистрации. Пожалуйста, попробуйте еще раз позже.' };
    }
}


export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/auth');
}
