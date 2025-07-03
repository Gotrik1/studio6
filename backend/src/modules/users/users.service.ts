
import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const { name, email, role } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // В реальном приложении здесь будет вызов Keycloak Admin API для создания пользователя.
    // Пароль обрабатывается и хранится в Keycloak, а не в нашем сервисе.
    const passwordHash = `keycloak_managed_password_${Date.now()}`;

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        role: role || 'Игрок', // default role
        passwordHash, // This field is just a placeholder
      },
    });

    // Никогда не возвращаем хэш пароля клиенту
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => {
      const { passwordHash, ...result } = user;
      return result;
    });
  }

  async findOne(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
