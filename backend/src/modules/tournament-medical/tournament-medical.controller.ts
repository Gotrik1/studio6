import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { TournamentMedicalService } from "./tournament-medical.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AssignMedicalDto } from "./dto/assign-medical.dto";

@ApiTags("Tournaments")
@Controller("tournaments/:tournamentId/medical")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TournamentMedicalController {
  constructor(private readonly service: TournamentMedicalService) {}

  @Get()
  getAssignedMedicalStaff(@Param("tournamentId") tournamentId: string) {
    return this.service.getAssignedMedicalStaff(tournamentId);
  }

  @Post()
  assignMedicalStaff(
    @Param("tournamentId") tournamentId: string,
    @Body() dto: AssignMedicalDto,
  ) {
    return this.service.assignMedicalStaff(tournamentId, dto.partnerId);
  }

  @Delete(":partnerId")
  unassignMedicalStaff(
    @Param("tournamentId") tournamentId: string,
    @Param("partnerId") partnerId: string,
  ) {
    return this.service.unassignMedicalStaff(tournamentId, partnerId);
  }
}
