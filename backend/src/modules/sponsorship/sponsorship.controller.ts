import { Controller, Get, UseGuards } from "@nestjs/common";
import { SponsorshipService } from "./sponsorship.service";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Sponsorship")
@Controller("sponsorship")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SponsorshipController {
  constructor(private readonly sponsorshipService: SponsorshipService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Получить данные для дашборда спонсорства" })
  getDashboardData() {
    return this.sponsorshipService.getDashboardData();
  }
}
