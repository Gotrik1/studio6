import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { TournamentJudgesService } from "./tournament-judges.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AssignJudgeDto } from "./dto/assign-judge.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Tournaments")
@Controller("tournaments/:tournamentId/judges")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TournamentJudgesController {
  constructor(private readonly service: TournamentJudgesService) {}

  @Get()
  getAssignedJudges(@Param("tournamentId") tournamentId: string) {
    return this.service.getAssignedJudges(tournamentId);
  }

  @Post()
  assignJudge(
    @Param("tournamentId") tournamentId: string,
    @Body() dto: AssignJudgeDto,
  ) {
    return this.service.assignJudge(tournamentId, dto.judgeId);
  }

  @Delete(":judgeId")
  unassignJudge(
    @Param("tournamentId") tournamentId: string,
    @Param("judgeId") judgeId: string,
  ) {
    return this.service.unassignJudge(tournamentId, judgeId);
  }
}
