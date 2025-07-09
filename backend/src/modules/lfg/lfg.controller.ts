import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { LfgService } from "./lfg.service";
import { CreateLfgLobbyDto } from "./dto/create-lfg-lobby.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";
import { AuthenticatedRequest } from "@/shared/types/authenticated-request";

@ApiTags("LFG")
@Controller("lfg")
export class LfgController {
  constructor(private readonly lfgService: LfgService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Создать новое лобби" })
  create(
    @Body() createLfgLobbyDto: CreateLfgLobbyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.lfgService.create(createLfgLobbyDto, userId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: "Получить список всех лобби" })
  findAll() {
    return this.lfgService.findAll();
  }

  @Post(":id/join")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Присоединиться к лобби" })
  join(@Param("id") lobbyId: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.lfgService.join(lobbyId, userId);
  }
}
