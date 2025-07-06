import { Controller, Get, Post, UseGuards, Req } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

@ApiTags("Notifications")
@Controller("notifications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Получить уведомления для текущего пользователя" })
  getNotifications(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.notificationsService.getNotifications(userId);
  }

  @Post("mark-all-read")
  @ApiOperation({ summary: "Отметить все уведомления как прочитанные" })
  markAllAsRead(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.notificationsService.markAllAsRead(userId);
  }
}
