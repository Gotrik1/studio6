import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
  Delete,
} from "@nestjs/common";
import { PlaygroundsService } from "./playgrounds.service";
import { CreatePlaygroundDto } from "./dto/create-playground.dto";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "@/shared/types/authenticated-request";
import { CreateReviewDto } from "./dto/create-review.dto";
import { KingOfTheCourtDto } from "./dto/king-of-the-court.dto";
import { PlaygroundReviewSummaryDto } from "./dto/playground-review-summary.dto";

@ApiTags("Playgrounds")
@Controller("playgrounds")
export class PlaygroundsController {
  constructor(private readonly playgroundsService: PlaygroundsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Создать новую площадку" })
  create(
    @Body() createPlaygroundDto: CreatePlaygroundDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.playgroundsService.create(createPlaygroundDto, userId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: "Получить список одобренных площадок" })
  findAll() {
    return this.playgroundsService.findAll();
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Получить площадку по ID" })
  findOne(@Param("id") id: string) {
    return this.playgroundsService.findOne(id);
  }

  @Public()
  @Get(":id/schedule")
  @ApiOperation({ summary: "Получить расписание для площадки" })
  findSchedule(@Param("id") id: string) {
    return this.playgroundsService.findSchedule(id);
  }

  @Public()
  @Get(":id/king-of-the-court")
  @ApiOperation({ summary: 'Получить "Короля площадки"' })
  @ApiResponse({
    status: 200,
    description: "Команда с наибольшим количеством побед на этой площадке.",
    type: KingOfTheCourtDto,
  })
  @ApiResponse({
    status: 404,
    description: "Площадка не найдена или нет сыгранных матчей.",
  })
  getKingOfTheCourt(@Param("id") id: string) {
    return this.playgroundsService.getKingOfTheCourt(id);
  }

  @Public()
  @Get(":id/leaderboard")
  @ApiOperation({ summary: "Получить лидеров площадки по чекинам" })
  getLeaderboard(@Param("id") id: string) {
    return this.playgroundsService.getPlaygroundLeaderboard(id);
  }

  @Public()
  @Get(":id/reviews")
  @ApiOperation({ summary: "Получить отзывы для площадки" })
  findReviews(@Param("id") id: string) {
    return this.playgroundsService.findReviews(id);
  }

  @Public()
  @Get(":id/review-summary")
  @ApiOperation({ summary: "Получить AI-сводку по отзывам о площадке" })
  @ApiResponse({
    status: 200,
    description: "Сводка по отзывам.",
    type: PlaygroundReviewSummaryDto,
  })
  getReviewSummary(@Param("id") id: string) {
    return this.playgroundsService.getReviewSummary(id);
  }

  @Post(":id/reviews")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Оставить отзыв о площадке" })
  createReview(
    @Param("id") id: string,
    @Body() dto: CreateReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.playgroundsService.addReview(id, userId, dto);
  }

  // --- Admin Routes ---
  @Get("admin/all")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Получить все площадки (для админки)" })
  findAllForAdmin() {
    return this.playgroundsService.findAllForAdmin();
  }

  @Patch("admin/:id/approve")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Одобрить площадку (для админки)" })
  approve(@Param("id") id: string) {
    return this.playgroundsService.approve(id);
  }

  @Delete("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Удалить площадку (для админки)" })
  remove(@Param("id") id: string) {
    return this.playgroundsService.remove(id);
  }
}
