
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { registerSchema, loginSchema } from './schemas';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Неверные данные.' };
  }

  const { email, password } = validatedFields.data;

  let data;
  try {
    const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Неверный email или пароль.' };
    }

    data = await response.json();

  } catch (error) {
    console.error(error);
    return { error: 'Не удалось подключиться к серверу. Пожалуйста, попробуйте еще раз.' };
  }
  
  if (!data || !data.user) {
      return { error: "Не удалось получить данные пользователя от сервера." };
  }
  
  // If we got here, user is valid. Set cookie and redirect.
  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify(data.user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  });

  redirect(DEFAULT_LOGIN_REDIRECT);
}

export async function register(values: z.infer<typeof registerSchema>) {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Предоставлены неверные данные.' };
    }

    const { name, email, password, role } = validatedFields.data;

    try {
        const response = await fetch(`/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, role, password }),
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
