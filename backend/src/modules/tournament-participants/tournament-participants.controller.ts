import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
} from "@nestjs/common";
import { TournamentParticipantsService } from "./tournament-participants.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UpdateApplicationStatusDto } from "./dto/update-application-status.dto";

@ApiTags("Tournaments")
@Controller("tournaments/:tournamentId")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TournamentParticipantsController {
  constructor(private readonly service: TournamentParticipantsService) {}

  @Get("applications")
  getApplications(@Param("tournamentId") tournamentId: string) {
    return this.service.getApplications(tournamentId);
  }

  @Get("participants")
  getParticipants(@Param("tournamentId") tournamentId: string) {
    return this.service.getParticipants(tournamentId);
  }

  @Patch("applications/:applicationId")
  updateApplicationStatus(
    @Param("applicationId") applicationId: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.service.updateApplicationStatus(applicationId, dto.status);
  }

  @Delete("participants/:teamId")
  removeParticipant(
    @Param("tournamentId") tournamentId: string,
    @Param("teamId") teamId: string,
  ) {
    return this.service.removeParticipant(tournamentId, teamId);
  }
}
