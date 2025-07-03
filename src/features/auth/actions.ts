'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@/shared/lib/types';
import { z } from 'zod';
import { registerSchema } from './schemas';
import { userList } from '@/shared/lib/mock-data/users';

// This is a mock function that simulates the first step of a multi-step login.
// It checks if the user exists and then would typically redirect to a password/2FA step.
// For the prototype, we log the user in directly if they are the demo user.
export async function login(email: string) {
  try {
    const user = userList.find(u => u.email === email);
    
    if (!user) {
        return { error: 'Пользователь не найден.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });
  } catch (error) {
    if (error instanceof Error) {
        if (error.message.includes('NEXT_REDIRECT')) {
          throw error;
        }
        return { error: 'Что-то пошло не так.' };
    }
  }
  redirect('/dashboard');
}

export async function register(values: z.infer<typeof registerSchema>) {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Предоставлены неверные данные.' };
    }

    const { name, email, role } = validatedFields.data;

    // In a real app, you would save the user to the database.
    // For this prototype, we'll create a user object and save it to the session.
    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        avatar: 'https://placehold.co/100x100.png',
    };

    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(newUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });
    
    redirect('/welcome');
}


export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/auth');
}
