import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  UseGuards,
  Req,
  Delete,
} from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { JoinTeamDto } from "./dto/join-team.dto";
import { LeaderboardTeamDto } from "./dto/leaderboard-team.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "@/shared/types/authenticated-request";
import { SetHomePlaygroundDto } from "./dto/set-home-playground.dto";
import { SetCaptainDto } from "./dto/set-captain.dto";
import { CreatePracticeDto } from "./dto/create-practice.dto";
import type { AnalyzeTeamPerformanceOutput } from "@/ai/flows/analyze-team-performance-flow";

@ApiTags("Teams")
@Controller("teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Public()
  @Get("leaderboard")
  @ApiQuery({
    name: "game",
    required: false,
    description: "Фильтр по названию игры",
  })
  getLeaderboard(@Query("game") game?: string): Promise<LeaderboardTeamDto[]> {
    return this.teamsService.getLeaderboard({ game });
  }

  @Public()
  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Public()
  @Get(":id/dashboard")
  getDashboardData(@Param("id") id: string) {
    return this.teamsService.getDashboardData(id);
  }

  @Get(":id/coach-summary")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getCoachSummary(
    @Param("id") id: string,
  ): Promise<AnalyzeTeamPerformanceOutput> {
    return this.teamsService.getCoachSummary(id);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.teamsService.findOne(id);
  }

  @Public()
  @Get("slug/:slug")
  findBySlug(@Param("slug") slug: string) {
    return this.teamsService.findBySlug(slug);
  }

  @Get(":teamId/practices")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findPractices(@Param("teamId") teamId: string) {
    return this.teamsService.findPracticesForTeam(teamId);
  }

  @Post(":teamId/practices")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createPractice(
    @Param("teamId") teamId: string,
    @Body() createPracticeDto: CreatePracticeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const captainId = req.user.userId;
    return this.teamsService.createPractice(
      teamId,
      captainId,
      createPracticeDto,
    );
  }

  @Post(":id/join")
  join(@Param("id") teamId: string, @Body() joinTeamDto: JoinTeamDto) {
    return this.teamsService.joinTeam(teamId, joinTeamDto.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":teamId/home-playground")
  setHomePlayground(
    @Param("teamId") teamId: string,
    @Body() setHomePlaygroundDto: SetHomePlaygroundDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const captainId = req.user.userId;
    return this.teamsService.setHomePlayground(
      teamId,
      setHomePlaygroundDto.playgroundId,
      captainId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":teamId/members/:memberId")
  removeMember(
    @Param("teamId") teamId: string,
    @Param("memberId") memberId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const captainId = req.user.userId;
    return this.teamsService.removeMember(teamId, memberId, captainId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":teamId/captain")
  setCaptain(
    @Param("teamId") teamId: string,
    @Body() dto: SetCaptainDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const currentCaptainId = req.user.userId;
    return this.teamsService.setCaptain(
      teamId,
      dto.newCaptainId,
      currentCaptainId,
    );
  }
}
