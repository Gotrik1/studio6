import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from "@nestjs/common";
import { ActivitiesService } from "./activities.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { CreateStatusActivityDto } from "./dto/create-status-activity.dto";
import { CreateCheckInDto } from "./dto/create-check-in.dto";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("Activities")
@Controller("activities")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Public() // For demo purposes, make it public to avoid auth issues if user is not logged in when viewing a playground
  @Get("playground/:playgroundId")
  @ApiOperation({ summary: "Получить ленту активности для площадки" })
  getPlaygroundFeed(@Param("playgroundId") playgroundId: string) {
    return this.activitiesService.getPlaygroundFeed(playgroundId);
  }

  @Post("status")
  @ApiOperation({ summary: "Опубликовать новый статус" })
  postStatus(
    @Body() createStatusDto: CreateStatusActivityDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).userId;
    return this.activitiesService.createStatusPost(
      userId,
      createStatusDto.text,
    );
  }

  @Post("check-in")
  @ApiOperation({ summary: "Отметиться на площадке" })
  postCheckIn(@Body() createCheckInDto: CreateCheckInDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.activitiesService.createCheckInActivity(
      userId,
      createCheckInDto,
    );
  }
}
