import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { ChallengesService } from "./challenges.service";
import { CreateChallengeDto } from "./dto/create-challenge.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { AuthenticatedRequest } from "@/shared/types/authenticated-request";
import { ChallengeDto } from "./dto/challenge.dto";

@ApiTags("Challenges")
@Controller("challenges")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @ApiOperation({ summary: "Создать новый вызов" })
  create(
    @Body() createChallengeDto: CreateChallengeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.challengesService.create(createChallengeDto, userId);
  }

  @Get()
  @ApiOperation({ summary: "Получить список вызовов" })
  @ApiQuery({ name: "filter", enum: ["open", "my", "history"], required: true })
  findAll(
    @Query("filter") filter: "open" | "my" | "history",
    @Req() req: AuthenticatedRequest,
  ): Promise<ChallengeDto[]> {
    const userId = req.user?.userId;
    return this.challengesService.findAll(filter, userId);
  }

  @Post(":id/accept")
  @ApiOperation({ summary: "Принять вызов" })
  accept(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.challengesService.accept(id, userId);
  }
}
