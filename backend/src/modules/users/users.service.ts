
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import { differenceInYears } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { LeaderboardPlayerDto } from './dto/leaderboard-player.dto';
import { gallery } from '@/shared/lib/mock-data/gallery';

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
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          activities: {
            orderBy: {
              timestamp: 'desc'
            },
            take: 10
          }
        }
      });

      if (!user) {
        throw new NotFoundException(`Пользователь с ID ${id} не найден`);
      }
      
      // Augment real user data with mock details for a richer profile experience
      const dateOfBirth = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '1998-05-15';

      const augmentedProfile = {
        ...user,
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

  async findUserTeams(userId: string): Promise<any[]> {
    const teams = await this.prisma.team.findMany({
      where: {
        members: {
          some: { id: userId },
        },
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    // Map to the shape expected by TeamsTab on the frontend
    return teams.map((team) => ({
      name: team.name,
      role: 'Участник', // Simplified. A real app might need a pivot table with roles.
      logo: team.logo,
      dataAiHint: team.dataAiHint,
      slug: team.slug,
      rank: team.rank,
      game: team.game,
    }));
  }
  
  async findUserGallery(userId: string): Promise<any[]> {
    // In a real app, this would query the database for the user's media.
    // For this prototype, we return mock data.
    return gallery;
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
