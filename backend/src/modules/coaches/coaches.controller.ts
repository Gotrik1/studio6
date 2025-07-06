import { Controller, Get } from "@nestjs/common";
import { CoachesService } from "./coaches.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";
import { CoachDto } from "./dto/coach.dto";

@ApiTags("Coaches")
@Controller("coaches")
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Получить список всех тренеров" })
  @ApiResponse({
    status: 200,
    description: "Список всех тренеров.",
    type: [CoachDto],
  })
  findAll(): Promise<CoachDto[]> {
    return this.coachesService.findAll();
  }
}
