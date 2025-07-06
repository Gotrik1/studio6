import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async findAll(userId: string) {
    const userWithFriends = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        friends: {
          select: {
            id: true,
            name: true,
            avatar: true,
            status: true,
          },
        },
      },
    });

    if (!userWithFriends) {
      throw new NotFoundException("User not found");
    }

    return userWithFriends.friends.map((friend) => ({
      ...friend,
      avatarHint: "player avatar", // Add hint for frontend
    }));
  }

  async findRequests(userId: string) {
    const requests = await this.prisma.friendRequest.findMany({
      where: {
        toId: userId,
        status: "PENDING",
      },
      include: {
        from: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // In a real app, you would calculate mutual friends.
    // For now, we'll return a mock count.
    return requests.map((req) => ({
      id: req.id,
      name: req.from.name,
      avatar: req.from.avatar,
      avatarHint: "player avatar",
      mutualFriends: Math.floor(Math.random() * 5),
    }));
  }

  findSuggestions() {
    // This is a placeholder for a real suggestion engine
    return this.prisma.user.findMany({
      take: 5,
      orderBy: { xp: "desc" },
    });
  }

  async sendRequest(fromId: string, toId: string) {
    if (fromId === toId) {
      throw new BadRequestException(
        "You cannot send a friend request to yourself.",
      );
    }

    // Check if they are already friends
    const areFriends = await this.prisma.user.findFirst({
      where: { id: fromId, friends: { some: { id: toId } } },
    });
    if (areFriends) {
      throw new ConflictException("You are already friends with this user.");
    }

    // Check for existing pending request
    const existingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { fromId, toId },
          { fromId: toId, toId: fromId },
        ],
      },
    });

    if (existingRequest) {
      if (existingRequest.status === "PENDING") {
        throw new ConflictException("A friend request already exists.");
      } else if (existingRequest.status === "ACCEPTED") {
        throw new ConflictException("You are already friends.");
      }
    }

    const newRequest = await this.prisma.friendRequest.create({
      data: { fromId, toId },
      include: { from: { select: { name: true } } },
    });

    // Publish event to RabbitMQ
    this.amqpConnection.publish("prodvor_exchange", "friend.request.created", {
      fromUserId: fromId,
      fromUserName: newRequest.from.name,
      toUserId: toId,
    });

    return newRequest;
  }

  async acceptRequest(requestId: string, userId: string) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.toId !== userId || request.status !== "PENDING") {
      throw new NotFoundException(
        "Friend request not found or you are not the recipient.",
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Add each user to the other's friend list
      await tx.user.update({
        where: { id: request.fromId },
        data: { friends: { connect: { id: request.toId } } },
      });
      await tx.user.update({
        where: { id: request.toId },
        data: { friends: { connect: { id: request.fromId } } },
      });
      // Update the request status
      return tx.friendRequest.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      });
    });
  }

  async declineRequest(requestId: string, userId: string) {
    const request = await this.prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || (request.toId !== userId && request.fromId !== userId)) {
      throw new NotFoundException(
        "Friend request not found or you are not part of this request.",
      );
    }
    return this.prisma.friendRequest.delete({ where: { id: requestId } });
  }

  async removeFriend(userId: string, friendId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { friends: { disconnect: { id: friendId } } },
      });
      await tx.user.update({
        where: { id: friendId },
        data: { friends: { disconnect: { id: userId } } },
      });
      // Also remove any friend requests between them
      await tx.friendRequest.deleteMany({
        where: {
          OR: [
            { fromId: userId, toId: friendId },
            { fromId: friendId, toId: userId },
          ],
        },
      });
    });
  }
}
