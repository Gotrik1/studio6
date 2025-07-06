import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { LfgLobby } from "@prisma/client";
import { CreateLfgLobbyDto } from "./dto/create-lfg-lobby.dto";
import { addMinutes } from "date-fns";

@Injectable()
export class LfgService {
  constructor(private prisma: PrismaService) {}

  async create(
    createLfgLobbyDto: CreateLfgLobbyDto,
    userId: string,
  ): Promise<LfgLobby> {
    const { duration, ...rest } = createLfgLobbyDto;
    const endTime = addMinutes(new Date(createLfgLobbyDto.startTime), duration);

    return this.prisma.lfgLobby.create({
      data: {
        ...rest,
        endTime,
        creator: { connect: { id: userId } },
        players: { connect: { id: userId } },
      },
    });
  }

  async findAll(): Promise<any[]> {
    const now = new Date();
    const lobbies = await this.prisma.lfgLobby.findMany({
      where: { endTime: { gt: now } }, // Only fetch lobbies that haven't ended
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        _count: { select: { players: true } },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return lobbies.map((lobby) => ({
      id: lobby.id,
      type: lobby.type,
      sport: lobby.sport,
      location: lobby.location,
      playgroundId: lobby.playgroundId,
      startTime: lobby.startTime,
      endTime: lobby.endTime,
      playersNeeded: lobby.playersNeeded,
      playersJoined: lobby._count.players,
      comment: lobby.comment,
      creator: {
        name: lobby.creator.name,
        avatar: lobby.creator.avatar,
      },
    }));
  }

  async join(lobbyId: string, userId: string): Promise<LfgLobby> {
    const lobby = await this.prisma.lfgLobby.findUnique({
      where: { id: lobbyId },
      include: { players: { select: { id: true } } },
    });

    if (!lobby) {
      throw new NotFoundException(`Лобби с ID ${lobbyId} не найдено.`);
    }

    if (lobby.endTime < new Date()) {
      throw new BadRequestException("Это лобби уже неактивно.");
    }

    if (lobby.players.length >= lobby.playersNeeded) {
      throw new ConflictException("Лобби уже заполнено.");
    }

    if (lobby.players.some((player) => player.id === userId)) {
      throw new ConflictException("Вы уже находитесь в этом лобби.");
    }

    return this.prisma.lfgLobby.update({
      where: { id: lobbyId },
      data: {
        players: {
          connect: { id: userId },
        },
      },
    });
  }
}
