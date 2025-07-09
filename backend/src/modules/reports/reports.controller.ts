import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { ResolveReportDto } from "./dto/resolve-report.dto";
import { ReportStatus } from "@prisma/client";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "@/shared/types/authenticated-request";

@ApiTags("Reports")
@Controller("reports")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(
    @Body() createReportDto: CreateReportDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const reporterId = req.user.userId;
    return this.reportsService.create(reporterId, createReportDto);
  }

  @Get()
  @ApiQuery({ name: "status", enum: ReportStatus, required: false })
  findAll(@Query("status") status?: ReportStatus) {
    return this.reportsService.findAll(status);
  }

  @Patch(":id/resolve")
  resolve(
    @Param("id") id: string,
    @Body() resolveReportDto: ResolveReportDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const resolverId = req.user.userId;
    return this.reportsService.resolve(id, resolverId, resolveReportDto);
  }
}
