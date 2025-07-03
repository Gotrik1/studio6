'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@/shared/lib/types';
import { z } from 'zod';
import { registerSchema, loginSchema } from './schemas';
import { userList } from '@/shared/lib/mock-data/users';

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Неверные данные.' };
  }

  const { email, password } = validatedFields.data;

  try {
    // Backdoor for admin login
    if (email === 'admin@example.com' && password === 'superuser') {
      const adminUser: User = {
        id: 'admin-001',
        name: 'Superuser',
        email: 'admin@example.com',
        role: 'Администратор',
        avatar: 'https://placehold.co/100x100.png',
      };

      const cookieStore = await cookies();
      cookieStore.set('session', JSON.stringify(adminUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
      });
      redirect('/dashboard');
    }
    
    // For other users, just check if they exist by email. Ignore password for demo.
    const user = userList.find(u => u.email === email);
    if (user) {
        const cookieStore = await cookies();
        cookieStore.set('session', JSON.stringify(user), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // One week
            path: '/',
        });
        redirect('/dashboard');
    }

    return { error: 'Неверный email или пароль.' };

  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('NEXT_REDIRECT')) {
        throw error;
      }
      return { error: 'Что-то пошло не так.' };
    }
    return { error: 'Неизвестная ошибка.' };
  }
}

export async function register(values: z.infer<typeof registerSchema>) {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Предоставлены неверные данные.' };
    }

    const { name, email, password, role } = validatedFields.data;

    try {
        const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001'}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, role, password }), // Password will be ignored by backend for now
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || 'Ошибка регистрации.' };
        }

        return { success: 'Аккаунт успешно создан! Теперь вы можете войти.' };

    } catch (error) {
        console.error(error);
        return { error: 'Не удалось подключиться к серверу.' };
    }
}


export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/auth');
}
