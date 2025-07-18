import { Controller, Get, Param } from "@nestjs/common";
import { SponsorsService } from "./sponsors.service";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("Sponsors")
@Controller("sponsors")
export class SponsorsController {
  constructor(private readonly sponsorsService: SponsorsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Получить список всех спонсоров" })
  findAll() {
    return this.sponsorsService.findAll();
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Получить спонсора по ID" })
  findOne(@Param("id") id: string) {
    return this.sponsorsService.findOne(id);
  }
}
