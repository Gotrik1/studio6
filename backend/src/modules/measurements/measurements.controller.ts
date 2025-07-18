import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { MeasurementsService } from "./measurements.service";
import { CreateMeasurementDto } from "./dto/create-measurement.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthenticatedRequest } from "@/shared/types/authenticated-request";

@ApiTags("Measurements")
@Controller("measurements")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  @ApiOperation({ summary: "Создать новую запись о замерах" })
  create(
    @Body() createMeasurementDto: CreateMeasurementDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.measurementsService.create(userId, createMeasurementDto);
  }

  @Get()
  @ApiOperation({ summary: "Получить все замеры для текущего пользователя" })
  findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.measurementsService.findAllForUser(userId);
  }
}
