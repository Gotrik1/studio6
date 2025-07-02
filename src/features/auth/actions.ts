'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@/shared/lib/types';
import { z } from 'zod';
import { loginSchema, registerSchema } from './schemas';

export async function login(values: z.infer<typeof loginSchema>) {
  try {
    const validatedFields = loginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: 'Предоставлены неверные данные.' };
    }

    const { email, password } = validatedFields.data;

    // This hardcoded logic will be replaced with an API call to Keycloak
    if (email === 'admin@example.com' && password === 'superuser') {
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

      redirect('/dashboard');
    } else {
      return { error: 'Неверные данные. Пожалуйста, попробуйте еще раз.' };
    }
  } catch (error) {
    if (error instanceof Error) {
        if (error.message === 'NEXT_REDIRECT') {
          throw error;
        }
        return { error: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.' };
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
