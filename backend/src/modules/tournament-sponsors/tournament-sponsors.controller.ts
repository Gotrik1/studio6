import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { TournamentSponsorsService } from "./tournament-sponsors.service";
import { AssignSponsorDto } from "./dto/assign-sponsor.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Tournaments")
@Controller("tournaments/:tournamentId/sponsors")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TournamentSponsorsController {
  constructor(private readonly service: TournamentSponsorsService) {}

  @Get()
  getAssignedSponsors(@Param("tournamentId") tournamentId: string) {
    return this.service.getAssignedSponsors(tournamentId);
  }

  @Post()
  assignSponsor(
    @Param("tournamentId") tournamentId: string,
    @Body() dto: AssignSponsorDto,
  ) {
    return this.service.assignSponsor(tournamentId, dto.sponsorId, dto.amount);
  }

  @Delete(":sponsorId")
  unassignSponsor(
    @Param("tournamentId") tournamentId: string,
    @Param("sponsorId") sponsorId: string,
  ) {
    return this.service.unassignSponsor(tournamentId, sponsorId);
  }
}
