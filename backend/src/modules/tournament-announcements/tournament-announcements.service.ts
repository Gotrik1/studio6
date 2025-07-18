import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { PRODVOR_EXCHANGE } from "../rabbitmq/rabbitmq.config";
import type { TournamentAnnouncementCreatedPayload } from "../rabbitmq/models/tournament-announcement-created.payload";

@Injectable()
export class TournamentAnnouncementsService {
  constructor(
    private prisma: PrismaService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async findAllForTournament(tournamentId: string) {
    return this.prisma.tournamentAnnouncement.findMany({
      where: { tournamentId },
      orderBy: { createdAt: "desc" },
      include: { sender: { select: { name: true } } },
    });
  }

  async create(
    tournamentId: string,
    senderId: string,
    dto: CreateAnnouncementDto,
  ) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        teams: {
          select: {
            members: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!tournament) {
      throw new NotFoundException("Турнир не найден");
    }

    const participantIds = [
      ...new Set(tournament.teams.flatMap((t) => t.members.map((m) => m.id))),
    ];

    const announcement = await this.prisma.tournamentAnnouncement.create({
      data: {
        ...dto,
        tournamentId,
        senderId,
        sentTo: participantIds.length,
      },
    });

    // Publish event to RabbitMQ for notifications
    const payload: TournamentAnnouncementCreatedPayload = {
      announcementId: announcement.id,
      tournamentId: tournament.id,
      tournamentSlug: tournament.slug,
      tournamentName: tournament.name,
      subject: announcement.subject,
      participantIds: participantIds,
    };
    this.amqpConnection.publish(
      PRODVOR_EXCHANGE,
      "tournament.announcement.created",
      payload,
    );

    return announcement;
  }
}
