import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
} from "@nestjs/common";
import { TrainingProposalsService } from "./training-proposals.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTrainingProposalDto } from "./dto/create-training-proposal.dto";
import { UpdateTrainingProposalDto } from "./dto/update-training-proposal.dto";
import { Request } from "express";

@ApiTags("Training Proposals")
@Controller("training-proposals")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TrainingProposalsController {
  constructor(
    private readonly trainingProposalsService: TrainingProposalsService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Создать новое предложение о тренировке" })
  create(@Req() req: Request, @Body() createDto: CreateTrainingProposalDto) {
    const userId = (req.user as any).userId;
    return this.trainingProposalsService.create(userId, createDto);
  }

  @Get()
  @ApiOperation({
    summary: "Получить все предложения для текущего пользователя",
  })
  findAll(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.trainingProposalsService.findAllForUser(userId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Принять или отклонить предложение" })
  updateStatus(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() updateDto: UpdateTrainingProposalDto,
  ) {
    const userId = (req.user as any).userId;
    return this.trainingProposalsService.updateStatus(userId, id, updateDto);
  }
}
