'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@/lib/session';
import { z } from 'zod';

// Login action
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // This is a mock authentication. In a real app, you'd validate against a database.
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Hardcoded user for demonstration purposes
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
      return 'Неверные данные. Пожалуйста, попробуйте еще раз.';
    }
  } catch (error) {
    if (error instanceof Error) {
        // next/redirect throws an error, so we catch it and do nothing.
        if (error.message === 'NEXT_REDIRECT') {
          throw error;
        }
        return 'Произошла ошибка. Пожалуйста, попробуйте еще раз.';
    }
    throw error;
  }
}

// Registration action
const registrationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  dob: z.date(),
  role: z.string(),
  terms: z.boolean(),
});

export async function register(values: z.infer<typeof registrationSchema>) {
    // In a real application, you would:
    // 1. Validate the data with Zod (already done on the client, but good to re-validate on server).
    // 2. Hash the password.
    // 3. Save the new user to your database (e.g., via Keycloak admin API or your own user service).
    // 4. Send a verification email.
    // 5. Handle potential errors (e.g., email already exists).

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    console.log('Registering user:', values);

    // Simulate a successful registration or an error
    if (values.email.includes("fail")) {
      return { error: 'Этот email уже зарегистрирован.' };
    }

    // On success, you might automatically log the user in or ask them to verify their email.
    return { success: 'Регистрация прошла успешно! Теперь вы можете войти.' };
}
