'use server';

import { z } from 'zod';

const profileFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать не менее 2 символов."),
  city: z.string().min(2, "Город должен содержать не менее 2 символов."),
  sport: z.string().min(2, "Вид спорта должен содержать не менее 2 символов."),
});

export async function updateProfileSettings(values: z.infer<typeof profileFormSchema>) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const validatedFields = profileFormSchema.safeParse(values);
  
  if (!validatedFields.success) {
    return { error: 'Предоставлены неверные данные.' };
  }
  
  // In a real app, you would:
  // 1. Get user session to verify permissions.
  // 2. Update user data in the database.
  
  console.log("Updating profile with values:", values);
  
  // For this demo, we'll just return a success message
  return { success: 'Настройки профиля успешно сохранены!' };
}
