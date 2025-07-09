import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from "@nestjs/common";
import { PlaygroundReportsService } from "./playground-reports.service";
import { CreatePlaygroundReportDto } from "./dto/create-playground-report.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "@/shared/types/authenticated-request";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("Playgrounds")
@Controller()
export class PlaygroundReportsController {
  constructor(private readonly service: PlaygroundReportsService) {}

  @Post("playground-reports")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Отправить жалобу на площадку" })
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePlaygroundReportDto,
  ) {
    const reporterId = req.user.userId;
    return this.service.createReport(reporterId, dto);
  }

  @Public()
  @Get("playgrounds/:id/condition")
  @ApiOperation({
    summary: "Получить последнее сообщение о состоянии площадки",
  })
  getCondition(@Param("id") id: string) {
    return this.service.getLatestConditionReport(id);
  }
}
