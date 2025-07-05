


import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import { differenceInYears } from 'date-fns';
import { LeaderboardPlayerDto } from './dto/leaderboard-player.dto';
import { PlayerStatsDto } from './dto/player-stats.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, role, password } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    
    // NOTE: In a Keycloak architecture, the user would be created via Keycloak Admin API.
    // This is a simplified version for the prototype.
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash: password || 'mock_hash', // In a real app, hash the password
        role: role || 'Игрок',
        status: 'Активен',
        xp: 0,
      },
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
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
          },
          teamsAsMember: {
            include: {
              _count: {
                select: { members: true },
              },
            },
          },
          organizedTournaments: {
            include: {
              _count: {
                select: { teams: true }
              }
            }
          },
          gallery: {
              orderBy: { createdAt: 'desc' }
          },
          careerHistory: {
              orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!user) {
        throw new NotFoundException(`Пользователь с ID ${id} не найден`);
      }
      
      const userTeams = user.teamsAsMember.map((team) => ({
        id: team.id,
        name: team.name,
        role: user.id === team.captainId ? 'Капитан' : 'Участник',
        logo: team.logo,
        dataAiHint: team.dataAiHint,
        slug: team.slug,
        rank: team.rank,
        game: team.game,
      }));

      const organizedTournaments = user.organizedTournaments.map(t => ({
          id: t.id,
          name: t.name,
          sport: t.game,
          status: t.status,
          participants: t._count.teams,
          maxParticipants: t.participantCount,
          startDate: t.tournamentStartDate.toISOString(),
          organizer: user.name,
          rules: t.rules || '',
      }));


      const dateOfBirth = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '1998-05-15';

      const augmentedProfile = {
        ...user,
        teams: userTeams,
        organizedTournaments,
        location: user.location || "Москва, Россия",
        mainSport: user.mainSport || "Футбол",
        isVerified: true,
        dateOfBirth: dateOfBirth,
        age: differenceInYears(new Date(), new Date(dateOfBirth)),
        preferredSports: user.preferredSports?.length ? user.preferredSports : ["Футбол", "Баскетбол", "Valorant"],
        contacts: {
            telegram: user.telegram || '@player_example',
            discord: user.discord || 'player#1234'
        },
        activitySummary: 'Частые сообщения в чате, участие в 3 турнирах за последний месяц. Нет жалоб.',
        statsSummary: `Играет в ${user.mainSport || 'неизвестно'}, роль - ${user.role}.`,
        profileUrl: `/profiles/player/${user.id}`
      };

      return augmentedProfile;
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
  
  async getStatsForUser(userId: string): Promise<PlayerStatsDto> {
    // In a real app, this would be calculated from matches, etc.
    // For now, we return mock data to fulfill the API contract.
    return {
        winLossData: { wins: 45, losses: 20 },
        kdaByMonthData: [
            { month: 'Янв', kda: 1.2 },
            { month: 'Фев', kda: 1.3 },
            { month: 'Мар', kda: 1.1 },
            { month: 'Апр', kda: 1.4 },
            { month: 'Май', kda: 1.5 },
            { month: 'Июн', kda: 1.25 },
        ],
        winrateByMapData: [
            { map: 'Ascent', winrate: 65 },
            { map: 'Bind', winrate: 72 },
            { map: 'Split', winrate: 58 },
            { map: 'Haven', winrate: 81 },
            { map: 'Icebox', winrate: 52 },
        ],
        summary: {
            matches: 65,
            winrate: 69.2,
            winStreak: 5,
            kda: 1.25,
        }
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
