import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  Body,
} from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";
import { CreateFriendRequestDto } from "./dto/create-friend-request.dto";

@ApiTags("Friends")
@Controller("friends")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: "Получить список друзей" })
  findAll(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.friendsService.findAll(userId);
  }

  @Get("requests")
  @ApiOperation({ summary: "Получить входящие запросы в друзья" })
  findRequests(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.friendsService.findRequests(userId);
  }

  @Get("suggestions")
  @ApiOperation({ summary: "Получить рекомендации друзей" })
  findSuggestions() {
    // This can be enhanced later to provide real suggestions
    return this.friendsService.findSuggestions();
  }

  @Post("requests")
  @ApiOperation({ summary: "Отправить запрос в друзья" })
  sendRequest(@Body() dto: CreateFriendRequestDto, @Req() req: Request) {
    const fromId = (req.user as any).userId;
    return this.friendsService.sendRequest(fromId, dto.toId);
  }

  @Post("requests/:id/accept")
  @ApiOperation({ summary: "Принять запрос в друзья" })
  acceptRequest(@Param("id") requestId: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.friendsService.acceptRequest(requestId, userId);
  }

  @Delete("requests/:id")
  @ApiOperation({ summary: "Отклонить запрос в друзья" })
  declineRequest(@Param("id") requestId: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.friendsService.declineRequest(requestId, userId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Удалить друга" })
  removeFriend(@Param("id") friendId: string, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.friendsService.removeFriend(userId, friendId);
  }
}
