import { Controller, Get, Param } from "@nestjs/common";
import { LeaguesService } from "./leagues.service";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("Leagues")
@Controller("leagues")
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Public()
  @Get()
  findAll() {
    return this.leaguesService.findAll();
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.leaguesService.findOne(id);
  }
}
