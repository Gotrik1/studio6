import { Module } from "@nestjs/common";
import { MedicalPartnersService } from "./medical-partners.service";
import { MedicalPartnersController } from "./medical-partners.controller";

@Module({
  controllers: [MedicalPartnersController],
  providers: [MedicalPartnersService],
})
export class MedicalPartnersModule {}
