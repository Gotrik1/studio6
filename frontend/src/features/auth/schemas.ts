import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Введите корректный email." }),
  password: z.string().min(1, { message: "Пароль не может быть пустым." }),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2 символов." }),
  email: z.string().email({ message: "Введите корректный email." }),
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать не менее 8 символов." }),
  role: z.string({ required_error: "Выберите вашу основную роль." }),
  terms: z
    .boolean()
    .refine((val) => val === true, { message: "Вы должны принять условия." }),
});
