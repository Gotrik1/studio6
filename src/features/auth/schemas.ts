import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Введите корректный email." }),
  password: z.string().min(1, { message: "Пароль не может быть пустым." }),
});
