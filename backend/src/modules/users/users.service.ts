
import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { differenceInYears } from 'date-fns';

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
    
    // В реальной архитектуре с Keycloak пароль здесь не обрабатывается.
    // Оставляем хэш пустым или null.
    const passwordHash = '';

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        role: role || 'Игрок', // default role
        passwordHash,
        status: 'Активен',
        xp: 0,
      },
    });

    // Никогда не возвращаем хэш пароля клиенту
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    });
  }

  async findOne(id: string): Promise<any | null> {
      // For demo purposes, we will return a rich profile for a specific ID,
      // as if it were fetched from a fully populated database.
      if (id === 'player-example-001') {
          const mockUser = {
              id: 'player-example-001',
              name: 'Пример Игрока',
              email: 'player.example@example.com',
              role: 'Игрок',
              avatar: 'https://placehold.co/100x100.png',
              status: 'Активен',
              xp: 1250,
              location: "Москва, Россия",
              mainSport: "Футбол",
              isVerified: true, // mock
              dateOfBirth: '1998-05-15',
              preferredSports: ["Футбол", "Баскетбол", "Valorant"],
              contacts: {
                  telegram: '@player_example',
                  discord: 'player#1234'
              }
          };
          return {
              ...mockUser,
              age: differenceInYears(new Date(), new Date(mockUser.dateOfBirth)),
          };
      }
    
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
