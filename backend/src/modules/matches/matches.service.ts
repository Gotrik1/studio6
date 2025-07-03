import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Match, MatchStatus } from '@prisma/client';
import { UpdateMatchDto } from './dto/update-match.dto';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const { team1Id, team2Id, tournamentId, scheduledAt } = createMatchDto;
    return this.prisma.match.create({
      data: {
        team1: { connect: { id: team1Id } },
        team2: { connect: { id: team2Id } },
        tournament: tournamentId
          ? { connect: { id: tournamentId } }
          : undefined,
        scheduledAt,
        status: 'PLANNED',
      },
    });
  }

  async findAll(): Promise<any[]> {
    const matches = await this.prisma.match.findMany({
      include: {
        team1: { select: { name: true, logo: true, dataAiHint: true } },
        team2: { select: { name: true, logo: true, dataAiHint: true } },
        tournament: { select: { name: true, game: true } },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    const statusMap: Record<MatchStatus, string> = {
      PLANNED: 'Предстоящий',
      LIVE: 'Идет',
      FINISHED: 'Завершен',
      DISPUTED: 'Спорный',
    };

    return matches.map((match) => ({
      id: match.id,
      team1: {
        name: match.team1.name,
        logo: match.team1.logo || 'https://placehold.co/100x100.png',
        logoHint: match.team1.dataAiHint || 'team logo',
      },
      team2: {
        name: match.team2.name,
        logo: match.team2.logo || 'https://placehold.co/100x100.png',
        logoHint: match.team2.dataAiHint || 'team logo',
      },
      score: match.score || 'VS',
      tournament: match.tournament?.name || 'Товарищеский матч',
      game: match.tournament?.game || 'Неизвестно',
      date: format(new Date(match.scheduledAt), 'yyyy-MM-dd'),
      status: statusMap[match.status],
      href: `/matches/${match.id}`,
      playgroundId: null, // Assuming this is not in the DB model yet
    }));
  }

  async findOne(id: string): Promise<any | null> {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        team1: { include: { members: { select: { name: true, role: true, avatar: true } } } },
        team2: { include: { members: { select: { name: true, role: true, avatar: true } } } },
        tournament: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`Матч с ID ${id} не найден`);
    }

    const scoreParts = match.score?.split('-').map(s => parseInt(s.trim())) || [0, 0];

    // Mock data for things not yet in the DB for a richer frontend experience
    const mockEvents = [
        { time: "05:12", event: "Гол", player: "Echo", team: match.team1.name },
        { time: "15:30", event: "Желтая карточка", player: "ColdSniper", team: match.team2.name },
        { time: "22:45", event: "Гол", player: "Viper", team: match.team1.name },
        { time: "35:01", event: "Финальный свисток", player: "", team: "" },
    ];
    const mockTeamStats = {
        goals: { label: "Голы", team1: scoreParts[0], team2: scoreParts[1] },
        shotsOnTarget: { label: "Удары в створ", team1: 12, team2: 8 },
        possession: { label: "Владение мячом (%)", team1: 62, team2: 38 },
        corners: { label: "Угловые", team1: 8, team2: 4 },
    };
    const mockMedia = [
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'football action' },
        { type: "video", src: "https://placehold.co/600x400.png", hint: 'football goal' },
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'team celebration' },
        { type: "image", src: "https://placehold.co/600x400.png", hint: 'football player' },
    ];
    
    // Map Prisma result to the frontend's MatchDetails shape
    return {
      id: match.id,
      tournament: match.tournament?.name || 'Товарищеский матч',
      status: match.status === 'FINISHED' ? 'Завершен' : 'Идет',
      score: match.score || 'VS',
      date: format(new Date(match.scheduledAt), 'd MMMM yyyy', { locale: ru }),
      time: format(new Date(match.scheduledAt), 'HH:mm'),
      location: "Футбольное поле 'Центральный'", // Mock
      referee: { name: "Иван Петров" }, // Mock
      team1: { name: match.team1.name, logo: match.team1.logo || 'https://placehold.co/100x100.png', logoHint: match.team1.dataAiHint || 'team logo' },
      team2: { name: match.team2.name, logo: match.team2.logo || 'https://placehold.co/100x100.png', logoHint: match.team2.dataAiHint || 'team logo' },
      lineups: {
          team1: match.team1.members.slice(0,3).map(m => ({name: m.name, role: m.role, avatar: m.avatar || 'https://placehold.co/40x40.png', avatarHint: 'sports player'})),
          team2: match.team2.members.slice(0,3).map(m => ({name: m.name, role: m.role, avatar: m.avatar || 'https://placehold.co/40x40.png', avatarHint: 'sports player'})),
      },
      events: mockEvents,
      teamStats: mockTeamStats,
      media: mockMedia,
    };
  }

  async updateScore(
    id: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    const { score1, score2 } = updateMatchDto;

    const match = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      throw new NotFoundException(`Матч с ID ${id} не найден`);
    }

    const team1Update: {
      wins?: { increment: 1 };
      losses?: { increment: 1 };
      draws?: { increment: 1 };
    } = {};
    const team2Update: {
      wins?: { increment: 1 };
      losses?: { increment: 1 };
      draws?: { increment: 1 };
    } = {};

    if (score1 > score2) {
      team1Update.wins = { increment: 1 };
      team2Update.losses = { increment: 1 };
    } else if (score2 > score1) {
      team1Update.losses = { increment: 1 };
      team2Update.wins = { increment: 1 };
    } else {
      team1Update.draws = { increment: 1 };
      team2Update.draws = { increment: 1 };
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.team.update({
        where: { id: match.team1Id },
        data: team1Update,
      });
      await tx.team.update({
        where: { id: match.team2Id },
        data: team2Update,
      });

      const updatedMatch = await tx.match.update({
        where: { id },
        data: {
          score: `${score1}-${score2}`,
          status: 'FINISHED',
          finishedAt: new Date(),
        },
      });

      return updatedMatch;
    });
  }

  async remove(id: string): Promise<Match> {
    return this.prisma.match.delete({ where: { id } });
  }
}
