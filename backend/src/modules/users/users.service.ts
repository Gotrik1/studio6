
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import { differenceInYears } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { LeaderboardPlayerDto } from './dto/leaderboard-player.dto';

// Mock data for seeding purposes
const mockGallery = [
    { src: 'https://placehold.co/600x400.png', alt: 'Фото с матча', dataAiHint: 'football action' },
    { src: 'https://placehold.co/600x400.png', alt: 'Фото с турнира', dataAiHint: 'sports tournament' },
    { src: 'https://placehold.co/600x400.png', alt: 'Лучший момент', dataAiHint: 'sports highlights' },
    { src: 'https://placehold.co/600x400.png', alt: 'Командное фото', dataAiHint: 'team photo' },
];
const mockCareerHistory = [
    { teamName: 'Юность', period: '2022-2023', role: 'Запасной игрок', review: 'Показал большой потенциал во время тренировок.' },
    { teamName: 'Дворовые Атлеты', period: '2023-н.в.', role: 'Капитан', review: 'Привел команду к победе в нескольких региональных турнирах.' },
];

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const { name, email, password, role } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    
    // In a real Keycloak architecture, password wouldn't be handled here.
    // For the prototype's local auth, we hash the password securely.
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltOrRounds);

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

    // Never return the password hash to the client
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
      const userCheck = await this.prisma.user.findUnique({ where: { id } });
       if (!userCheck) {
        throw new NotFoundException(`Пользователь с ID ${id} не найден`);
      }

       // --- Seed mock gallery and career if they don't exist for this user ---
      const galleryCount = await this.prisma.galleryItem.count({ where: { userId: id } });
      if (galleryCount === 0) {
          await this.prisma.galleryItem.createMany({
              data: mockGallery.map(item => ({ ...item, userId: id }))
          });
      }
      const careerCount = await this.prisma.careerHistoryItem.count({ where: { userId: id } });
      if (careerCount === 0) {
          await this.prisma.careerHistoryItem.createMany({
              data: mockCareerHistory.map(item => ({ ...item, userId: id }))
          });
      }
      // --- End seeding ---

      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          activities: {
            orderBy: {
              timestamp: 'desc'
            },
            take: 10
          },
          teams: {
            include: {
              _count: {
                select: { members: true },
              },
            },
          },
          gallery: {
              orderBy: { createdAt: 'desc' }
          },
          careerHistory: {
              orderBy: { createdAt: 'asc' }
          }
        }
      });
      
      const userTeams = user.teams.map((team) => ({
        id: team.id,
        name: team.name,
        role: 'Участник', // Simplified. A real app might need a pivot table with roles.
        logo: team.logo,
        dataAiHint: team.dataAiHint,
        slug: team.slug,
        rank: team.rank,
        game: team.game,
      }));

      // Augment real user data with mock details for a richer profile experience
      const dateOfBirth = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '1998-05-15';

      const augmentedProfile = {
        ...user,
        teams: userTeams, // add mapped teams
        location: user.location || "Москва, Россия",
        mainSport: user.mainSport || "Футбол",
        isVerified: true, // Mocked as the field doesn't exist in schema
        dateOfBirth: dateOfBirth,
        age: differenceInYears(new Date(), new Date(dateOfBirth)),
        preferredSports: user.preferredSports?.length ? user.preferredSports : ["Футбол", "Баскетбол", "Valorant"],
        contacts: {
            telegram: user.telegram || '@player_example',
            discord: user.discord || 'player#1234'
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = augmentedProfile;
      return result;
  }

  async getLeaderboard(): Promise<LeaderboardPlayerDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        xp: 'desc',
      },
      take: 10,
    });

    return users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user.xp,
      avatar: user.avatar || 'https://placehold.co/40x40.png',
      avatarHint: 'player avatar',
    }));
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
