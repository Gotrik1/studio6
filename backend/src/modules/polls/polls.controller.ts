import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { PollsService } from "./polls.service";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { VoteDto } from "./dto/vote.dto";
import { AuthenticatedRequest } from "@/shared/types/authenticated-request";

@ApiTags("Polls")
@Controller("polls")
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Public()
  @Get("latest")
  @ApiOperation({ summary: "Получить последний активный опрос" })
  getLatestPoll() {
    return this.pollsService.getLatestActivePoll();
  }

  @Post(":pollId/vote")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Проголосовать в опросе" })
  vote(
    @Req() req: AuthenticatedRequest,
    @Param("pollId") pollId: string,
    @Body() voteDto: VoteDto,
  ) {
    const userId = req.user.userId;
    return this.pollsService.vote({
      userId,
      pollId,
      optionId: voteDto.optionId,
    });
  }
}
