import { Controller, Get, UseGuards } from "@nestjs/common";
import { MedicalPartnersService } from "./medical-partners.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Medical")
@Controller("medical-partners")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MedicalPartnersController {
  constructor(private readonly service: MedicalPartnersService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
