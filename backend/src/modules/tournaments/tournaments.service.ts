import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateTournamentDto } from "./dto/create-tournament.dto";
import { UpdateTournamentDto } from "./dto/update-tournament.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { Tournament, ActivityType, Prisma } from "@prisma/client";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { TournamentCrmDto } from "./dto/tournament-crm.dto";
import { CreateTournamentMediaDto } from "./dto/create-tournament-media.dto";

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTournamentDto: CreateTournamentDto,
    organizerId: string,
  ): Promise<Tournament> {
    const {
      name,
      game,
      format,
      prizePool,
      tournamentStartDate,
      description,
      rules,
      type,
      category,
      location,
      participantCount,
      registrationStartDate,
      registrationEndDate,
      bannerImage,
      bannerImageHint,
    } = createTournamentDto;
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    return this.prisma.tournament.create({
      data: {
        name,
        slug,
        game,
        format,
        prizePool,
        tournamentStartDate,
        description,
        rules,
        type,
        category,
        location,
        participantCount,
        registrationStartDate,
        registrationEndDate,
        bannerImage,
        bannerImageHint,
        organizer: { connect: { id: organizerId } },
        status: "REGISTRATION",
      },
    });
  }

  async update(
    id: string,
    updateTournamentDto: UpdateTournamentDto,
  ): Promise<Tournament> {
    const { name, ...rest } = updateTournamentDto;
    const data: Prisma.TournamentUpdateInput = { ...rest };
    if (name) {
      data.name = name;
      data.slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    return this.prisma.tournament.update({
      where: { id },
      data,
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
    if (tournament.status !== "REGISTRATION") {
      throw new BadRequestException("Турнир уже начался или завершен.");
    }
    if (tournament.teams.length < 2) {
      throw new BadRequestException(
        "Недостаточно команд для начала турнира (минимум 2).",
      );
    }
    if (tournament.teams.length % 2 !== 0) {
      throw new BadRequestException(
        "Для начала турнира требуется четное количество команд.",
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
        status: "PLANNED",
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
          status: "ONGOING",
        },
      });
    });
  }

  async findAll(params?: { game?: string }): Promise<any[]> {
    const where: Prisma.TournamentWhereInput = {};
    if (params?.game) {
      where.game = params.game;
    }

    const tournaments = await this.prisma.tournament.findMany({
      where,
      include: { _count: { select: { teams: true } } },
      orderBy: { tournamentStartDate: "desc" },
    });

    // Map to frontend shape
    return tournaments.map((t) => {
      let statusText = "Завершен";
      if (t.status === "REGISTRATION") statusText = "Регистрация";
      if (t.status === "ONGOING") statusText = "Идет";

      return {
        id: t.id,
        name: t.name,
        game: t.game,
        prize: `${t.prizePool} PD`,
        status: statusText,
        date: format(new Date(t.tournamentStartDate), "d MMMM yyyy", {
          locale: ru,
        }),
        image: t.bannerImage || "https://placehold.co/2560x720.png",
        dataAiHint: t.bannerImageHint || "esports tournament",
        slug: t.slug || t.name.toLowerCase().replace(/\\s+/g, "-"),
      };
    });
  }

  async findAllForCrm(): Promise<TournamentCrmDto[]> {
    const tournaments = await this.prisma.tournament.findMany({
      include: {
        _count: { select: { teams: true } },
        organizer: { select: { name: true } },
      },
      orderBy: { tournamentStartDate: "desc" },
    });

    return tournaments.map((t) => ({
      id: t.id,
      name: t.name,
      sport: t.game,
      status: t.status,
      participants: t._count.teams,
      maxParticipants: t.participantCount,
      startDate: t.tournamentStartDate.toISOString(),
      organizer: t.organizer.name,
      rules: t.rules || "",
    }));
  }

  async findOne(id: string): Promise<any> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
      include: {
        teams: {
          select: { name: true, logo: true, dataAiHint: true, slug: true },
        },
        matches: {
          include: {
            team1: {
              select: { id: true, name: true, logo: true, dataAiHint: true },
            },
            team2: {
              select: { id: true, name: true, logo: true, dataAiHint: true },
            },
          },
          orderBy: {
            scheduledAt: "asc",
          },
        },
        organizer: {
          select: { name: true, avatar: true },
        },
        media: true,
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Турнир с ID "${id}" не найден`);
    }

    return this._shapeTournamentDetails(tournament);
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
            team1: {
              select: { id: true, name: true, logo: true, dataAiHint: true },
            },
            team2: {
              select: { id: true, name: true, logo: true, dataAiHint: true },
            },
          },
          orderBy: {
            scheduledAt: "asc",
          },
        },
        organizer: {
          select: { name: true, avatar: true },
        },
        media: true,
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Турнир со слагом "${slug}" не найден`);
    }

    return this._shapeTournamentDetails(tournament);
  }

  private _shapeTournamentDetails(tournament: any) {
    // --- Dynamic Bracket Generation Logic ---
    const rounds: { name: string; matches: any[] }[] = [];
    const matches = tournament.matches.map((m: any) => ({
      ...m,
      href: `/matches/${m.id}`,
      score: m.team1Score !== null ? `${m.team1Score}-${m.team2Score}` : "VS",
    }));
    let champion: any = null;

    if (matches.length >= 4) {
      // Quarterfinals
      rounds.push({ name: "Четвертьфиналы", matches: matches.slice(0, 4) });
    }
    if (matches.length >= 6) {
      // Semifinals
      rounds.push({ name: "Полуфиналы", matches: matches.slice(4, 6) });
    }
    if (matches.length >= 7) {
      // Final
      const finalMatch = matches[6];
      rounds.push({ name: "Финал", matches: [finalMatch] });

      const score1 = finalMatch.team1Score ?? 0;
      const score2 = finalMatch.team2Score ?? 0;
      if (score1 > score2) {
        champion = { id: 99, team1: finalMatch.team1, winner: true };
      } else if (score2 > score1) {
        champion = { id: 99, team1: finalMatch.team2, winner: true };
      }
    }

    if (champion) {
      rounds.push({ name: "Чемпион", matches: [champion] });
    }

    // --- Dynamic Schedule Generation ---
    const registrationEndDate = new Date(tournament.registrationEndDate);
    const groupStageDate = new Date(tournament.tournamentStartDate);
    groupStageDate.setDate(groupStageDate.getDate() + 2);

    const schedule = {
      registration: `${format(new Date(tournament.registrationStartDate), "d MMM", { locale: ru })}-${format(registrationEndDate, "d MMMM", { locale: ru })}`,
      groupStage: `${format(new Date(tournament.tournamentStartDate), "d")}-${format(groupStageDate, "d MMMM", { locale: ru })}`,
      playoffs: "5-6 Июля", // can remain mock for now
      finals: format(new Date(tournament.tournamentStartDate), "d MMMM yyyy", {
        locale: ru,
      }),
    };

    return {
      id: tournament.id,
      name: tournament.name,
      slug: tournament.slug,
      game: tournament.game,
      status: tournament.status,
      participantCount: tournament.participantCount,
      registrationStartDate: tournament.registrationStartDate.toISOString(),
      registrationEndDate: tournament.registrationEndDate.toISOString(),
      tournamentStartDate: tournament.tournamentStartDate.toISOString(),
      image: tournament.bannerImage || "https://placehold.co/2560x720.png",
      dataAiHint: tournament.bannerImageHint || "esports tournament",
      description: tournament.description || "Описание турнира отсутствует.",
      prizePool: String(tournament.prizePool),
      teamsCount: tournament.teams.length,
      organizer: {
        name: tournament.organizer.name,
        avatar: tournament.organizer.avatar || "https://placehold.co/40x40.png",
      },
      schedule,
      teams: tournament.teams,
      rules: tournament.rules || "Правила не указаны.",
      bracket: { rounds },
      media: tournament.media.map((m: any) => ({ ...m, src: m.src })),
    };
  }

  async registerTeam(
    tournamentId: string,
    teamId: string,
  ): Promise<Tournament> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
    });
    if (!tournament) {
      throw new NotFoundException(`Турнир с ID ${tournamentId} не найден.`);
    }

    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { captain: true },
    });
    if (!team) {
      throw new NotFoundException(`Команда с ID ${teamId} не найдена.`);
    }

    // Add activity log for the captain
    if (team.captain) {
      await this.prisma.activity.create({
        data: {
          type: ActivityType.TOURNAMENT_REGISTERED,
          userId: team.captain.id,
          metadata: {
            teamName: team.name,
            tournamentName: tournament.name,
            tournamentHref: `/tournaments/${tournament.slug}`,
            icon: "Trophy",
          },
        },
      });
    }

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

  async addMedia(
    tournamentId: string,
    createMediaDto: CreateTournamentMediaDto,
  ) {
    return this.prisma.tournamentMedia.create({
      data: {
        tournamentId,
        ...createMediaDto,
      },
    });
  }

  async remove(id: string): Promise<Tournament> {
    return this.prisma.tournament.delete({ where: { id } });
  }
}
