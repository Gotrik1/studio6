import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { LfgLobby, LfgLobbyStatus, Prisma } from "@prisma/client";
import { CreateLfgLobbyDto } from "./dto/create-lfg-lobby.dto";
import { addMinutes } from "date-fns";

@Injectable()
export class LfgService {
  constructor(private prisma: PrismaService) {}

  async create(
    createLfgLobbyDto: CreateLfgLobbyDto,
    userId: string,
  ): Promise<LfgLobby> {
    const { duration, playgroundId, ...rest } = createLfgLobbyDto;
    const endTime = addMinutes(new Date(createLfgLobbyDto.startTime), duration);

    const data: Prisma.LfgLobbyCreateInput = {
      ...rest,
      endTime,
      creator: { connect: { id: userId } },
      players: { connect: { id: userId } },
    };

    if (playgroundId) {
      data.playground = { connect: { id: playgroundId } };
    }

    return this.prisma.lfgLobby.create({
      data,
    });
  }

  async findAll(): Promise<any[]> {
    const now = new Date();
    const lobbies = await this.prisma.lfgLobby.findMany({
      where: {
        // We fetch lobbies that are not yet finished
        endTime: { gt: now },
        // And not explicitly cancelled
        status: { not: 'CANCELLED' },
      },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        _count: { select: { players: true } },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return lobbies.map((lobby) => {
      const playersJoined = lobby._count.players;
      let currentStatus: LfgLobbyStatus = lobby.status;
      
      // Dynamically determine IN_PROGRESS status based on current time
      if (now >= lobby.startTime && now < lobby.endTime) {
        currentStatus = 'IN_PROGRESS';
      }
      
      return {
        id: lobby.id,
        type: lobby.type,
        sport: lobby.sport,
        location: lobby.location,
        playgroundId: lobby.playgroundId,
        startTime: lobby.startTime,
        endTime: lobby.endTime,
        playersNeeded: lobby.playersNeeded,
        playersJoined,
        comment: lobby.comment,
        creator: {
          name: lobby.creator.name,
          avatar: lobby.creator.avatar,
        },
        status: currentStatus,
      };
    });
  }

  async join(lobbyId: string, userId: string): Promise<LfgLobby> {
    const lobby = await this.prisma.lfgLobby.findUnique({
      where: { id: lobbyId },
      include: { _count: { select: { players: true } } },
    });

    if (!lobby) {
      throw new NotFoundException(`Лобби с ID ${lobbyId} не найдено.`);
    }

    if (lobby.endTime < new Date()) {
      throw new BadRequestException("Это лобби уже неактивно.");
    }
    
    if (lobby.status !== 'OPEN') {
      throw new ConflictException("Лобби уже заполнено или не принимает участников.");
    }

    const isAlreadyJoined = await this.prisma.lfgLobby.findFirst({
        where: { id: lobbyId, players: { some: { id: userId } } }
    });

    if (isAlreadyJoined) {
      throw new ConflictException("Вы уже находитесь в этом лобби.");
    }

    const updatedLobby = await this.prisma.lfgLobby.update({
      where: { id: lobbyId },
      data: {
        players: {
          connect: { id: userId },
        },
      },
      include: { _count: { select: { players: true } } },
    });

    // If the lobby is now full, update its status in the DB
    if (updatedLobby._count.players >= updatedLobby.playersNeeded) {
      return this.prisma.lfgLobby.update({
        where: { id: lobbyId },
        data: { status: 'FULL' },
      });
    }

    return updatedLobby;
  }
}
