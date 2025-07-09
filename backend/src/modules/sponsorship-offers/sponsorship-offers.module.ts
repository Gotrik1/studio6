import { Module } from "@nestjs/common";
import { SponsorshipOffersService } from "./sponsorship-offers.service";
import { SponsorshipOffersController } from "./sponsorship-offers.controller";

@Module({
  controllers: [SponsorshipOffersController],
  providers: [SponsorshipOffersService],
})
export class SponsorshipOffersModule {}
