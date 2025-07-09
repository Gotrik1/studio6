import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { TeamApplicationsService } from "./team-applications.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "@/shared/types/authenticated-request";
import { CreateTeamApplicationDto } from "./dto/create-team-application.dto";

@ApiTags("Teams")
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamApplicationsController {
  constructor(private readonly service: TeamApplicationsService) {}

  @Post("team-applications")
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateTeamApplicationDto,
  ) {
    const userId = req.user.userId;
    return this.service.create(userId, dto);
  }

  @Get("teams/:teamId/applications")
  findForTeam(
    @Req() req: AuthenticatedRequest,
    @Param("teamId") teamId: string,
  ) {
    const captainId = req.user.userId;
    return this.service.findForTeam(teamId, captainId);
  }

  @Patch("team-applications/:id/accept")
  accept(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    const captainId = req.user.userId;
    return this.service.accept(id, captainId);
  }

  @Patch("team-applications/:id/decline")
  decline(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    const captainId = req.user.userId;
    return this.service.decline(id, captainId);
  }
}
