import { Controller } from "@nestjs/common";
import { SponsorshipOffersService } from "./sponsorship-offers.service";

@Controller("sponsorship-offers")
export class SponsorshipOffersController {
  constructor(
    private readonly sponsorshipOffersService: SponsorshipOffersService,
  ) {}
}
