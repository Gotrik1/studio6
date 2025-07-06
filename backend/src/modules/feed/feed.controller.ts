import { Controller, Get, UseGuards } from "@nestjs/common";
import { FeedService } from "./feed.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Feed")
@Controller("feed")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  @ApiOperation({ summary: "Получить глобальную ленту активности" })
  getFeed() {
    return this.feedService.getFeed();
  }
}
