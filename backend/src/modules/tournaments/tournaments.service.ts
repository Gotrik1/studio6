
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Tournament } from '@prisma/client';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  async create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    const { name, game, format, prizePool, startDate } = createTournamentDto;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    return this.prisma.tournament.create({
      data: {
        name,
        slug,
        game,
        format,
        prizePool,
        startDate,
        status: 'REGISTRATION',
      },
    });
  }

  async startTournament(id: string): Promise<Tournament> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
      include: { teams: true },
    });

    if (!tournament) {
      throw new NotFoundException(`Турнир с ID ${id} не найден`);
    }
    if (tournament.status !== 'REGISTRATION') {
      throw new BadRequestException('Турнир уже начался или завершен.');
    }
    if (tournament.teams.length < 2) {
      throw new BadRequestException(
        'Недостаточно команд для начала турнира (минимум 2).',
      );
    }
    if (tournament.teams.length % 2 !== 0) {
      throw new BadRequestException(
        'Для начала турнира требуется четное количество команд.',
      );
    }

    // Простая логика жеребьевки: перемешиваем и создаем пары
    const shuffledTeams = tournament.teams.sort(() => 0.5 - Math.random());
    const matchesToCreate = [];
    for (let i = 0; i < shuffledTeams.length; i += 2) {
      matchesToCreate.push({
        team1Id: shuffledTeams[i].id,
        team2Id: shuffledTeams[i + 1].id,
        tournamentId: id,
        status: 'PLANNED',
        scheduledAt: new Date(), // Placeholder для логики расписания
      });
    }

    // Используем транзакцию, чтобы оба действия выполнились успешно
    return this.prisma.$transaction(async (tx) => {
      await tx.match.createMany({
        data: matchesToCreate,
      });

      return tx.tournament.update({
        where: { id },
        data: {
          status: 'ONGOING',
        },
      });
    });
  }

  async findAll(): Promise<any[]> {
    const tournaments = await this.prisma.tournament.findMany({
      include: { _count: { select: { teams: true } } },
    });

    // Map to frontend shape
    return tournaments.map(t => {
      let statusText = 'Завершен';
      if (t.status === 'REGISTRATION') statusText = 'Регистрация';
      if (t.status === 'ONGOING') statusText = 'Идет';

      return {
        name: t.name,
        game: t.game,
        prize: `${t.prizePool} PD`,
        status: statusText,
        date: format(new Date(t.startDate), 'd MMMM yyyy', { locale: ru }),
        image: t.bannerImage || 'https://placehold.co/2560x720.png',
        dataAiHint: t.bannerImageHint || 'esports tournament',
        slug: t.slug || t.name.toLowerCase().replace(/\s+/g, '-'),
      };
    });
  }

  async findOne(id: string): Promise<Tournament | null> {
    return this.prisma.tournament.findUnique({
      where: { id },
      include: { teams: true, matches: true },
    });
  }

  async findBySlug(slug: string): Promise<any> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { slug },
      include: {
        teams: {
          select: { name: true, logo: true, dataAiHint: true, slug: true },
        },
        matches: {
          include: {
            team1: { select: { id: true, name: true, logo: true, dataAiHint: true } },
            team2: { select: { id: true, name: true, logo: true, dataAiHint: true } },
          },
          orderBy: {
            scheduledAt: 'asc',
          },
        },
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Турнир со слагом "${slug}" не найден`);
    }

    // --- Dynamic Bracket Generation Logic ---
    // This is a simplified logic for demo purposes.
    // A real implementation would need a 'round' field in the Match model.
    const rounds: { name: string; matches: any[] }[] = [];
    const matches = tournament.matches.map(m => ({
        ...m, 
        href: `/matches/${m.id}`,
        score: m.team1Score !== null ? `${m.team1Score}-${m.team2Score}` : 'VS'
    }));
    let champion: any = null;

    // This logic assumes a simple 8-team single elimination bracket for demo
    if (matches.length >= 4) { // Quarterfinals
        rounds.push({ name: 'Четвертьфиналы', matches: matches.slice(0, 4) });
    }
    if (matches.length >= 6) { // Semifinals
        rounds.push({ name: 'Полуфиналы', matches: matches.slice(4, 6) });
    }
    if (matches.length >= 7) { // Final
        const finalMatch = matches[6];
        rounds.push({ name: 'Финал', matches: [finalMatch] });
        
        const score1 = finalMatch.team1Score ?? 0;
        const score2 = finalMatch.team2Score ?? 0;
        if (score1 > score2) {
            champion = { id: 99, team1: finalMatch.team1, winner: true };
        } else if (score2 > score1) {
            champion = { id: 99, team1: finalMatch.team2, winner: true };
        }
    }
    
    if (champion) {
        rounds.push({ name: 'Чемпион', matches: [champion] });
    }
    // --- End Bracket Generation ---

    return {
      name: tournament.name,
      slug: tournament.slug,
      game: tournament.game,
      status: tournament.status === 'ONGOING' ? 'Идет' : tournament.status === 'REGISTRATION' ? 'Регистрация' : 'Завершен',
      image: tournament.bannerImage || 'https://placehold.co/2560x720.png',
      dataAiHint: tournament.bannerImageHint || 'esports tournament',
      description: 'Описание турнира отсутствует.',
      prizePool: String(tournament.prizePool),
      teamsCount: tournament.teams.length,
      organizer: { name: 'ProDvor Events', logo: 'https://placehold.co/40x40.png' },
      schedule: { // This is simplified, real data would come from match schedules
        registration: "15-30 Июня",
        groupStage: "1-3 Июля",
        playoffs: "5-6 Июля",
        finals: format(new Date(tournament.startDate), 'd MMMM yyyy', { locale: ru }),
      },
      teams: tournament.teams,
      rules: "Правила не указаны.",
      bracket: { rounds },
      media: [ // Keep media mocked for now
        { type: 'image', src: 'https://placehold.co/600x400.png', hint: 'esports action' },
        { type: 'video', src: 'https://placehold.co/600x400.png', hint: 'esports trophy' },
      ]
    };
  }


  async registerTeam(
    tournamentId: string,
    teamId: string,
  ): Promise<Tournament> {
    return this.prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        teams: {
          connect: { id: teamId },
        },
      },
      include: { teams: true },
    });
  }

  async remove(id: string): Promise<Tournament> {
    return this.prisma.tournament.delete({ where: { id } });
  }
}
